import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface CurtainEntranceProps {
  onEnter?: () => void;
  forceShow?: boolean;
}

export const CurtainEntrance: React.FC<CurtainEntranceProps> = ({ onEnter, forceShow = false }) => {
  // Three phases:
  // 'closed' -> Curtains closed between gold pillars, no arrow, click anywhere to open
  // 'parting' -> Curtains smoothly part and gather to sides
  // 'revealed' -> Regal curtain frame displayed with gold pillars and grand fancy cursive THE ROYAL KNOT title
  // 'entered' -> Fully enters website
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
          GOLD PALACE PILLARS ON BOTH SIDES
          Majestic fluted golden architectural pillars flanking the stage
          ========================================================================= */}
      {/* Left Gold Pillar */}
      <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-20 md:w-28 z-30 pointer-events-none flex flex-col justify-between shadow-[15px_0_35px_rgba(0,0,0,0.35)]">
        {/* Pillar Capital (Top) */}
        <div className="h-16 sm:h-24 w-full bg-gradient-to-r from-[#D4AF37] via-[#FFF2B2] to-[#B38F30] border-b-4 border-[#8C6F23] shadow-md relative">
          <div className="absolute inset-x-2 top-2 h-3 bg-gradient-to-r from-[#8C6F23] via-[#FFE580] to-[#8C6F23] rounded-sm" />
          <div className="absolute inset-x-4 top-7 h-4 bg-gradient-to-r from-[#B38F30] via-[#FFF8D6] to-[#B38F30] rounded-sm" />
          <div className="absolute bottom-1 inset-x-1 h-2 bg-gradient-to-r from-[#665017] via-[#D4AF37] to-[#665017]" />
        </div>

        {/* Fluted Shaft (Middle) */}
        <div
          className="flex-1 w-full"
          style={{
            background: `
              linear-gradient(90deg, 
                #665017 0%, 
                #B38F30 15%, 
                #D4AF37 35%, 
                #FFF8D6 50%, 
                #D4AF37 65%, 
                #B38F30 85%, 
                #665017 100%
              )
            `,
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)',
          }}
        >
          {/* Vertical fluting ridges */}
          <div
            className="w-full h-full opacity-40"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 8px, rgba(0,0,0,0.35) 9px, rgba(255,255,255,0.6) 11px, transparent 13px)'
            }}
          />
        </div>

        {/* Pillar Pedestal (Bottom) */}
        <div className="h-16 sm:h-24 w-full bg-gradient-to-r from-[#B38F30] via-[#FFF2B2] to-[#8C6F23] border-t-4 border-[#8C6F23] shadow-lg relative">
          <div className="absolute inset-x-1 top-2 h-3 bg-gradient-to-r from-[#665017] via-[#D4AF37] to-[#665017]" />
          <div className="absolute inset-x-3 bottom-3 h-5 bg-gradient-to-r from-[#8C6F23] via-[#FFE580] to-[#8C6F23] rounded-sm" />
        </div>
      </div>

      {/* Right Gold Pillar */}
      <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-20 md:w-28 z-30 pointer-events-none flex flex-col justify-between shadow-[-15px_0_35px_rgba(0,0,0,0.35)]">
        {/* Pillar Capital (Top) */}
        <div className="h-16 sm:h-24 w-full bg-gradient-to-r from-[#B38F30] via-[#FFF2B2] to-[#D4AF37] border-b-4 border-[#8C6F23] shadow-md relative">
          <div className="absolute inset-x-2 top-2 h-3 bg-gradient-to-r from-[#8C6F23] via-[#FFE580] to-[#8C6F23] rounded-sm" />
          <div className="absolute inset-x-4 top-7 h-4 bg-gradient-to-r from-[#B38F30] via-[#FFF8D6] to-[#B38F30] rounded-sm" />
          <div className="absolute bottom-1 inset-x-1 h-2 bg-gradient-to-r from-[#665017] via-[#D4AF37] to-[#665017]" />
        </div>

        {/* Fluted Shaft (Middle) */}
        <div
          className="flex-1 w-full"
          style={{
            background: `
              linear-gradient(90deg, 
                #665017 0%, 
                #B38F30 15%, 
                #D4AF37 35%, 
                #FFF8D6 50%, 
                #D4AF37 65%, 
                #B38F30 85%, 
                #665017 100%
              )
            `,
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)',
          }}
        >
          {/* Vertical fluting ridges */}
          <div
            className="w-full h-full opacity-40"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 8px, rgba(0,0,0,0.35) 9px, rgba(255,255,255,0.6) 11px, transparent 13px)'
            }}
          />
        </div>

        {/* Pillar Pedestal (Bottom) */}
        <div className="h-16 sm:h-24 w-full bg-gradient-to-r from-[#8C6F23] via-[#FFF2B2] to-[#B38F30] border-t-4 border-[#8C6F23] shadow-lg relative">
          <div className="absolute inset-x-1 top-2 h-3 bg-gradient-to-r from-[#665017] via-[#D4AF37] to-[#665017]" />
          <div className="absolute inset-x-3 bottom-3 h-5 bg-gradient-to-r from-[#8C6F23] via-[#FFE580] to-[#8C6F23] rounded-sm" />
        </div>
      </div>

      {/* =========================================================================
          REVEAL SCREEN: THE ROYAL CURTAIN FRAME & GRAND FANCY CURSIVE TITLE
          Features the user's provided royal curtain valance framing the top/sides,
          and in the center: the logo and grand fancy cursive font title!
          ========================================================================= */}
      <div
        className={`absolute inset-0 z-10 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6EE] to-[#F5ECE0] transition-opacity duration-700 ${
          phase === 'revealed' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Top & Side Royal Curtain Valance Frame (User provided image) */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <img
            src="/royal-curtain-frame.png"
            alt="Royal Curtain Pelmet & Valance"
            className="w-full h-full object-fill opacity-95 drop-shadow-[0_15px_25px_rgba(0,0,0,0.3)]"
          />
        </div>

        {/* Corner Button: Visit Home Page */}
        <div className="absolute top-6 right-16 sm:top-8 sm:right-28 z-40">
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
        <div className="relative z-20 text-center px-6 max-w-3xl flex flex-col items-center mt-12 sm:mt-8">
          {/* User's Exact Uploaded Logo (Gold-ringed Bride & Groom Silhouette) */}
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden mb-4 p-1 bg-white/40 backdrop-blur-sm border border-gold-300/80 shadow-royal-lg animate-in fade-in zoom-in-90 duration-700">
            <img
              src="/royal-knot-logo.png"
              alt="The Royal Knot"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Grand Fancy Cursive Heading (Hermiona / Great Vibes / Alex Brush) */}
          <h1 className="font-cursive text-6xl sm:text-8xl md:text-9xl text-charcoal-900 tracking-wide leading-tight drop-shadow-sm">
            The Royal Knot
          </h1>

          {/* Elegant Gold Divider */}
          <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent my-3 opacity-80" />

          <p className="text-[11px] sm:text-xs tracking-[0.35em] uppercase text-gold-800 font-semibold">
            Every Detail Connected • Every Moment Managed
          </p>
        </div>
      </div>

      {/* =========================================================================
          CLOSED CURTAINS (PHASE 1)
          Pure satin curtains between the gold pillars.
          NO ARROW on curtain — user just clicks anywhere to open.
          Smoothly parts to left and right edges.
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
            <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gold-300 via-gold-400 to-gold-300 shadow-[0_0_12px_rgba(212,175,55,0.5)]" />
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
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gold-300 via-gold-400 to-gold-300 shadow-[0_0_12px_rgba(212,175,55,0.5)]" />
          </div>
        </div>
      )}
    </div>
  );
};
