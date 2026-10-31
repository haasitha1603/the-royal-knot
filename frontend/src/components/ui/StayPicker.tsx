import React, { useState } from 'react';
import { Calendar, Users, Hotel, ChevronRight } from 'lucide-react';

interface StayPickerProps {
  onConfirm?: (details: { checkIn: string; checkOut: string; rooms: number; guests: number }) => void;
  defaultRooms?: number;
  defaultGuests?: number;
}

export const StayPicker: React.FC<StayPickerProps> = ({
  onConfirm,
  defaultRooms = 25,
  defaultGuests = 60,
}) => {
  const [checkIn, setCheckIn] = useState('2026-11-20');
  const [checkOut, setCheckOut] = useState('2026-11-23');
  const [rooms, setRooms] = useState(defaultRooms);
  const [guests, setGuests] = useState(defaultGuests);

  const calculateNights = () => {
    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const diff = (d2.getTime() - d1.getTime()) / (1000 * 3600 * 24);
    return diff > 0 ? diff : 1;
  };

  const nights = calculateNights();

  const handleApply = () => {
    if (onConfirm) {
      onConfirm({ checkIn, checkOut, rooms, guests });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gold-300 p-6 shadow-royal max-w-xl mx-auto">
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gold-200">
        <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700">
          <Hotel className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-serif text-xl font-bold text-charcoal-800">Destination Stay & Room Blocks</h4>
          <p className="text-xs text-charcoal-500">Curate multi-night accommodation for wedding guests & families</p>
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

      <div className="grid grid-cols-2 gap-4 mb-6">
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

      <div className="bg-ivory-100 rounded-xl p-3.5 border border-gold-200/80 flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-charcoal-500 uppercase tracking-wider">Stay Summary</p>
          <p className="font-serif text-base font-bold text-burgundy-800">
            {nights} Nights • {rooms} Rooms • {guests} Guests
          </p>
        </div>
        <span className="text-xs font-medium text-gold-700 bg-gold-100/80 px-2.5 py-1 rounded-full border border-gold-300">
          Group Rates Applied
        </span>
      </div>

      <button
        type="button"
        onClick={handleApply}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-burgundy-700 text-white font-medium shadow-sm hover:bg-burgundy-800 transition-all text-sm uppercase tracking-wider"
      >
        <span>Request Room Block Quotation</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
