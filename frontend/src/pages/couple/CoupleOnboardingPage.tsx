import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Crown,
  Heart,
  Calendar,
  Users,
  Coins,
  MapPin,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const CoupleOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setActiveWeddingId } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    partner1Name: 'Aarav Singhania',
    partner2Name: 'Meera Kapoor',
    weddingDate: '2026-11-21',
    destinationCity: 'Jaipur',
    destinationState: 'Rajasthan',
    estimatedGuests: 400,
    totalBudget: 5000000,
    tradition: 'Hindu Traditional',
    style: 'Royal Palace',
    functions: [
      { name: 'Haldi & Phoolon Ki Holi', date: '2026-11-20', startTime: '10:30 AM', endTime: '01:30 PM', orderIndex: 1 },
      { name: 'Mehendi & Sangeet Gala', date: '2026-11-20', startTime: '07:00 PM', endTime: '11:59 PM', orderIndex: 2 },
      { name: 'Sacred Pheras & Wedding', date: '2026-11-21', startTime: '04:30 PM', endTime: '08:30 PM', orderIndex: 3 },
      { name: 'Grand Royal Reception', date: '2026-11-21', startTime: '08:30 PM', endTime: '11:59 PM', orderIndex: 4 },
    ]
  });

  const traditions = [
    'Hindu Traditional',
    'Christian / Church',
    'Muslim / Nikah',
    'Sikh Anand Karaj',
    'Jain Traditional',
    'Interfaith Celebration',
    'Civil / Contemporary',
    'Custom Traditions'
  ];

  const styles = [
    'Royal Palace',
    'Traditional Rajputana / Heritage',
    'Modern Luxury',
    'Sunset Garden Romance',
    'Beachside Luxury',
    'Intimate Grandeur'
  ];

  const destinations = ['Jaipur', 'Udaipur', 'Jodhpur', 'Goa', 'Kerala'];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        couple_names: `${formData.partner1Name} & ${formData.partner2Name}`,
        partner1_name: formData.partner1Name,
        partner2_name: formData.partner2Name,
        wedding_date: formData.weddingDate,
        destination_city: formData.destinationCity,
        destination_state: formData.destinationState,
        estimated_guests: formData.estimatedGuests,
        total_budget: formData.totalBudget,
        style: formData.style,
        ceremony_tradition: formData.tradition,
        functions: formData.functions.map(f => ({
          name: f.name,
          date: f.date,
          start_time: f.startTime,
          end_time: f.endTime,
          guest_count: formData.estimatedGuests,
          order_index: f.orderIndex
        }))
      };

      const newWedding = await api.createWedding(payload);
      setActiveWeddingId(newWedding.id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create wedding:', err);
      // Fallback navigate to existing demo dashboard
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-ivory min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700 mx-auto mb-3">
            <Crown className="w-6 h-6 text-gold-600" />
          </div>
          <span className="text-xs uppercase tracking-widest font-bold text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200">
            Guided Concierge Journey
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900 mt-2">
            Configure Your Royal Wedding
          </h1>
          <p className="text-xs text-charcoal-500 mt-1">
            Step {currentStep} of 4: Personalized ceremony specifications and budgetary bounds
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between max-w-xs mx-auto mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gold-200 -translate-y-1/2 z-0" />
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold relative z-10 transition-all ${
                currentStep >= step
                  ? 'bg-burgundy-700 text-white shadow-sm ring-4 ring-gold-100'
                  : 'bg-white text-charcoal-400 border border-gold-200'
              }`}
            >
              {step}
            </div>
          ))}
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-gold-300 p-8 sm:p-10 shadow-royal">
          {/* STEP 1: Couple Names & Auspicious Date */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-bold text-charcoal-800 border-b border-gold-200 pb-3 flex items-center gap-2">
                <Heart className="w-5 h-5 text-burgundy-700" />
                <span>The Betrothed & Auspicious Muhurat</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                    Partner 1 (Name / Family)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.partner1Name}
                    onChange={(e) => setFormData({ ...formData, partner1Name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5">
                    Partner 2 (Name / Family)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.partner2Name}
                    onChange={(e) => setFormData({ ...formData, partner2Name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-gold-600" />
                    Target Wedding Date / Muhurat
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.weddingDate}
                    onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gold-600" />
                    Destination Hub
                  </label>
                  <select
                    value={formData.destinationCity}
                    onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
                  >
                    {destinations.map(d => (
                      <option key={d} value={d}>{d} (Rajasthan / India)</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Scale, Guests & Budget */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-bold text-charcoal-800 border-b border-gold-200 pb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-gold-600" />
                <span>Guest Count & Approved Budget Ceiling</span>
              </h3>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700">
                    Estimated Guest Attendance
                  </label>
                  <span className="font-serif text-xl font-bold text-burgundy-800">
                    {formData.estimatedGuests} Guests
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={formData.estimatedGuests}
                  onChange={(e) => setFormData({ ...formData, estimatedGuests: parseInt(e.target.value) })}
                  className="w-full accent-burgundy-700 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-charcoal-400 mt-1">
                  <span>Intimate (50)</span>
                  <span>Royal Standard (400)</span>
                  <span>Grand Maharaja (1500)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gold-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-charcoal-700 flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-gold-600" />
                    Overall Approved Budget (INR)
                  </label>
                  <span className="font-serif text-xl font-bold text-burgundy-800">
                    ₹{(formData.totalBudget / 100000).toFixed(0)} Lakhs
                  </span>
                </div>
                <input
                  type="range"
                  min="1500000"
                  max="25000000"
                  step="500000"
                  value={formData.totalBudget}
                  onChange={(e) => setFormData({ ...formData, totalBudget: parseInt(e.target.value) })}
                  className="w-full accent-burgundy-700 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-charcoal-400 mt-1">
                  <span>₹15 Lakhs</span>
                  <span>₹50 Lakhs (Featured Demo)</span>
                  <span>₹2.5 Crore</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Tradition & Aesthetic Style */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-bold text-charcoal-800 border-b border-gold-200 pb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-600" />
                <span>Ceremony Traditions & Design Style</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-3">
                  Auspicious Ritual Traditions
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {traditions.map((trad) => {
                    const isSelected = formData.tradition === trad;
                    return (
                      <button
                        key={trad}
                        type="button"
                        onClick={() => setFormData({ ...formData, tradition: trad })}
                        className={`p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-burgundy-700 bg-burgundy-50 text-burgundy-900 font-bold ring-1 ring-burgundy-400'
                            : 'border-gold-200 bg-ivory-50 text-charcoal-700 hover:border-gold-300'
                        }`}
                      >
                        {trad}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-3">
                  Wedding Aesthetic & Setting
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {styles.map((st) => {
                    const isSelected = formData.style === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setFormData({ ...formData, style: st })}
                        className={`p-3 rounded-xl border text-center text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-gold-500 bg-gold-50 text-gold-900 font-bold ring-1 ring-gold-400'
                            : 'border-gold-200 bg-ivory-50 text-charcoal-700 hover:border-gold-300'
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Multi-Function Schedule Preview */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="font-serif text-2xl font-bold text-charcoal-800 border-b border-gold-200 pb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-burgundy-700" />
                <span>Multi-Function Itinerary Review</span>
              </h3>

              <div className="space-y-3">
                {formData.functions.map((func, i) => (
                  <div key={i} className="p-4 rounded-xl bg-ivory-50 border border-gold-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-serif text-base font-bold text-charcoal-800 block">{func.name}</span>
                      <span className="text-charcoal-500">{func.date} • {func.startTime} to {func.endTime}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-gold-700 bg-white px-2.5 py-1 rounded-md border border-gold-200">
                      {formData.estimatedGuests} Guests
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Platform Readiness:</strong> Submitting this configuration will automatically instantiate your Budget Guardian categories, generate initial task kanban boards, and match verified palace venues in {formData.destinationCity}.
              </div>
            </div>
          )}

          {/* Nav Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-gold-200 mt-8">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl border border-gold-300 bg-white hover:bg-gold-50 text-xs font-semibold text-charcoal-700 uppercase"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>
            ) : <div />}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                <span>{isSubmitting ? 'Instantiating Royal Wedding...' : 'Launch Wedding Dashboard'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
