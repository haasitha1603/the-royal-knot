import React, { useState } from 'react';
import { Guest, SeatingTable } from '../../types';
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  X,
  Search,
  Filter,
  UserCheck,
  Utensils
} from 'lucide-react';

interface VisualSeatingPlannerProps {
  tables: SeatingTable[];
  guests: Guest[];
  onAssignGuest: (guestId: string, tableId: string) => Promise<void>;
  onUnassignGuest?: (guestId: string) => Promise<void>;
}

export const VisualSeatingPlanner: React.FC<VisualSeatingPlannerProps> = ({
  tables,
  guests,
  onAssignGuest,
  onUnassignGuest
}) => {
  const [selectedGuestForSeating, setSelectedGuestForSeating] = useState<Guest | null>(null);
  const [selectedSeatInfo, setSelectedSeatInfo] = useState<{ table: SeatingTable; guest?: Guest; seatIndex: number } | null>(null);
  const [guestSearch, setGuestSearch] = useState('');

  // Unassigned Guests
  const unassignedGuests = guests.filter(g => !g.table_id);
  const filteredUnassigned = unassignedGuests.filter(g =>
    g.name.toLowerCase().includes(guestSearch.toLowerCase()) ||
    g.group_name.toLowerCase().includes(guestSearch.toLowerCase()) ||
    g.dietary_preference.toLowerCase().includes(guestSearch.toLowerCase())
  );

  const handleSeatClick = async (table: SeatingTable, seatIndex: number, currentGuest?: Guest) => {
    if (currentGuest) {
      // Chair is occupied, show details
      setSelectedSeatInfo({ table, guest: currentGuest, seatIndex });
      return;
    }

    // Chair is vacant
    if (selectedGuestForSeating) {
      const assignedCount = guests.filter(g => g.table_id === table.id).length;
      if (assignedCount >= table.capacity) {
        alert(`Table "${table.table_name}" is at maximum capacity (${table.capacity}/${table.capacity}).`);
        return;
      }

      await onAssignGuest(selectedGuestForSeating.id, table.id);
      setSelectedGuestForSeating(null);
    } else {
      setSelectedSeatInfo({ table, seatIndex });
    }
  };

  const handleVacateSeat = async (guestId: string) => {
    if (onUnassignGuest) {
      await onUnassignGuest(guestId);
    } else {
      // Fallback empty assignment
      await onAssignGuest(guestId, '');
    }
    setSelectedSeatInfo(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls & Status Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-ivory-100 border border-gold-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-700">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-base font-bold text-charcoal-900">
              Palace Banquet Floorplan Architecture
            </h3>
            <p className="text-xs text-charcoal-500">
              Click an unassigned guest on the palette, then click any vacant chair on the canvas to seat.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="bg-white px-3 py-1.5 rounded-xl border border-gold-200 font-semibold text-charcoal-700">
            {unassignedGuests.length} Guests Unassigned
          </span>
          <span className="bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold">
            {guests.length - unassignedGuests.length} Guests Seated
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* =========================================================================
            LEFT COLUMN: UNASSIGNED GUEST PALETTE
            ========================================================================= */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-gold-300 p-4 shadow-royal flex flex-col h-[640px]">
          <div className="pb-3 border-b border-gold-200 mb-3">
            <h4 className="font-serif text-sm font-bold text-charcoal-800 mb-2">
              Unassigned Guest Roster
            </h4>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-charcoal-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search unassigned..."
                value={guestSearch}
                onChange={(e) => setGuestSearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-xl border border-gold-200 bg-ivory-50 text-charcoal-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredUnassigned.length === 0 ? (
              <div className="p-6 text-center text-xs text-charcoal-400 italic">
                No unassigned guests matching search.
              </div>
            ) : (
              filteredUnassigned.map((g) => {
                const isSelected = selectedGuestForSeating?.id === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGuestForSeating(isSelected ? null : g)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all text-xs flex flex-col gap-1 ${
                      isSelected
                        ? 'border-burgundy-700 bg-burgundy-50 text-burgundy-950 font-bold ring-2 ring-gold-400 shadow-sm'
                        : 'border-gold-100 bg-ivory-50/70 hover:bg-gold-50/50 text-charcoal-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold truncate">{g.name}</span>
                      {g.is_vip && (
                        <span className="text-[9px] uppercase font-bold text-burgundy-800 bg-white px-1.5 py-0.2 rounded border border-burgundy-200">
                          VIP
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-charcoal-500">
                      <span>{g.group_name}</span>
                      <span>{g.dietary_preference}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {selectedGuestForSeating && (
            <div className="mt-3 p-2.5 rounded-xl bg-gold-100 border border-gold-300 text-[11px] text-gold-900 text-center font-medium animate-pulse">
              Select an open chair on any table to seat <strong>{selectedGuestForSeating.name}</strong>
            </div>
          )}
        </div>

        {/* =========================================================================
            RIGHT COLUMN: INTERACTIVE VISUAL FLOORPLAN CANVAS
            ========================================================================= */}
        <div className="lg:col-span-3 bg-[#FAF7F2] rounded-3xl border border-gold-300 p-6 shadow-royal overflow-x-auto min-h-[640px]">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-gold-200">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-gold-800">
                Floor Plan Layout
              </span>
              <h3 className="font-serif text-lg font-bold text-charcoal-800">
                Rambagh Palace Grand Maharani Banquet Hall
              </h3>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 text-[10px] text-charcoal-600">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-burgundy-700" />
                <span>VIP Guest</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                <span>Confirmed Guest</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-gold-400 bg-white" />
                <span>Vacant Chair</span>
              </span>
            </div>
          </div>

          {/* Grid of Tables on Visual Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
            {tables.map((table) => {
              const assignedGuests = guests.filter(g => g.table_id === table.id);
              const capacity = table.capacity;
              const isVIPHead = table.shape === 'royal_banquet';

              return (
                <div
                  key={table.id}
                  className={`relative p-8 rounded-3xl transition-all flex flex-col items-center justify-center ${
                    isVIPHead
                      ? 'w-full max-w-md bg-white border-2 border-gold-400 shadow-md ring-4 ring-gold-100/50'
                      : 'w-72 h-72 rounded-full bg-white border border-gold-300 shadow-sm'
                  }`}
                >
                  {/* VIP Head Table Layout (Rectangular with side chairs) */}
                  {isVIPHead ? (
                    <div className="w-full">
                      {/* Top Chairs */}
                      <div className="flex justify-around mb-2">
                        {Array.from({ length: Math.floor(capacity / 2) }).map((_, idx) => {
                          const guest = assignedGuests[idx];
                          return (
                            <button
                              key={`top-${idx}`}
                              type="button"
                              onClick={() => handleSeatClick(table, idx, guest)}
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-110 shadow-sm ${
                                guest
                                  ? guest.is_vip
                                    ? 'bg-burgundy-700 text-white ring-2 ring-gold-400'
                                    : 'bg-emerald-700 text-white'
                                  : 'border-2 border-dashed border-gold-400 bg-ivory-50 text-gold-700 hover:bg-gold-100'
                              }`}
                              title={guest ? `${guest.name} (${guest.dietary_preference})` : 'Empty Chair (Click to Seat)'}
                            >
                              {guest ? guest.name.charAt(0) : '+'}
                            </button>
                          );
                        })}
                      </div>

                      {/* Center Table Surface */}
                      <div className="py-4 px-6 rounded-2xl bg-gradient-to-r from-gold-100 via-ivory-100 to-gold-100 border border-gold-300 text-center shadow-inner my-1">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-burgundy-800 block">
                          VIP Imperial Head Table
                        </span>
                        <h4 className="font-serif text-base font-bold text-charcoal-900">
                          {table.table_name}
                        </h4>
                        <span className="text-[10px] font-bold text-charcoal-600">
                          {assignedGuests.length} / {capacity} Seated
                        </span>
                      </div>

                      {/* Bottom Chairs */}
                      <div className="flex justify-around mt-2">
                        {Array.from({ length: Math.ceil(capacity / 2) }).map((_, idx) => {
                          const actualIdx = Math.floor(capacity / 2) + idx;
                          const guest = assignedGuests[actualIdx];
                          return (
                            <button
                              key={`bottom-${idx}`}
                              type="button"
                              onClick={() => handleSeatClick(table, actualIdx, guest)}
                              className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-110 shadow-sm ${
                                guest
                                  ? guest.is_vip
                                    ? 'bg-burgundy-700 text-white ring-2 ring-gold-400'
                                    : 'bg-emerald-700 text-white'
                                  : 'border-2 border-dashed border-gold-400 bg-ivory-50 text-gold-700 hover:bg-gold-100'
                              }`}
                              title={guest ? `${guest.name} (${guest.dietary_preference})` : 'Empty Chair (Click to Seat)'}
                            >
                              {guest ? guest.name.charAt(0) : '+'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Circular Table Layout with Radially Positioned Chairs */
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Radial Chairs positioned at trigonometric angles */}
                      {Array.from({ length: capacity }).map((_, idx) => {
                        const angle = (idx * (2 * Math.PI)) / capacity - Math.PI / 2;
                        const radius = 108; // pixels from center
                        const x = Math.round(radius * Math.cos(angle));
                        const y = Math.round(radius * Math.sin(angle));
                        const guest = assignedGuests[idx];

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleSeatClick(table, idx, guest)}
                            style={{
                              transform: `translate(${x}px, ${y}px)`,
                            }}
                            className={`absolute w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-125 shadow-sm z-10 ${
                              guest
                                ? guest.is_vip
                                  ? 'bg-burgundy-700 text-white ring-2 ring-gold-400'
                                  : 'bg-emerald-700 text-white'
                                : 'border-2 border-dashed border-gold-400 bg-white text-gold-700 hover:bg-gold-100'
                            }`}
                            title={guest ? `${guest.name} (${guest.dietary_preference})` : 'Empty Chair (Click to Seat)'}
                          >
                            {guest ? guest.name.charAt(0) : '+'}
                          </button>
                        );
                      })}

                      {/* Center Circular Table Disc */}
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-ivory-100 via-gold-50 to-ivory-100 border-2 border-gold-300 flex flex-col items-center justify-center p-2 text-center shadow-inner">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-gold-800">
                          Table #{table.table_number}
                        </span>
                        <h4 className="font-serif text-xs font-bold text-charcoal-900 leading-tight">
                          {table.table_name}
                        </h4>
                        <span className="text-[10px] font-bold text-charcoal-600 mt-0.5">
                          {assignedGuests.length}/{capacity}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Seat Detail Modal / Vacate Action */}
      {selectedSeatInfo && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl bg-white border border-gold-300 shadow-royal-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gold-200 pb-3">
              <div>
                <h4 className="font-serif text-base font-bold text-charcoal-900">
                  {selectedSeatInfo.table.table_name}
                </h4>
                <p className="text-xs text-charcoal-500">Seat #{selectedSeatInfo.seatIndex + 1}</p>
              </div>
              <button
                onClick={() => setSelectedSeatInfo(null)}
                className="p-1 text-charcoal-400 hover:text-charcoal-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {selectedSeatInfo.guest ? (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-ivory-50 border border-gold-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-charcoal-900 text-sm">
                      {selectedSeatInfo.guest.name}
                    </span>
                    {selectedSeatInfo.guest.is_vip && (
                      <span className="text-[10px] font-bold text-burgundy-800 bg-burgundy-50 px-2 py-0.5 rounded border border-burgundy-200">
                        VIP Dignitary
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-charcoal-600">
                    <span>Group:</span>
                    <span>{selectedSeatInfo.guest.group_name}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-600">
                    <span>Dietary Preference:</span>
                    <span className="font-medium text-emerald-800">{selectedSeatInfo.guest.dietary_preference}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleVacateSeat(selectedSeatInfo.guest!.id)}
                  className="w-full py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-semibold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Vacate / Unseat Guest
                </button>
              </div>
            ) : (
              <div className="text-xs text-charcoal-600 space-y-3">
                <p>This chair is currently vacant.</p>
                <p className="text-[11px] text-charcoal-500">
                  Select a guest from the Unassigned Guest Roster on the left palette to seat them here.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedSeatInfo(null)}
                  className="w-full py-2 rounded-xl border border-gold-300 text-charcoal-700 text-xs font-semibold hover:bg-ivory-50"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
