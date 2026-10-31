import React, { useState } from 'react';
import { Clock, Calendar, CheckCircle, Sparkles } from 'lucide-react';

interface SlotPickerProps {
  onSlotSelected?: (slot: { date: string; time: string; type: string }) => void;
  entityName?: string;
  defaultDate?: string;
}

export const SlotPicker: React.FC<SlotPickerProps> = ({
  onSlotSelected,
  entityName = "Rambagh Palace Jaipur (Palace Concierge)",
  defaultDate = "2026-11-10",
}) => {
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [consultType, setConsultType] = useState<string>('walkthrough');
  const [isBooked, setIsBooked] = useState(false);

  const availableSlots = [
    { time: "10:30 AM - 11:30 AM", status: "available" },
    { time: "12:00 PM - 01:00 PM", status: "available" },
    { time: "02:30 PM - 03:30 PM", status: "booked" },
    { time: "04:00 PM - 05:00 PM", status: "available" },
    { time: "05:30 PM - 06:30 PM", status: "available" },
  ];

  const handleConfirm = () => {
    if (!selectedTime) return;
    setIsBooked(true);
    if (onSlotSelected) {
      onSlotSelected({
        date: selectedDate,
        time: selectedTime,
        type: consultType,
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gold-300 p-6 shadow-royal max-w-xl mx-auto">
      <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gold-200">
        <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-serif text-xl font-bold text-charcoal-800">Private Appointment & Walkthrough</h4>
          <p className="text-xs text-charcoal-500">With {entityName}</p>
        </div>
      </div>

      {isBooked ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center my-4">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6" />
          </div>
          <h5 className="font-serif text-lg font-bold text-emerald-900 mb-1">Appointment Confirmed</h5>
          <p className="text-xs text-emerald-800 mb-2">
            Scheduled for {selectedDate} at {selectedTime} ({consultType === 'walkthrough' ? 'On-site Walkthrough' : 'Virtual Consultation'}).
          </p>
          <p className="text-[11px] text-emerald-700">
            A confirmation reminder will be reflected in your Planning Command Centre.
          </p>
          <button
            onClick={() => setIsBooked(false)}
            className="mt-4 text-xs font-semibold text-emerald-900 underline hover:text-emerald-700"
          >
            Schedule Another Slot
          </button>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-2">
              Appointment Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setConsultType('walkthrough')}
                className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all text-center ${
                  consultType === 'walkthrough'
                    ? 'border-burgundy-700 bg-burgundy-50 text-burgundy-900 font-semibold shadow-sm'
                    : 'border-gold-200 bg-ivory-50 text-charcoal-600 hover:border-gold-300'
                }`}
              >
                On-site Palace Walkthrough
              </button>
              <button
                type="button"
                onClick={() => setConsultType('virtual')}
                className={`py-2 px-3 text-xs font-medium rounded-xl border transition-all text-center ${
                  consultType === 'virtual'
                    ? 'border-burgundy-700 bg-burgundy-50 text-burgundy-900 font-semibold shadow-sm'
                    : 'border-gold-200 bg-ivory-50 text-charcoal-600 hover:border-gold-300'
                }`}
              >
                Virtual Video Consultation
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold-600" />
              Select Preferred Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-700 text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal-600 mb-2">
              Available Time Slots (IST)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {availableSlots.map((slot, index) => {
                const isSelected = selectedTime === slot.time;
                const isBookedSlot = slot.status === 'booked';
                return (
                  <button
                    key={index}
                    type="button"
                    disabled={isBookedSlot}
                    onClick={() => setSelectedTime(slot.time)}
                    className={`py-2.5 px-3.5 rounded-xl text-xs font-medium border flex items-center justify-between transition-all ${
                      isBookedSlot
                        ? 'opacity-40 bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : isSelected
                        ? 'border-gold-500 bg-gold-50 text-gold-900 font-bold shadow-sm ring-1 ring-gold-400'
                        : 'border-gold-200/80 bg-white text-charcoal-700 hover:border-gold-400'
                    }`}
                  >
                    <span>{slot.time}</span>
                    <span className="text-[10px] uppercase tracking-wider">
                      {isBookedSlot ? 'Reserved' : isSelected ? 'Selected' : 'Available'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            disabled={!selectedTime}
            onClick={handleConfirm}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-burgundy-700 text-white font-medium shadow-sm hover:bg-burgundy-800 transition-all text-xs uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-300" />
            <span>Confirm Appointment Slot</span>
          </button>
        </>
      )}
    </div>
  );
};
