import React, { useState, useRef } from 'react';

interface MouseEffectCardProps {
  children: React.ReactNode;
  className?: string;
  badge?: string;
  title?: string;
  description?: string;
}

export const MouseEffectCard: React.FC<MouseEffectCardProps> = ({
  children,
  className = "",
  badge,
  title,
  description,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden rounded-2xl border border-gold-300/70 bg-white p-6 shadow-royal transition-all duration-300 hover:shadow-royal-lg hover:border-gold-400 group ${className}`}
    >
      {/* Interactive Champagne/Gold dot glow following cursor */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px transition-opacity duration-300"
          style={{
            background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212, 175, 55, 0.12), transparent 70%)`,
          }}
        />
      )}

      {badge && (
        <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 border border-burgundy-200/60 rounded-full">
          {badge}
        </span>
      )}

      {title && (
        <h3 className="font-serif text-2xl font-bold text-charcoal-700 mb-2 group-hover:text-burgundy-800 transition-colors">
          {title}
        </h3>
      )}

      {description && (
        <p className="text-sm text-charcoal-500 mb-4 leading-relaxed">
          {description}
        </p>
      )}

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
