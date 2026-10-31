import React, { useState } from 'react';
import { Calendar, Users, Hotel, ChevronRight, CheckCircle2, ShieldCheck, Sparkles, X, FileText, ArrowRight } from 'lucide-react';

export interface StayDetails {
  venueName?: string;
  checkIn: string;
  checkOut: string;
  rooms: number;
  guests: number;
  roomType?: string;
  specialRequests?: string;
}

interface StayPickerProps {
  venueName?: string;
  onConfirm?: (details: StayDetails) => void;
  defaultRooms?: number;
  defaultGuests?: number;
}

export const StayPicker: React.FC<StayPickerProps> = ({
  venueName = 'Rambagh Palace, Jaipur',
  onConfirm,
  defaultRooms = 25,
  defaultGuests = 60,
}) => {
  const [checkIn, setCheckIn] = useState('2026-11-20');
  const [checkOut, setCheckOut] = useState('2026-11-23');
  const [rooms, setRooms] = useState(defaultRooms);
  const [guests, setGuests] = useState(defaultGuests);
  const [roomType, setRoomType] = useState('Heritage Palace Suite');
  const [specialRequests, setSpecialRequests] = useState('Imperial Welcome Garlands, Private Airport Chauffeurs for VVIPs, Early Check-In for Groom Entourage');

  // Modal State
  const [showQuotationModal, setShowQuotationModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quotationSubmitted, setQuotationSubmitted] = useState<any | null>(null);

  const calculateNights = () => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));
    return diff > 0 ? diff : 1;
  };

  const nights = calculateNights();

  // Pricing calculations
  const pricePerRoomNight = roomType === 'Maharaja Presidential Villa' ? 45000 : roomType === 'Heritage Palace Suite' ? 22000 : 16000;
  const standardTotal = nights * rooms * pricePerRoomNight;
  const privilegeDiscount = Math.round(standardTotal * 0.15); // 15% Royal Knot group privilege
  const discountedTotal = standardTotal - privilegeDiscount;
  const gst18pct = Math.round(discountedTotal * 0.18);
  const grandTotal = discountedTotal + gst18pct;

  const handleOpenModal = () => {
    setShowQuotationModal(true);
    setQuotationSubmitted(null);
  };

  const handleDispatchQuotation = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const quoteRef = `RB-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const quoteData = {
        reference: quoteRef,
        venueName,
        checkIn,
        checkOut,
        nights,
        rooms,
        guests,
        roomType,
        specialRequests,
        grandTotal,
        discountedTotal,
        status: 'Confirmed & Dispatched to Palace Concierge',
        submittedAt: new Date().toLocaleString('en-IN')
      };

      // Save to local storage for correlation
      const existingQuotes = JSON.parse(localStorage.getItem('royal_knot_room_quotes') || '[]');
      existingQuotes.unshift(quoteData);
      localStorage.setItem('royal_knot_room_quotes', JSON.stringify(existingQuotes));

      // Also register notification
      const existingNotifs = JSON.parse(localStorage.getItem('royal_knot_notifications') || '[]');
      existingNotifs.unshift({
        id: `notif-${Date.now()}`,
        title: `Room Block Quotation Dispatched (${quoteRef})`,
        message: `${venueName} allocated ${rooms} rooms (${nights} nights) for ₹${grandTotal.toLocaleString('en-IN')}.`,
        created_at: new Date().toISOString()
      });
      localStorage.setItem('royal_knot_notifications', JSON.stringify(existingNotifs));

      setQuotationSubmitted(quoteData);
      setIsSubmitting(false);

      if (onConfirm) {
        onConfirm({ venueName, checkIn, checkOut, rooms, guests, roomType, specialRequests });
      }
    }, 700);
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gold-300 p-6 shadow-royal max-w-xl mx-auto">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gold-200">
          <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700">
            <Hotel className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif text-xl font-bold text-charcoal-800">Destination Stay & Room Blocks</h4>
            <p className="text-xs text-charcoal-500">Curate multi-night accommodation for {venueName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold-600" />
              Check-In Date
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold-600" />
              Check-Out Date
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1.5 flex items-center gap-1.5">
              <Hotel className="w-3.5 h-3.5 text-gold-600" />
              Required Rooms
            </label>
            <input
              type="number"
              min="1"
              max="300"
              value={rooms}
              onChange={(e) => setRooms(parseInt(e.target.value) || 1)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-gold-600" />
              Staying Guests
            </label>
            <input
              type="number"
              min="1"
              max="600"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1.5">
            Palace Suite Tier
          </label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
          >
            <option value="Deluxe Palace Room">Deluxe Palace Room (₹16,000/night)</option>
            <option value="Heritage Palace Suite">Heritage Palace Suite (₹22,000/night)</option>
            <option value="Maharaja Presidential Villa">Maharaja Presidential Villa (₹45,000/night)</option>
          </select>
        </div>

        <div className="bg-ivory-100 rounded-xl p-3.5 border border-gold-200/80 flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-charcoal-500 uppercase tracking-wider">Stay Summary</p>
            <p className="font-serif text-base font-bold text-burgundy-800">
              {nights} Nights • {rooms} Rooms • {guests} Guests
            </p>
          </div>
          <span className="text-xs font-medium text-gold-700 bg-gold-100/80 px-2.5 py-1 rounded-full border border-gold-300">
            15% Group Privilege
          </span>
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-burgundy-700 text-white font-medium shadow-sm hover:bg-burgundy-800 transition-all text-sm uppercase tracking-wider"
        >
          <span>Request Room Block Quotation</span>
          <ChevronRight className="w-4 h-4 text-gold-300" />
        </button>
      </div>

      {/* Interactive Room Block Quotation Modal */}
      {showQuotationModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-gold-300 shadow-royal overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-burgundy-900 via-burgundy-800 to-burgundy-900 text-white p-6 relative">
              <button
                type="button"
                onClick={() => setShowQuotationModal(false)}
                className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 text-gold-300 text-xs font-bold uppercase tracking-widest mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Palace Hospitality Concierge</span>
              </div>
              <h3 className="font-serif text-2xl font-bold">Room Block Quotation Request</h3>
              <p className="text-xs text-gold-100/80 mt-0.5">{venueName}</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {!quotationSubmitted ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-ivory-50 border border-gold-200 text-center">
                    <div>
                      <span className="text-[10px] text-charcoal-400 uppercase tracking-wider block">Duration</span>
                      <span className="text-sm font-bold text-charcoal-800">{nights} Nights</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-charcoal-400 uppercase tracking-wider block">Reserved Rooms</span>
                      <span className="text-sm font-bold text-charcoal-800">{rooms} Rooms</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-charcoal-400 uppercase tracking-wider block">Accommodating</span>
                      <span className="text-sm font-bold text-charcoal-800">{guests} Guests</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-charcoal-400 uppercase tracking-wider block">Suite Category</span>
                      <span className="text-xs font-bold text-burgundy-800 truncate block">{roomType.split(' ')[0]}</span>
                    </div>
                  </div>

                  {/* Financial Breakdown */}
                  <div className="p-4 rounded-2xl bg-white border border-gold-300 space-y-2 text-xs">
                    <span className="font-bold text-charcoal-800 block mb-1 text-xs uppercase tracking-wider">
                      Estimated Cost Breakdown
                    </span>
                    <div className="flex justify-between text-charcoal-600">
                      <span>Standard Rate ({rooms} rooms × {nights} nights @ ₹{pricePerRoomNight.toLocaleString('en-IN')})</span>
                      <span>₹{standardTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>The Royal Knot Concierge 15% Group Privilege</span>
                      <span>-₹{privilegeDiscount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-charcoal-600">
                      <span>Hospitality GST (18%)</span>
                      <span>₹{gst18pct.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="pt-2 border-t border-gold-200 flex justify-between font-serif text-sm font-bold text-charcoal-900">
                      <span>Estimated Total Block Commitment</span>
                      <span className="text-burgundy-800">₹{grandTotal.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-700 mb-1.5 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-gold-600" />
                      Special Hospitality Directives & Notes
                    </label>
                    <textarea
                      rows={3}
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Add requirements: VIP luggage handling, welcome drinks, connected suites..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800 text-xs focus:outline-none focus:ring-2 focus:ring-gold-400"
                    />
                  </div>

                  {/* Dispatch CTA */}
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowQuotationModal(false)}
                      className="w-1/3 py-3 rounded-xl border border-gold-300 text-charcoal-700 font-medium text-xs uppercase tracking-wider hover:bg-ivory-100 transition-colors"
                    >
                      Modify
                    </button>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleDispatchQuotation}
                      className="w-2/3 py-3 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold text-xs uppercase tracking-wider shadow-royal transition-all inline-flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <span>Transmitting to Palace...</span>
                      ) : (
                        <>
                          <span>Submit & Dispatch Quotation</span>
                          <ArrowRight className="w-4 h-4 text-gold-300" />
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                /* Success Confirmation View */
                <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-300 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Quotation Dispatched
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-charcoal-900 mt-2">
                      Reference #{quotationSubmitted.reference}
                    </h4>
                    <p className="text-xs text-charcoal-600 max-w-md mx-auto mt-1 leading-relaxed">
                      Your formal room block requisition has been transmitted to {quotationSubmitted.venueName}. A dedicated hospitality concierge will contact you within 2 hours.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-ivory-50 border border-gold-200 text-left text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Venue:</span>
                      <span className="font-semibold text-charcoal-800">{quotationSubmitted.venueName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Dates:</span>
                      <span className="font-semibold text-charcoal-800">{quotationSubmitted.checkIn} to {quotationSubmitted.checkOut} ({quotationSubmitted.nights} Nights)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Reserved Inventory:</span>
                      <span className="font-semibold text-charcoal-800">{quotationSubmitted.rooms} Rooms ({quotationSubmitted.roomType})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Locked Group Tariff:</span>
                      <span className="font-bold text-burgundy-800">₹{quotationSubmitted.grandTotal.toLocaleString('en-IN')} (incl. 18% GST)</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowQuotationModal(false)}
                    className="w-full py-3 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white font-medium text-xs uppercase tracking-wider transition-colors"
                  >
                    Done & Return to Workspace
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
