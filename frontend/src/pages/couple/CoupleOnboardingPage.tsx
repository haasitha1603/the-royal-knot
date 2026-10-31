import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  Heart,
  Calendar,
  Users,
  Coins,
  MapPin,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  X,
  Check,
  Clock
} from 'lucide-react';

interface WeddingFunctionItem {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  orderIndex: number;
  isSelected: boolean;
  isCustom?: boolean;
}

const TRADITION_DEFAULTS: Record<string, Array<{ name: string; time: string; duration: string }>> = {
  'Hindu Traditional': [
    { name: 'Ganesh Puja & Mandap Muhurat', time: '09:00 AM', duration: '11:30 AM' },
    { name: 'Haldi & Phoolon Ki Holi', time: '10:30 AM', duration: '01:30 PM' },
    { name: 'Mehendi & Sangeet Gala', time: '07:00 PM', duration: '11:59 PM' },
    { name: 'Baraat, Sacred Pheras & Wedding', time: '04:30 PM', duration: '08:30 PM' },
    { name: 'Grand Royal Reception & Banquet', time: '08:30 PM', duration: '11:59 PM' }
  ],
  'Muslim / Nikah': [
    { name: 'Manjha / Haldi Ceremony', time: '11:00 AM', duration: '02:00 PM' },
    { name: 'Henna & Sangeet Night', time: '07:30 PM', duration: '11:30 PM' },
    { name: 'Sacred Nikah & Khutbah', time: '04:00 PM', duration: '07:00 PM' },
    { name: 'Walima (Grand Banquet Reception)', time: '08:00 PM', duration: '11:59 PM' }
  ],
  'Christian / Church': [
    { name: 'Bridal High Tea & Rehearsal Dinner', time: '06:00 PM', duration: '09:30 PM' },
    { name: 'Holy Matrimony Nuptial Mass', time: '11:00 AM', duration: '01:30 PM' },
    { name: 'Garden Cocktail & Toast', time: '05:30 PM', duration: '07:30 PM' },
    { name: 'Grand Wedding Ball & Banquet', time: '08:00 PM', duration: '11:59 PM' }
  ],
  'Sikh Anand Karaj': [
    { name: 'Kurmai & Chunni Ceremony', time: '05:00 PM', duration: '08:00 PM' },
    { name: 'Vatna / Haldi Celebration', time: '10:30 AM', duration: '01:30 PM' },
    { name: 'Milni & Anand Karaj (Gurdwara Pheras)', time: '09:30 AM', duration: '01:00 PM' },
    { name: 'Grand Langar & Doli', time: '01:00 PM', duration: '04:00 PM' },
    { name: 'Imperial Reception Gala', time: '07:30 PM', duration: '11:59 PM' }
  ],
  'Jain Traditional': [
    { name: 'Lagna Lekhan & Mada Mandap', time: '09:00 AM', duration: '12:00 PM' },
    { name: 'Mehendi & Traditional Sangeet', time: '06:30 PM', duration: '10:30 PM' },
    { name: 'Jain Vivah Vidhi & Fera', time: '03:30 PM', duration: '07:30 PM' },
    { name: 'Pure Vegetarian Royal Feast & Reception', time: '07:30 PM', duration: '11:00 PM' }
  ],
  'Interfaith Celebration': [
    { name: 'Welcome Cocktail & Sufi Evening', time: '07:00 PM', duration: '11:00 PM' },
    { name: 'Traditional Cultural Rites', time: '10:00 AM', duration: '01:00 PM' },
    { name: 'Sunset Vows & Exchange of Rings', time: '05:00 PM', duration: '07:00 PM' },
    { name: 'Grand Fusion Gala & Banquet', time: '08:00 PM', duration: '11:59 PM' }
  ],
  'Civil / Contemporary': [
    { name: 'Intimate Sunset Welcome Dinner', time: '07:00 PM', duration: '10:30 PM' },
    { name: 'Legal Solemnization & Vows', time: '11:00 AM', duration: '01:00 PM' },
    { name: 'Champagne Reception & Dinner Soirée', time: '07:30 PM', duration: '11:30 PM' }
  ],
  'Custom Traditions': [
    { name: 'Pre-Wedding Celebration', time: '06:00 PM', duration: '10:00 PM' },
    { name: 'Main Wedding Ceremony', time: '04:00 PM', duration: '08:00 PM' },
    { name: 'Celebration Dinner & Dance', time: '08:00 PM', duration: '11:59 PM' }
  ]
};

export const CoupleOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveWeddingId } = useAuth();
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
    style: 'Royal Palace'
  });

  // Dynamic Functions State with Deselection & Custom addition support
  const [functionsList, setFunctionsList] = useState<WeddingFunctionItem[]>([
    { id: 'f-1', name: 'Ganesh Puja & Mandap Muhurat', date: '2026-11-20', startTime: '09:00 AM', endTime: '11:30 AM', orderIndex: 1, isSelected: true },
    { id: 'f-2', name: 'Haldi & Phoolon Ki Holi', date: '2026-11-20', startTime: '10:30 AM', endTime: '01:30 PM', orderIndex: 2, isSelected: true },
    { id: 'f-3', name: 'Mehendi & Sangeet Gala', date: '2026-11-20', startTime: '07:00 PM', endTime: '11:59 PM', orderIndex: 3, isSelected: true },
    { id: 'f-4', name: 'Baraat, Sacred Pheras & Wedding', date: '2026-11-21', startTime: '04:30 PM', endTime: '08:30 PM', orderIndex: 4, isSelected: true },
    { id: 'f-5', name: 'Grand Royal Reception & Banquet', date: '2026-11-21', startTime: '08:30 PM', endTime: '11:59 PM', orderIndex: 5, isSelected: true },
  ]);

  // New Custom Function Modal / Inline state
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customStartTime, setCustomStartTime] = useState('07:00 PM');
  const [customEndTime, setCustomEndTime] = useState('11:00 PM');

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

  // Handle tradition change -> Adapt suggested ceremonies
  const handleSelectTradition = (newTradition: string) => {
    setFormData({ ...formData, tradition: newTradition });
    const suggestions = TRADITION_DEFAULTS[newTradition] || TRADITION_DEFAULTS['Custom Traditions'];

    const newFunctions: WeddingFunctionItem[] = suggestions.map((item, idx) => ({
      id: `f-${Date.now()}-${idx}`,
      name: item.name,
      date: formData.weddingDate,
      startTime: item.time,
      endTime: item.duration,
      orderIndex: idx + 1,
      isSelected: true
    }));

    setFunctionsList(newFunctions);
  };

  // Toggle selection (deselection requirement)
  const handleToggleFunction = (id: string) => {
    setFunctionsList(prev =>
      prev.map(f => (f.id === id ? { ...f, isSelected: !f.isSelected } : f))
    );
  };

  // Remove function completely
  const handleRemoveFunction = (id: string) => {
    setFunctionsList(prev => prev.filter(f => f.id !== id));
  };

  // Add custom function
  const handleAddCustomFunction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    const newFunc: WeddingFunctionItem = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      date: formData.weddingDate,
      startTime: customStartTime,
      endTime: customEndTime,
      orderIndex: functionsList.length + 1,
      isSelected: true,
      isCustom: true
    };

    setFunctionsList([...functionsList, newFunc]);
    setCustomName('');
    setShowAddCustom(false);
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const selectedFunctions = functionsList.filter(f => f.isSelected);

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
        functions: selectedFunctions.map((f, i) => ({
          name: f.name,
          date: f.date,
          start_time: f.startTime,
          end_time: f.endTime,
          guest_count: formData.estimatedGuests,
          order_index: i + 1
        }))
      };

      const newWedding = await api.createWedding(payload);
      setActiveWeddingId(newWedding.id);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create wedding:', err);
      navigate('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCount = functionsList.filter(f => f.isSelected).length;

  return (
    <div className="bg-ivory min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gold-400 mx-auto mb-3 shadow-sm ring-4 ring-gold-50">
            <img
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=200&q=80"
              alt="The Royal Knot"
              className="w-full h-full object-cover"
            />
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
                  Auspicious Ritual Traditions (Adapts Functions)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {traditions.map((trad) => {
                    const isSelected = formData.tradition === trad;
                    return (
                      <button
                        key={trad}
                        type="button"
                        onClick={() => handleSelectTradition(trad)}
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

          {/* STEP 4: Multi-Function Schedule with Selection, Deselection, and Custom Add */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gold-200 gap-2">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-charcoal-800 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-burgundy-700" />
                    <span>Ceremony & Function Planner</span>
                  </h3>
                  <p className="text-xs text-charcoal-500 mt-0.5">
                    Tradition: <span className="font-semibold text-charcoal-800">{formData.tradition}</span> • Select or deselect functions below.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs bg-gold-100 text-gold-800 px-2.5 py-1 rounded-full font-bold">
                    {selectedCount} of {functionsList.length} Active
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAddCustom(true)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-burgundy-700 text-white text-xs font-medium hover:bg-burgundy-800 transition-colors shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Function</span>
                  </button>
                </div>
              </div>

              {/* Add Custom Function Dialog */}
              {showAddCustom && (
                <form
                  onSubmit={handleAddCustomFunction}
                  className="p-4 rounded-2xl bg-gold-50/70 border border-gold-300 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-charcoal-800">
                      Add Custom Ceremony / Function
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddCustom(false)}
                      className="p-1 text-charcoal-400 hover:text-charcoal-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-charcoal-700 mb-1">
                        Ceremony Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Cocktail & Sufi Night, Poolside Mehendi..."
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-gold-300 bg-white text-charcoal-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-charcoal-700 mb-1">
                        Time Slot
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 07:00 PM – 11:00 PM"
                        value={`${customStartTime} – ${customEndTime}`}
                        onChange={(e) => setCustomStartTime(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-gold-300 bg-white text-charcoal-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddCustom(false)}
                      className="px-3 py-1.5 rounded-lg border border-gold-200 text-charcoal-600 hover:bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-burgundy-700 text-white font-medium hover:bg-burgundy-800"
                    >
                      Save Custom Ceremony
                    </button>
                  </div>
                </form>
              )}

              {/* Function Items List with Full Deselection & Removal */}
              <div className="space-y-3">
                {functionsList.map((func) => (
                  <div
                    key={func.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      func.isSelected
                        ? 'bg-ivory-50/80 border-gold-300 shadow-sm'
                        : 'bg-charcoal-50/50 border-charcoal-200 opacity-60'
                    }`}
                  >
                    {/* Toggle Checkbox / Selection */}
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleFunction(func.id)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                          func.isSelected
                            ? 'bg-burgundy-700 text-white ring-2 ring-gold-300'
                            : 'border-2 border-charcoal-300 bg-white hover:border-gold-400'
                        }`}
                        title={func.isSelected ? 'Click to Deselect' : 'Click to Select'}
                      >
                        {func.isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-serif text-base font-bold ${
                              func.isSelected ? 'text-charcoal-900' : 'text-charcoal-500 line-through'
                            }`}
                          >
                            {func.name}
                          </span>
                          {func.isCustom && (
                            <span className="text-[10px] bg-gold-100 text-gold-800 px-1.5 py-0.2 rounded font-semibold">
                              Custom
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-charcoal-500 flex items-center gap-1.5 mt-0.5">
                          <Clock className="w-3.5 h-3.5 text-gold-600" />
                          <span>{func.date} • {func.startTime} to {func.endTime}</span>
                        </span>
                      </div>
                    </div>

                    {/* Actions: Status pill & Remove button */}
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => handleToggleFunction(func.id)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                          func.isSelected
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-amber-50 hover:text-amber-800'
                            : 'bg-charcoal-100 text-charcoal-500 border-charcoal-200 hover:bg-emerald-50 hover:text-emerald-800'
                        }`}
                      >
                        {func.isSelected ? 'Active' : 'Deselected'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveFunction(func.id)}
                        className="p-1.5 rounded-lg text-charcoal-400 hover:text-burgundy-700 hover:bg-burgundy-50 transition-colors"
                        title="Remove ceremony"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <strong>Platform Readiness:</strong> Submitting this configuration will automatically instantiate your Budget Guardian categories, generate initial task kanban boards, and match verified palace venues in {formData.destinationCity} for all active ceremonies.
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
                disabled={isSubmitting || selectedCount === 0}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-semibold uppercase tracking-wider shadow-md transition-all disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-300" />
                <span>{isSubmitting ? 'Instantiating Royal Wedding...' : `Launch Wedding Dashboard (${selectedCount} Functions)`}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
