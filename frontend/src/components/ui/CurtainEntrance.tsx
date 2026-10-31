import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface CurtainEntranceProps {
  onEnter?: () => void;
  forceShow?: boolean;
}

export const CurtainEntrance: React.FC<CurtainEntranceProps> = ({ onEnter, forceShow = false }) => {
  // Three distinct separated states:
  // 1. 'closed'   -> Closed silky satin curtains occupying the entire screen. Click to open.
  // 2. 'parting'  -> Curtains smoothly separate from the centre and move towards left and right edges.
  // 3. 'revealed' -> Minimal brand-reveal screen with ONLY "The Royal Knot" and "Visit Home Page".
  // 4. 'entered'  -> Full website homepage appears.
  const [phase, setPhase] = useState<'closed' | 'parting' | 'revealed' | 'entered'>('entered');

  useEffect(() => {
    const hasSeenCurtain = localStorage.getItem('royal_knot_curtain_seen');
    if (!hasSeenCurtain || forceShow) {
      setPhase('closed');
    } else {
      setPhase('entered');
    }
  }, [forceShow]);

  const handleOpenCurtains = () => {
    if (phase !== 'closed') return;
    setPhase('parting');
    // Allow the flowing satin curtains to part smoothly to the edges, then reveal minimal brand screen
    setTimeout(() => {
      setPhase('revealed');
    }, 1100);
  };

  const handleVisitHomePage = () => {
    localStorage.setItem('royal_knot_curtain_seen', 'true');
    setPhase('entered');
    if (onEnter) onEnter();
  };

  if (phase === 'entered') return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="The Royal Knot Entrance"
      className="fixed inset-0 z-[100] overflow-hidden select-none bg-[#FAF7F2]"
    >
      {/* =========================================================================
          STATE 2: THE ROYAL KNOT REVEAL SCREEN (USER UPLOADED GRAPHIC)
          Appears once the curtains open.
          Features the tied-back satin curtains with floral bouquet ties and the
          royal gold calligraphy "The Royal Knot" with wedding rings emblem.
          In the top right corner: "Visit Home Page" button.
          ========================================================================= */}
      <div
        className={`absolute inset-0 z-0 flex items-center justify-center bg-[#FAF6EE] transition-opacity duration-700 ${
          phase === 'revealed' || phase === 'parting' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Full-bleed opened curtains graphic with golden calligraphy */}
        <img
          src="/royal-knot-opened-curtain.png"
          alt="The Royal Knot"
          className="w-full h-full object-cover object-center select-none pointer-events-none"
        />

        {/* Single Corner Button: Visit Home Page */}
        <div
          className={`absolute top-6 right-6 sm:top-10 sm:right-10 z-20 transition-all duration-500 ${
            phase === 'revealed' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <button
            onClick={handleVisitHomePage}
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs sm:text-sm uppercase tracking-widest shadow-royal border border-gold-400/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
            aria-label="Visit Home Page"
          >
            <span>Visit Home Page</span>
            <ArrowRight className="w-4 h-4 text-gold-300 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* =========================================================================
          STATE 1 & PARTING ANIMATION: SILKY SATIN CURTAINS
          Two large curtains in soft ivory / champagne satin fabric.
          Features realistic fabric folds, highlights, and draped vertical motion.
          STRICTLY NO RED CURTAINS. NO TEXT. NO LOGOS ON CURTAINS. NO PILLARS.
          Clicking anywhere smoothly parts the curtains to the left and right.
          ========================================================================= */}
      {(phase === 'closed' || phase === 'parting') && (
        <div
          onClick={handleOpenCurtains}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpenCurtains();
            }
          }}
          tabIndex={0}
          role="button"
          aria-label="Click to open the satin curtains"
          className="absolute inset-0 z-10 cursor-pointer overflow-hidden focus:outline-none"
        >
          {/* Left Satin Curtain Panel */}
          <div
            className={`absolute top-0 bottom-0 left-0 w-1/2 shadow-2xl transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
              phase === 'parting'
                ? '-translate-x-full scale-x-90 opacity-90'
                : 'translate-x-0 scale-x-100 opacity-100'
            }`}
            style={{
              backgroundColor: '#FAF6EE',
              backgroundImage: `
                linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(245,236,224,0.4) 50%, rgba(235,223,205,0.7) 100%),
                repeating-linear-gradient(
                  90deg,
                  #FFFFFF 0px,
                  #FFFDF8 25px,
                  #F7EFE1 50px,
                  #EFE4D2 75px,
                  #DFD0B8 100px,
                  #F3E9DA 125px,
                  #FFFFFF 150px
                )
              `,
              boxShadow: 'inset -15px 0 30px -10px rgba(184, 150, 90, 0.3), 10px 0 40px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Satin Sheen Luster Wave Overlays */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-soft-light"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.9) 0%, transparent 60%)',
              }}
            />
            {/* Delicate gold-threaded vertical edge border */}
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold-300 via-gold-400 to-gold-300 shadow-[0_0_12px_rgba(212,175,55,0.4)]" />
          </div>

          {/* Right Satin Curtain Panel */}
          <div
            className={`absolute top-0 bottom-0 right-0 w-1/2 shadow-2xl transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
              phase === 'parting'
                ? 'translate-x-full scale-x-90 opacity-90'
                : 'translate-x-0 scale-x-100 opacity-100'
            }`}
            style={{
              backgroundColor: '#FAF6EE',
              backgroundImage: `
                linear-gradient(180deg, rgba(255,255,255,0.7) 0%, rgba(245,236,224,0.4) 50%, rgba(235,223,205,0.7) 100%),
                repeating-linear-gradient(
                  90deg,
                  #FFFFFF 0px,
                  #F3E9DA 25px,
                  #DFD0B8 50px,
                  #EFE4D2 75px,
                  #F7EFE1 100px,
                  #FFFDF8 125px,
                  #FFFFFF 150px
                )
              `,
              boxShadow: 'inset 15px 0 30px -10px rgba(184, 150, 90, 0.3), -10px 0 40px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Satin Sheen Luster Wave Overlays */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-soft-light"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.9) 0%, transparent 60%)',
              }}
            />
            {/* Delicate gold-threaded vertical edge border */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold-300 via-gold-400 to-gold-300 shadow-[0_0_12px_rgba(212,175,55,0.4)]" />
          </div>
        </div>
      )}
    </div>
  );
};
