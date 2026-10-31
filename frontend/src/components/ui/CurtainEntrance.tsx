import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface CurtainEntranceProps {
  onEnter?: () => void;
  forceShow?: boolean;
}

export const CurtainEntrance: React.FC<CurtainEntranceProps> = ({ onEnter, forceShow = false }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    const hasSeenCurtain = localStorage.getItem('royal_knot_curtain_seen');
    if (!hasSeenCurtain || forceShow) {
      setIsVisible(true);
    }
  }, [forceShow]);

  const handleOpenCurtain = () => {
    setIsOpening(true);
    localStorage.setItem('royal_knot_curtain_seen', 'true');
    setTimeout(() => {
      setIsVisible(false);
      if (onEnter) onEnter();
    }, 1200);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    localStorage.setItem('royal_knot_curtain_seen', 'true');
    setIsVisible(false);
    if (onEnter) onEnter();
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome Curtain Entrance"
      className="fixed inset-0 z-[100] overflow-hidden flex items-center justify-center select-none"
    >
      {/* Left Curtain */}
      <div
        className={`absolute top-0 bottom-0 left-0 w-1/2 bg-[#FFFDF9] shadow-2xl z-10 transition-transform duration-1000 ease-in-out border-r border-gold-300 ${
          isOpening ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 80% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 60%),
            repeating-linear-gradient(90deg, #FFFFFF 0px, #FAF6EE 20px, #FFFDF9 40px, #F5ECE0 60px)
          `,
        }}
      >
        {/* Subtle fabric fold texture and gold border line */}
        <div className="absolute right-0 top-0 bottom-0 w-3 bg-gradient-to-l from-gold-300/40 to-transparent" />
        <div className="absolute right-1 top-0 bottom-0 w-0.5 bg-gold-400/80 shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
      </div>

      {/* Right Curtain */}
      <div
        className={`absolute top-0 bottom-0 right-0 w-1/2 bg-[#FFFDF9] shadow-2xl z-10 transition-transform duration-1000 ease-in-out border-l border-gold-300 ${
          isOpening ? 'translate-x-full' : 'translate-x-0'
        }`}
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 20% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 60%),
            repeating-linear-gradient(90deg, #F5ECE0 0px, #FFFDF9 20px, #FAF6EE 40px, #FFFFFF 60px)
          `,
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-gold-300/40 to-transparent" />
        <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-gold-400/80 shadow-[0_0_10px_rgba(212,175,55,0.5)]" />
      </div>

      {/* Center Royal Knot Seal & Interactive Entrance Trigger */}
      <div
        className={`relative z-20 flex flex-col items-center text-center p-8 max-w-lg transition-all duration-700 ${
          isOpening ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Delicate Golden Crest */}
        <div className="w-20 h-20 rounded-full border-2 border-gold-400 flex items-center justify-center bg-white shadow-royal-lg mb-4 ring-8 ring-gold-100/60">
          <span className="font-serif text-3xl font-bold text-gold-600 tracking-wider">TRK</span>
        </div>

        <p className="text-xs tracking-[0.3em] uppercase text-gold-600 font-semibold mb-1">
          An Invitation to Grandeur
        </p>

        {/* Grand Fancy Cursive / Hermiona Heading */}
        <h1 className="font-cursive text-6xl sm:text-7xl font-bold text-charcoal-800 tracking-wide mb-3 leading-tight">
          The Royal Knot
        </h1>

        <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent my-2" />

        <p className="font-serif italic text-base sm:text-lg text-charcoal-500 max-w-md mb-8">
          “Every detail connected. Every moment managed. Every wedding unforgettable.”
        </p>

        <button
          onClick={handleOpenCurtain}
          className="group relative inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-burgundy-700 text-white font-medium shadow-royal hover:bg-burgundy-800 transition-all duration-300 hover:scale-105 active:scale-95 border border-gold-400/40 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-gold-300 transition-transform group-hover:rotate-12" />
          <span className="text-sm uppercase tracking-wider font-semibold">Partake in the Celebration</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        <button
          onClick={handleSkip}
          className="mt-6 text-xs text-charcoal-400 hover:text-gold-700 underline tracking-wider uppercase transition-colors cursor-pointer"
        >
          Skip Entrance
        </button>
      </div>
    </div>
  );
};
