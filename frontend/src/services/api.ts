const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('royal_knot_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorData.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (data: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  register: (data: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request<any>('/auth/me'),

  // Weddings
  getWeddings: () => request<any[]>('/weddings'),
  getWedding: (id: string) => request<any>(`/weddings/${id}`),
  createWedding: (data: any) => request<any>('/weddings', { method: 'POST', body: JSON.stringify(data) }),
  updateWedding: (id: string, data: any) => request<any>(`/weddings/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  getWeddingFunctions: (id: string) => request<any[]>(`/weddings/${id}/functions`),

  // Venues
  getVenues: (params?: { category?: string; city?: string; min_capacity?: number }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.city) query.append('city', params.city);
    if (params?.min_capacity) query.append('min_capacity', params.min_capacity.toString());
    const qs = query.toString();
    return request<any[]>(`/venues${qs ? `?${qs}` : ''}`);
  },
  getVenue: (id: string) => request<any>(`/venues/${id}`),

  // Vendors
  getVendors: (params?: { category?: string; city?: string; verified_only?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append('category', params.category);
    if (params?.city) query.append('city', params.city);
    if (params?.verified_only) query.append('verified_only', 'true');
    const qs = query.toString();
    return request<any[]>(`/vendors${qs ? `?${qs}` : ''}`);
  },
  getVendor: (id: string) => request<any>(`/vendors/${id}`),
  updateVendorVerification: (id: string, data: { verified_status: string; admin_notes?: string }) =>
    request<any>(`/vendors/${id}/verification`, { method: 'PUT', body: JSON.stringify(data) }),

  // Quotations & Catering Comparison
  getWeddingQuotations: (weddingId: string) => request<any[]>(`/quotations/wedding/${weddingId}`),
  compareCateringQuotations: (weddingId: string) => request<any>(`/quotations/wedding/${weddingId}/compare-catering`),
  acceptQuotation: (quotationId: string) => request<any>(`/quotations/${quotationId}/accept`, { method: 'POST' }),

  // Budget Guardian
  getBudgetOverview: (weddingId: string) => request<any>(`/budgets/wedding/${weddingId}/overview`),
  simulateExtraGuests: (weddingId: string, data: { additional_guests: number; catering_price_per_plate?: number }) =>
    request<any>(`/budgets/wedding/${weddingId}/simulate-extra-guests`, { method: 'POST', body: JSON.stringify(data) }),
  createBudgetChangeRequest: (weddingId: string, data: { additional_guests: number; reason: string }) =>
    request<any>(`/budgets/wedding/${weddingId}/change-requests`, { method: 'POST', body: JSON.stringify(data) }),
  getBudgetChangeRequests: (weddingId: string) => request<any[]>(`/budgets/wedding/${weddingId}/change-requests`),
  approveBudgetChangeRequest: (requestId: string) => request<any>(`/budgets/change-requests/${requestId}/approve`, { method: 'POST' }),

  // Payments
  getPayments: (weddingId: string) => request<any[]>(`/payments/wedding/${weddingId}`),
  simulatePaymentSettlement: (paymentId: string, data: { payment_method: string; notes?: string }) =>
    request<any>(`/payments/${paymentId}/simulate-settlement`, { method: 'POST', body: JSON.stringify(data) }),

  // Guests & Seating
  getGuests: (weddingId: string) => request<any[]>(`/guests/wedding/${weddingId}`),
  addGuest: (weddingId: string, data: any) => request<any>(`/guests/wedding/${weddingId}`, { method: 'POST', body: JSON.stringify(data) }),
  updateGuestRsvp: (guestId: string, rsvpStatus: string) =>
    request<any>(`/guests/${guestId}/rsvp?rsvp_status=${encodeURIComponent(rsvpStatus)}`, { method: 'PUT' }),
  simulateGuestCheckin: (guestId: string) => request<any>(`/guests/${guestId}/simulate-checkin`, { method: 'POST' }),
  getSeatingTables: (weddingId: string) => request<any[]>(`/guests/wedding/${weddingId}/tables`),
  assignGuestToTable: (weddingId: string, tableId: string, guestId: string) =>
    request<any>(`/guests/wedding/${weddingId}/tables/${tableId}/assign-guest/${guestId}`, { method: 'POST' }),

  // Operations & Live Command Centre
  getTasks: (weddingId: string) => request<any[]>(`/operations/wedding/${weddingId}/tasks`),
  createTask: (weddingId: string, data: any) => request<any>(`/operations/wedding/${weddingId}/tasks`, { method: 'POST', body: JSON.stringify(data) }),
  updateTaskStatus: (taskId: string, status: string) =>
    request<any>(`/operations/tasks/${taskId}/status?status=${encodeURIComponent(status)}`, { method: 'PUT' }),
  getSchedule: (weddingId: string) => request<any[]>(`/operations/wedding/${weddingId}/schedule`),
  simulateVendorDelay: (weddingId: string, data: { delay_minutes: number; vendor_name: string; reason: string }) =>
    request<any>(`/operations/wedding/${weddingId}/simulate-vendor-delay`, { method: 'POST', body: JSON.stringify(data) }),
  publishRevisedSchedule: (weddingId: string) => request<any>(`/operations/wedding/${weddingId}/publish-revised-schedule`, { method: 'POST' }),
  getIncidents: (weddingId: string) => request<any[]>(`/operations/wedding/${weddingId}/incidents`),
  getNotifications: () => request<any[]>('/operations/notifications'),

  // AI Copilot
  queryAI: (weddingId: string, query: string) =>
    request<any>('/ai/query', { method: 'POST', body: JSON.stringify({ wedding_id: weddingId, query }) }),

  // Admin
  getAdminAnalytics: () => request<any>('/admin/analytics'),
  getVerificationQueue: () => request<any[]>('/admin/verification-queue'),
  updateVerificationDecision: (vendorId: string, action: string, notes?: string) =>
    request<any>(`/admin/verification-queue/${vendorId}/decision?action=${action}&notes=${encodeURIComponent(notes || '')}`, { method: 'POST' }),
  getComplaints: () => request<any[]>('/admin/complaints'),
  getPrivacyRequests: () => request<any[]>('/admin/privacy-requests'),
};
