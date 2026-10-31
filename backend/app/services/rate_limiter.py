import time
import uuid
import logging
import threading
from collections import defaultdict
from typing import Optional, Dict, Any, Tuple
from fastapi import Request, HTTPException, status, Depends
import redis

from backend.app.config import settings

logger = logging.getLogger(__name__)

class RateLimitExceeded(HTTPException):
    def __init__(self, policy: str, retry_after: int, message: Optional[str] = None):
        msg = message or f"Rate limit exceeded for {policy}. Please retry in {retry_after} second(s)."
        super().__init__(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": "Too Many Requests",
                "message": msg,
                "retry_after": retry_after,
                "policy": policy,
                "type": "rate_limit_exceeded"
            },
            headers={"Retry-After": str(max(1, retry_after))}
        )

class ThreadSafeInMemoryLimiter:
    """Bounded, thread-safe in-memory sliding window limiter used for local fallback."""
    def __init__(self):
        self._lock = threading.Lock()
        self._windows = defaultdict(list)
        self._max_keys = 50000

    def check_and_increment(self, key: str, max_requests: int, window_seconds: int) -> Tuple[bool, int, int]:
        now = time.time()
        with self._lock:
            # Memory safety: prune stale keys if size exceeds threshold
            if len(self._windows) > self._max_keys:
                stale_cutoff = now - 3600
                keys_to_delete = [
                    k for k, timestamps in self._windows.items()
                    if not timestamps or timestamps[-1] < stale_cutoff
                ]
                for k in keys_to_delete[:5000]:
                    del self._windows[k]

            timestamps = self._windows[key]
            # Prune timestamps outside current sliding window
            cutoff = now - window_seconds
            timestamps = [t for t in timestamps if t > cutoff]
            self._windows[key] = timestamps

            count = len(timestamps)
            if count >= max_requests:
                oldest = timestamps[0] if timestamps else now
                retry_after = max(1, int(oldest + window_seconds - now))
                return False, count, retry_after

            # Within limits: record request timestamp
            self._windows[key].append(now)
            return True, count + 1, 0

    def clear(self, key: str):
        with self._lock:
            if key in self._windows:
                del self._windows[key]

    def count(self, key: str, window_seconds: int) -> int:
        now = time.time()
        with self._lock:
            timestamps = self._windows.get(key, [])
            cutoff = now - window_seconds
            valid = [t for t in timestamps if t > cutoff]
            self._windows[key] = valid
            return len(valid)

class RateLimiterService:
    def __init__(self):
        self._redis_client: Optional[redis.Redis] = None
        self._memory_limiter = ThreadSafeInMemoryLimiter()
        self._redis_available = False
        self._last_redis_check = 0
        self._redis_reconnect_interval = 30  # seconds

    def _get_redis(self) -> Optional[redis.Redis]:
        """Lazy connects to Redis with timeout safeguards."""
        now = time.time()
        if self._redis_client is not None and self._redis_available:
            return self._redis_client

        # Don't hammer Redis reconnects if recently failed
        if now - self._last_redis_check < self._redis_reconnect_interval:
            return None

        self._last_redis_check = now
        try:
            client = redis.from_url(
                settings.REDIS_URL,
                socket_timeout=0.8,
                socket_connect_timeout=0.8,
                decode_responses=True
            )
            client.ping()
            self._redis_client = client
            self._redis_available = True
            logger.info(f"[RateLimiter] Connected to Redis cluster at {settings.REDIS_URL}")
            return self._redis_client
        except Exception as err:
            self._redis_available = False
            self._redis_client = None
            logger.debug(f"[RateLimiter] Redis unavailable ({err}), using resilient in-memory sliding window fallback.")
            return None

    def get_client_ip(self, request: Request) -> str:
        """Extracts client IP safely, accounting for reverse proxies."""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            # First IP in X-Forwarded-For is client
            return forwarded.split(",")[0].strip()
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip.strip()
        if request.client and request.client.host:
            return request.client.host
        return "127.0.0.1"

    def check_limit(self, key: str, max_requests: int, window_seconds: int, policy_name: str) -> None:
        """
        Enforces sliding-window rate limit:
        Uses Redis if available; degrades gracefully to in-memory limiter if Redis is offline.
        """
        if not settings.RATE_LIMIT_ENABLED:
            return

        redis_client = self._get_redis()
        now = time.time()

        if redis_client:
            try:
                pipe = redis_client.pipeline()
                full_key = f"trk:rl:{key}"
                cutoff = now - window_seconds
                member_id = f"{now}_{uuid.uuid4().hex[:8]}"

                pipe.zremrangebyscore(full_key, 0, cutoff)
                pipe.zadd(full_key, {member_id: now})
                pipe.zcard(full_key)
                pipe.zrange(full_key, 0, 0, withscores=True)
                pipe.expire(full_key, window_seconds + 5)
                results = pipe.execute()

                current_count = results[2]
                oldest_entries = results[3]

                if current_count > max_requests:
                    oldest_ts = oldest_entries[0][1] if oldest_entries else now
                    retry_after = max(1, int(oldest_ts + window_seconds - now))
                    raise RateLimitExceeded(policy=policy_name, retry_after=retry_after)
                return
            except RateLimitExceeded:
                raise
            except Exception as e:
                logger.warning(f"[RateLimiter] Redis query error ({e}), switching to controlled in-memory fallback.")
                self._redis_available = False

        # Controlled in-memory degradation
        allowed, count, retry_after = self._memory_limiter.check_and_increment(
            key=key,
            max_requests=max_requests,
            window_seconds=window_seconds
        )
        if not allowed:
            raise RateLimitExceeded(policy=policy_name, retry_after=retry_after)

    # -------------------------------------------------------------
    # LOGIN ENDPOINT SPECIALIZED WORKFLOWS
    # -------------------------------------------------------------
    def check_login_pre_auth(self, request: Request, email: str) -> None:
        """
        CRITICAL PRE-AUTH DEFENSE:
        Checked BEFORE database queries or CPU-heavy password hashing!
        1. Checks IP-level rate limit (30 requests / 60 seconds).
        2. Checks Account-level failed attempts limit (5 failed attempts / 300 seconds).
        """
        if not settings.RATE_LIMIT_ENABLED:
            return

        ip = self.get_client_ip(request)
        normalized_email = email.lower().strip()

        # 1. IP Login Rate Limit
        self.check_limit(
            key=f"login:ip:{ip}",
            max_requests=settings.RATE_LIMIT_LOGIN_IP_MAX,
            window_seconds=settings.RATE_LIMIT_LOGIN_IP_WINDOW,
            policy_name="ip_login_limit"
        )

        # 2. Account-level Failed Attempts Check
        account_fail_key = f"login:fail:account:{normalized_email}"
        redis_client = self._get_redis()
        now = time.time()

        if redis_client:
            try:
                cutoff = now - settings.RATE_LIMIT_LOGIN_ACCOUNT_WINDOW
                redis_client.zremrangebyscore(f"trk:rl:{account_fail_key}", 0, cutoff)
                fail_count = redis_client.zcard(f"trk:rl:{account_fail_key}")
                if fail_count >= settings.RATE_LIMIT_LOGIN_ACCOUNT_MAX:
                    oldest = redis_client.zrange(f"trk:rl:{account_fail_key}", 0, 0, withscores=True)
                    oldest_ts = oldest[0][1] if oldest else now
                    retry_after = max(1, int(oldest_ts + settings.RATE_LIMIT_LOGIN_ACCOUNT_WINDOW - now))
                    raise RateLimitExceeded(
                        policy="account_failed_attempts",
                        retry_after=retry_after,
                        message=f"Account temporarily protected after multiple failed attempts. Please retry in {retry_after} second(s)."
                    )
                return
            except RateLimitExceeded:
                raise
            except Exception:
                self._redis_available = False

        # In-memory check for account failures
        fail_count = self._memory_limiter.count(
            account_fail_key,
            settings.RATE_LIMIT_LOGIN_ACCOUNT_WINDOW
        )
        if fail_count >= settings.RATE_LIMIT_LOGIN_ACCOUNT_MAX:
            raise RateLimitExceeded(
                policy="account_failed_attempts",
                retry_after=settings.RATE_LIMIT_LOGIN_ACCOUNT_WINDOW,
                message=f"Account temporarily protected after multiple failed attempts. Please retry in {settings.RATE_LIMIT_LOGIN_ACCOUNT_WINDOW} second(s)."
            )

    def record_login_failure(self, request: Request, email: str) -> None:
        """Records failed authentication attempt for this account and IP."""
        if not settings.RATE_LIMIT_ENABLED:
            return

        ip = self.get_client_ip(request)
        normalized_email = email.lower().strip()
        account_fail_key = f"login:fail:account:{normalized_email}"
        ip_fail_key = f"login:fail:ip:{ip}"
        now = time.time()
        window = settings.RATE_LIMIT_LOGIN_ACCOUNT_WINDOW

        redis_client = self._get_redis()
        if redis_client:
            try:
                pipe = redis_client.pipeline()
                member = f"{now}_{uuid.uuid4().hex[:6]}"
                pipe.zadd(f"trk:rl:{account_fail_key}", {member: now})
                pipe.expire(f"trk:rl:{account_fail_key}", window + 10)
                pipe.zadd(f"trk:rl:{ip_fail_key}", {member: now})
                pipe.expire(f"trk:rl:{ip_fail_key}", window + 10)
                pipe.execute()
                return
            except Exception:
                self._redis_available = False

        self._memory_limiter.check_and_increment(account_fail_key, 9999, window)
        self._memory_limiter.check_and_increment(ip_fail_key, 9999, window)

    def record_login_success(self, request: Request, email: str) -> None:
        """Clears account failure count upon successful authentication."""
        if not settings.RATE_LIMIT_ENABLED:
            return

        normalized_email = email.lower().strip()
        account_fail_key = f"login:fail:account:{normalized_email}"
        redis_client = self._get_redis()
        if redis_client:
            try:
                redis_client.delete(f"trk:rl:{account_fail_key}")
            except Exception:
                pass
        self._memory_limiter.clear(account_fail_key)

    def is_allowed(self, key: str, limit: int, window_seconds: int) -> Tuple[bool, int]:
        """Utility for checking if an action is allowed within sliding window without raising an exception."""
        if not settings.RATE_LIMIT_ENABLED:
            return True, 0
        try:
            self.check_limit(key=key, max_requests=limit, window_seconds=window_seconds, policy_name="is_allowed_check")
            return True, 0
        except RateLimitExceeded as e:
            retry_after = int(e.headers.get("Retry-After", 1))
            return False, retry_after

    def reset_all_limits(self) -> None:
        """Helper for test suites and controlled test reset."""
        redis_client = self._get_redis()
        if redis_client:
            try:
                keys = redis_client.keys("trk:rl:*")
                if keys:
                    redis_client.delete(*keys)
            except Exception:
                pass
        self._memory_limiter = ThreadSafeInMemoryLimiter()

    def clear_all(self) -> None:
        """Alias for reset_all_limits."""
        self.reset_all_limits()

limiter = RateLimiterService()

# -------------------------------------------------------------
# FASTAPI ROUTE DEPENDENCY FACTORIES
# -------------------------------------------------------------
def rate_limit_ip(max_requests: int, window_seconds: int, policy_name: str):
    """Dependency that limits requests by Client IP."""
    def dependency(request: Request):
        client_ip = limiter.get_client_ip(request)
        limiter.check_limit(
            key=f"{policy_name}:ip:{client_ip}",
            max_requests=max_requests,
            window_seconds=window_seconds,
            policy_name=policy_name
        )
    return dependency

def rate_limit_user(max_requests: int, window_seconds: int, policy_name: str):
    """Dependency that limits requests by Authenticated User ID (or IP if unauthenticated)."""
    def dependency(request: Request):
        # Check authorization header
        auth = request.headers.get("Authorization")
        identifier = limiter.get_client_ip(request)
        if auth and "Bearer " in auth:
            token = auth.split("Bearer ")[1].strip()
            try:
                from jose import jwt
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
                identifier = payload.get("sub") or identifier
            except Exception:
                pass

        limiter.check_limit(
            key=f"{policy_name}:user:{identifier}",
            max_requests=max_requests,
            window_seconds=window_seconds,
            policy_name=policy_name
        )
    return dependency
