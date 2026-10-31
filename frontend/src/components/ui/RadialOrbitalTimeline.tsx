import React, { useState } from 'react';
import { CheckCircle2, Clock, Calendar, Sparkles } from 'lucide-react';

interface TimelineNode {
  id: string;
  title: string;
  subtitle: string;
  status: 'completed' | 'in_progress' | 'pending';
  date: string;
  description: string;
}

interface RadialOrbitalTimelineProps {
  milestones?: TimelineNode[];
}

export const RadialOrbitalTimeline: React.FC<RadialOrbitalTimelineProps> = ({ milestones }) => {
  const defaultMilestones: TimelineNode[] = [
    {
      id: '1',
      title: 'Vision & Royal Palace Booking',
      subtitle: 'Jaipur Rambagh Palace confirmed',
      status: 'completed',
      date: 'Aug 2026',
      description: 'Venue contract countersigned, booking advance cleared, auspicious muhurat locked.'
    },
    {
      id: '2',
      title: 'Vendor Curation & Menu Tasting',
      subtitle: 'Catering, Decor & Photography',
      status: 'completed',
      date: 'Sep 2026',
      description: '3 gourmet catering quotations evaluated, royal decor themes finalised for 5 functions.'
    },
    {
      id: '3',
      title: 'Invitations & Royal RSVPs',
      subtitle: '400 Guests & Destination Stays',
      status: 'in_progress',
      date: 'Oct 2026',
      description: 'Physical handcrafted invitations dispatched; digital tracking & dietary preferences rolling in.'
    },
    {
      id: '4',
      title: 'Command Centre & Run of Show',
      subtitle: 'Minute-by-minute Haldi to Reception',
      status: 'pending',
      date: 'Nov 2026',
      description: 'Rehearsals, vendor arrival logs, stage setup, and real-time operations coordination.'
    },
    {
      id: '5',
      title: 'Grand Nuptials & Grand Feast',
      subtitle: 'Sacred Vows & Regal Reception',
      status: 'pending',
      date: '20-22 Nov 2026',
      description: 'Sacred pheras at Sunset Pavilion, followed by 7-course royal feast & musical symphony.'
    }
  ];

  const items = milestones || defaultMilestones;
  const [activeItem, setActiveItem] = useState<TimelineNode>(items[2]); // in_progress default

  return (
    <div className="bg-white rounded-3xl border border-gold-300/80 p-6 sm:p-8 shadow-royal">
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-burgundy-700 bg-burgundy-50 border border-burgundy-200 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" />
          The Regal Pathway
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-800">
          Wedding Planning Milestones
        </h3>
        <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
          Explore the chronological journey from initial vision to grand royal nuptials.
        </p>
      </div>

      {/* Responsive Orbital / Stepper representation */}
      <div className="relative mb-8">
        {/* Golden connector bar */}
        <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-200 -translate-y-1/2 z-0" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {items.map((item, index) => {
            const isSelected = activeItem.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveItem(item)}
                className={`flex flex-col items-center p-3 rounded-2xl transition-all text-center ${
                  isSelected
                    ? 'bg-gold-50/80 border-2 border-gold-400 shadow-md scale-105'
                    : 'bg-white border border-gold-200/80 hover:border-gold-300'
                }`}
              >
                {/* Orbital Node Badge */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-sm font-bold shadow-sm mb-2 transition-transform ${
                    item.status === 'completed'
                      ? 'bg-emerald-600 text-white'
                      : item.status === 'in_progress'
                      ? 'bg-burgundy-700 text-white ring-4 ring-gold-300 animate-pulse'
                      : 'bg-ivory-200 text-charcoal-500 border border-gold-300'
                  }`}
                >
                  {item.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : item.status === 'in_progress' ? (
                    <Clock className="w-5 h-5 text-gold-300" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <span className="text-[11px] font-semibold uppercase tracking-wider text-gold-700">
                  {item.date}
                </span>
                <span className="text-xs font-bold text-charcoal-800 line-clamp-1 mt-0.5">
                  {item.title}
                </span>
                <span className="text-[10px] text-charcoal-500 capitalize">
                  {item.status.replace('_', ' ')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Milestone Detail Card */}
      <div className="bg-ivory-50 rounded-2xl border border-gold-300/70 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-medium uppercase tracking-wider ${
                activeItem.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-800'
                  : activeItem.status === 'in_progress'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {activeItem.status.replace('_', ' ')}
            </span>
            <span className="text-xs text-charcoal-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gold-600" />
              Target: {activeItem.date}
            </span>
          </div>
          <h4 className="font-serif text-xl font-bold text-charcoal-800 mb-1">
            {activeItem.title}
          </h4>
          <p className="text-sm font-medium text-burgundy-700 mb-2">
            {activeItem.subtitle}
          </p>
          <p className="text-xs text-charcoal-600 max-w-2xl leading-relaxed">
            {activeItem.description}
          </p>
        </div>

        <div className="sm:self-center shrink-0">
          <span className="inline-block px-4 py-2 rounded-xl border border-gold-300 bg-white text-xs font-semibold text-gold-800 shadow-sm">
            Audited in Platform Record
          </span>
        </div>
      </div>
    </div>
  );
};
