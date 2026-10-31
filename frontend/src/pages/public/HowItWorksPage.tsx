import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Sparkles, CheckCircle2, Shield, ArrowRight, FileCheck, Users, Clock, Layers } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Define Your Vision & Traditions',
      desc: 'Complete our guided couple onboarding. Enter auspicious muhurats, ceremony styles (Hindu, Sikh, Muslim, Christian, Jain, or Interfaith), estimated guest counts, and budgetary goals.',
      icon: Crown
    },
    {
      num: '02',
      title: 'Curate Heritage Venues & Verified Masters',
      desc: 'Explore authentic palace estates in Rajasthan and coastal retreats. Receive transparent, itemized vendor quotations with verified service ratios and no hidden markups.',
      icon: FileCheck
    },
    {
      num: '03',
      title: 'Intelligent Quotation Comparison',
      desc: 'Our engine evaluates multi-vendor catering quotes, checking price-per-plate against live counter count, crockery tier, waitstaff ratio, and tax compliance.',
      icon: Layers
    },
    {
      num: '04',
      title: 'Active Budget Guardian & Staged Escrow',
      desc: 'Lock in approved budgets. Simulate what happens if 60 extra guests attend with automatic catering and seating cost recalibration requiring formal sign-off.',
      icon: Shield
    },
    {
      num: '05',
      title: 'Live Wedding Operations Command',
      desc: 'On wedding day, our minute-by-minute run of show tracks vendor arrivals. If a vendor is delayed, coordinators receive instant cascade alerts and suggested buffer adjustments.',
      icon: Clock
    }
  ];

  return (
    <div className="bg-ivory min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200">
            Platform Protocol
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 mt-3 mb-2">
            How The Royal Knot Works
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 leading-relaxed">
            A seamless bridge between royal romance and precision logistics.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 mb-16">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-gold-300 p-6 shadow-sm hover:shadow-royal transition-all flex flex-col sm:flex-row items-start gap-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 font-serif font-bold text-lg shrink-0">
                  {s.num}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-gold-600" />
                    <h3 className="font-serif text-xl font-bold text-charcoal-800">{s.title}</h3>
                  </div>
                  <p className="text-xs text-charcoal-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center bg-white rounded-3xl border border-gold-300 p-8 max-w-2xl mx-auto shadow-sm">
          <h4 className="font-serif text-2xl font-bold text-charcoal-800 mb-2">
            Ready to Plan Without Chaos?
          </h4>
          <p className="text-xs text-charcoal-500 mb-6">
            Begin with your wedding parameters and explore verified palace availability today.
          </p>
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            <span>Begin Guided Onboarding</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
