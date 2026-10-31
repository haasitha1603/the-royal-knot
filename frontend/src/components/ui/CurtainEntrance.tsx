import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface CurtainEntranceProps {
  onEnter?: () => void;
  forceShow?: boolean;
}

export const CurtainEntrance: React.FC<CurtainEntranceProps> = ({ onEnter, forceShow = false }) => {
  // Three phases:
  // 1. 'closed'   -> Full screen silky satin curtains between slender gold palace pillars.
  //                  NO ARROW on curtain — user just clicks anywhere to open.
  // 2. 'parting'  -> Curtains smoothly separate from the centre and glide to the sides.
  // 3. 'revealed' -> The royal red & gold valance frame appears with gold pillars, the logo,
  //                  and grand fancy cursive "The Royal Knot" title. Corner button: "Visit Home Page".
  // 4. 'entered'  -> Transitions to website homepage.
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
    setTimeout(() => {
      setPhase('revealed');
    }, 1000);
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
          SLENDER GOLDEN PALACE PILLARS ON BOTH SIDES
          Classical gilded columns framing the royal entrance with 3D depth
          ========================================================================= */}
      {/* Left Golden Pillar */}
      <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-12 md:w-16 z-30 pointer-events-none flex flex-col justify-between shadow-[10px_0_25px_rgba(0,0,0,0.25)]">
        {/* Pillar Capital (Top) */}
        <div className="h-12 sm:h-16 w-full bg-gradient-to-r from-[#9A7B2C] via-[#FFE580] to-[#7B5B16] rounded-br-lg shadow-md border-b-2 border-[#665017] relative">
          <div className="absolute inset-x-1 top-1 h-2 bg-gradient-to-r from-[#665017] via-[#FFF2B2] to-[#665017] rounded-sm" />
          <div className="absolute inset-x-2 top-4 h-3 bg-gradient-to-r from-[#8C6F23] via-[#FFE580] to-[#8C6F23] rounded-sm" />
        </div>

        {/* Fluted Cylindrical Shaft (Middle) */}
        <div
          className="flex-1 w-full"
          style={{
            background: `
              linear-gradient(90deg, 
                #594210 0%, 
                #9A7B2C 12%, 
                #D4AF37 32%, 
                #FFF8D6 50%, 
                #D4AF37 68%, 
                #9A7B2C 88%, 
                #594210 100%
              )
            `,
            boxShadow: 'inset 0 0 15px rgba(0,0,0,0.3)',
          }}
        >
          {/* Subtle architectural vertical fluting */}
          <div
            className="w-full h-full opacity-30"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(0,0,0,0.4) 7px, rgba(255,255,255,0.7) 9px, transparent 10px)'
            }}
          />
        </div>

        {/* Pillar Pedestal (Bottom) */}
        <div className="h-12 sm:h-16 w-full bg-gradient-to-r from-[#7B5B16] via-[#FFE580] to-[#9A7B2C] rounded-tr-lg shadow-lg border-t-2 border-[#665017] relative">
          <div className="absolute inset-x-1 bottom-1 h-2 bg-gradient-to-r from-[#665017] via-[#FFF2B2] to-[#665017] rounded-sm" />
          <div className="absolute inset-x-2 bottom-4 h-3 bg-gradient-to-r from-[#8C6F23] via-[#FFE580] to-[#8C6F23] rounded-sm" />
        </div>
      </div>

      {/* Right Golden Pillar */}
      <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-12 md:w-16 z-30 pointer-events-none flex flex-col justify-between shadow-[-10px_0_25px_rgba(0,0,0,0.25)]">
        {/* Pillar Capital (Top) */}
        <div className="h-12 sm:h-16 w-full bg-gradient-to-r from-[#7B5B16] via-[#FFE580] to-[#9A7B2C] rounded-bl-lg shadow-md border-b-2 border-[#665017] relative">
          <div className="absolute inset-x-1 top-1 h-2 bg-gradient-to-r from-[#665017] via-[#FFF2B2] to-[#665017] rounded-sm" />
          <div className="absolute inset-x-2 top-4 h-3 bg-gradient-to-r from-[#8C6F23] via-[#FFE580] to-[#8C6F23] rounded-sm" />
        </div>

        {/* Fluted Cylindrical Shaft (Middle) */}
        <div
          className="flex-1 w-full"
          style={{
            background: `
              linear-gradient(90deg, 
                #594210 0%, 
                #9A7B2C 12%, 
                #D4AF37 32%, 
                #FFF8D6 50%, 
                #D4AF37 68%, 
                #9A7B2C 88%, 
                #594210 100%
              )
            `,
            boxShadow: 'inset 0 0 15px rgba(0,0,0,0.3)',
          }}
        >
          {/* Subtle architectural vertical fluting */}
          <div
            className="w-full h-full opacity-30"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 6px, rgba(0,0,0,0.4) 7px, rgba(255,255,255,0.7) 9px, transparent 10px)'
            }}
          />
        </div>

        {/* Pillar Pedestal (Bottom) */}
        <div className="h-12 sm:h-16 w-full bg-gradient-to-r from-[#9A7B2C] via-[#FFE580] to-[#7B5B16] rounded-tl-lg shadow-lg border-t-2 border-[#665017] relative">
          <div className="absolute inset-x-1 bottom-1 h-2 bg-gradient-to-r from-[#665017] via-[#FFF2B2] to-[#665017] rounded-sm" />
          <div className="absolute inset-x-2 bottom-4 h-3 bg-gradient-to-r from-[#8C6F23] via-[#FFE580] to-[#8C6F23] rounded-sm" />
        </div>
      </div>

      {/* =========================================================================
          STATE 2: ONCE OPENED — ROYAL CURTAIN ARCH & GRAND CURSIVE TITLE
          Features the user-provided royal red & gold valance framing the stage,
          the bride & groom silhouette logo, and grand fancy cursive "The Royal Knot" title.
          Corner button: "Visit Home Page".
          ========================================================================= */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] transition-opacity duration-700 ${
          phase === 'revealed' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top & Side Royal Red Valance Pelmet (User provided photo: media_1793443941416_c4b8457b.png) */}
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center overflow-hidden">
          <img
            src="/royal-curtain-frame.png"
            alt="Royal Curtain Pelmet & Valance"
            className="w-full h-full max-w-6xl max-h-screen object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.25)] opacity-95"
          />
        </div>

        {/* Single Corner Button: Visit Home Page */}
        <div className="absolute top-6 right-10 sm:top-8 sm:right-16 md:right-20 z-40">
          <button
            onClick={handleVisitHomePage}
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs sm:text-sm uppercase tracking-widest shadow-royal border border-gold-400/60 transition-all duration-300 hover:scale-105 active:scale-95"
            aria-label="Visit Home Page"
          >
            <span>Visit Home Page</span>
            <ArrowRight className="w-4 h-4 text-gold-300 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Center Stage: Provided Logo & Grand Fancy Cursive Title */}
        <div className="relative z-20 text-center px-4 max-w-2xl flex flex-col items-center mt-12 sm:mt-6 animate-in fade-in zoom-in-95 duration-700">
          {/* User's Exact Uploaded Logo (Gold-ringed Bride & Groom Silhouette) */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden mb-3 p-1 bg-white/60 backdrop-blur-sm border border-gold-300/80 shadow-royal-lg">
            <img
              src="/royal-knot-logo.png"
              alt="The Royal Knot"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Grand Fancy Cursive / Hermiona Heading */}
          <h1 className="font-cursive text-6xl sm:text-8xl md:text-9xl text-charcoal-900 tracking-wide leading-none drop-shadow-sm mb-2">
            The Royal Knot
          </h1>

          <div className="w-36 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent my-2 opacity-80" />

          <p className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-gold-800 font-semibold">
            Every Detail Connected • Every Moment Managed
          </p>
        </div>
      </div>

      {/* =========================================================================
          STATE 1: CLOSED CURTAIN ENTRANCE
          Pure silky satin fabric in soft ivory / champagne.
          NO ARROWS ON CURTAIN. User clicks anywhere to open smoothly.
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
          aria-label="Click anywhere to part curtains"
          className="absolute inset-0 z-20 cursor-pointer overflow-hidden focus:outline-none"
        >
          {/* Left Curtain Panel */}
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
            {/* Satin Sheen Waves */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-soft-light"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse at 70% 30%, rgba(255,255,255,0.9) 0%, transparent 60%)',
              }}
            />
            {/* Delicate gold-threaded vertical edge */}
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gold-300 via-gold-400 to-gold-300 shadow-[0_0_12px_rgba(212,175,55,0.4)]" />
          </div>

          {/* Right Curtain Panel */}
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
            {/* Satin Sheen Waves */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40 mix-blend-soft-light"
              style={{
                backgroundImage:
                  'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.9) 0%, transparent 60%)',
              }}
            />
            {/* Delicate gold-threaded vertical edge */}
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gold-300 via-gold-400 to-gold-300 shadow-[0_0_12px_rgba(212,175,55,0.4)]" />
          </div>
        </div>
      )}
    </div>
  );
};
