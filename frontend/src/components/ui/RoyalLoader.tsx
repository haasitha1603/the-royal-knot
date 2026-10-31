import React from 'react';

interface RoyalLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export const RoyalLoader: React.FC<RoyalLoaderProps> = ({
  message = "Preparing your royal experience...",
  size = 'md',
  fullScreen = false,
}) => {
  // Size calculations for the 4 wedding icons
  const iconSizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';
  const containerGap = size === 'sm' ? 'gap-2' : size === 'lg' ? 'gap-4' : 'gap-3';

  const loaderContent = (
    <div className="flex flex-col items-center justify-center p-4 select-none">
      <div className={`flex items-center ${containerGap} mb-3`}>
        {/* 1. Indian Wedding Necklace (Haar) - Gold */}
        <div className="animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.2s' }}>
          <svg
            className={`${iconSizeClass} text-gold-500 fill-current drop-shadow-sm`}
            viewBox="0 0 24 24"
            aria-label="Wedding Necklace"
          >
            {/* Elegant choker necklace with pendant droplets */}
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29.35.74 1.34.86 1.83.22.37-.48.24-1.18-.18-1.74C4.24 13.84 4 12.95 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 .95-.24 1.84-.62 2.77-.42.56-.55 1.26-.18 1.74.49.64 1.48.52 1.83-.22.61-1.31.97-2.75.97-4.29 0-5.52-4.48-10-10-10z" />
            <circle cx="12" cy="18" r="2.5" />
            <circle cx="8" cy="16.5" r="1.8" />
            <circle cx="16" cy="16.5" r="1.8" />
            <circle cx="5" cy="14" r="1.3" />
            <circle cx="19" cy="14" r="1.3" />
          </svg>
        </div>

        {/* 2. Wedding Bells - Champagne / Warm Gold */}
        <div className="animate-bounce" style={{ animationDelay: '180ms', animationDuration: '1.2s' }}>
          <svg
            className={`${iconSizeClass} text-gold-400 fill-current drop-shadow-sm`}
            viewBox="0 0 24 24"
            aria-label="Wedding Bells"
          >
            {/* Twin wedding bells silhouette */}
            <path d="M10 4a4 4 0 00-4 4v4.27c0 .76-.32 1.48-.88 1.98L4.2 15.08C3.45 15.75 3.92 17 4.93 17h10.14c1.01 0 1.48-1.25.73-1.92l-.92-.83A2.66 2.66 0 0114 12.27V8a4 4 0 00-4-4zm-1.5 14a1.5 1.5 0 003 0h-3z" />
            <path d="M17.5 7.5a3 3 0 012.82 2.1c.3.93.88 1.74 1.68 2.3l.5.35c.6.42.27 1.35-.47 1.35h-3.03v-4.5c0-.57-.5-1.07-1.07-1.12.02-.16.07-.32.07-.48z" />
          </svg>
        </div>

        {/* 3. Wedding Ring - Deep Burgundy */}
        <div className="animate-bounce" style={{ animationDelay: '360ms', animationDuration: '1.2s' }}>
          <svg
            className={`${iconSizeClass} text-burgundy-700 fill-current drop-shadow-sm`}
            viewBox="0 0 24 24"
            aria-label="Wedding Ring"
          >
            {/* Solitaire diamond wedding band */}
            <path d="M12 2l2.2 2.5-1.2 1.8h-2l-1.2-1.8L12 2z" />
            <path d="M12 6.5C8.41 6.5 5.5 9.41 5.5 13s2.91 6.5 6.5 6.5 6.5-2.91 6.5-6.5-2.91-6.5-6.5-6.5zm0 10.5c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z" />
          </svg>
        </div>

        {/* 4. Bridal Kalire (Traditional Indian Bridal Accessory) - Wedding Red */}
        <div className="animate-bounce" style={{ animationDelay: '540ms', animationDuration: '1.2s' }}>
          <svg
            className={`${iconSizeClass} text-weddingred fill-current drop-shadow-sm`}
            viewBox="0 0 24 24"
            aria-label="Bridal Kalire"
          >
            {/* Bridal Kalire umbrella canopy with tiered dangling droplets */}
            <path d="M12 2a1 1 0 011 1v1.1c3.05.42 5.5 2.8 5.9 5.9H5.1c.4-3.1 2.85-5.48 5.9-5.9V3a1 1 0 011-1z" />
            <path d="M7 12h10l-1.5 3h-7L7 12z" />
            <circle cx="8" cy="18" r="1.2" />
            <circle cx="12" cy="18.5" r="1.4" />
            <circle cx="16" cy="18" r="1.2" />
            <circle cx="12" cy="22" r="1" />
          </svg>
        </div>
      </div>

      {message && (
        <p className="text-xs tracking-wider uppercase font-medium text-gold-700 animate-pulse text-center max-w-xs">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-ivory-100/90 backdrop-blur-sm transition-all duration-300">
        <div className="p-8 rounded-2xl bg-white/95 border border-gold-300/60 shadow-royal-lg">
          {loaderContent}
        </div>
      </div>
    );
  }

  return loaderContent;
};
