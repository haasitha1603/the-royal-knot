import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Guest, SeatingTable } from '../../types';
import { RoyalLoader } from '../../components/ui/RoyalLoader';
import {
  Users,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Filter,
  UserCheck,
  Utensils,
  Crown,
  Sparkles
} from 'lucide-react';

export const GuestManagementPage: React.FC = () => {
  const { activeWeddingId } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [tables, setTables] = useState<SeatingTable[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkInFeedback, setCheckInFeedback] = useState<string | null>(null);

  const loadGuestData = async () => {
    try {
      const [gData, tData] = await Promise.all([
        api.getGuests(activeWeddingId),
        api.getSeatingTables(activeWeddingId)
      ]);
      setGuests(gData);
      setTables(tData);
    } catch (err) {
      console.error('Error fetching guests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGuestData();
  }, [activeWeddingId]);

  const handleSimulateCheckin = async (guest: Guest) => {
    try {
      const res = await api.simulateGuestCheckin(guest.id);
      setCheckInFeedback(`QR Check-In Verified: ${res.guest_name} ${res.is_vip ? '(VIP)' : ''} checked in.`);
      await loadGuestData();
    } catch (err) {
      console.error('Checkin error:', err);
    }
  };

  const handleAssignTable = async (guestId: string, tableId: string) => {
    try {
      await api.assignGuestToTable(activeWeddingId, tableId, guestId);
      await loadGuestData();
    } catch (err: any) {
      alert(err.message || 'Capacity limit reached for this table.');
    }
  };

  const filteredGuests = guests.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.group_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.dietary_preference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <RoyalLoader message="Loading guest roster and seating architecture..." />
      </div>
    );
  }

  const attendingCount = guests.filter(g => g.rsvp_status === 'attending').length;
  const checkedInCount = guests.filter(g => g.check_in_status).length;
  const vipCount = guests.filter(g => g.is_vip).length;

  return (
    <div className="bg-ivory min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="rounded-3xl bg-white border border-gold-300 p-6 sm:p-8 shadow-royal flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-700 bg-gold-50 px-3 py-0.5 rounded-full border border-gold-200">
                Hospitality & Protocol
              </span>
              <span className="text-xs text-charcoal-400">400 Guests Basis</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal-900">
              Guest Architect & Visual Seating
            </h1>
            <p className="text-xs text-charcoal-500 mt-1">
              Manage RSVP attendance, dietary accommodations (Jain, Satvik, Halal), and table capacity validation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-ivory-50 px-4 py-2 rounded-xl border border-gold-200 text-center">
              <span className="font-serif text-2xl font-bold text-charcoal-800 block">{attendingCount}</span>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-500">Confirmed RSVPs</span>
            </div>
            <div className="bg-ivory-50 px-4 py-2 rounded-xl border border-gold-200 text-center">
              <span className="font-serif text-2xl font-bold text-emerald-800 block">{checkedInCount}</span>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-500">Checked In</span>
            </div>
            <div className="bg-ivory-50 px-4 py-2 rounded-xl border border-gold-200 text-center">
              <span className="font-serif text-2xl font-bold text-burgundy-800 block">{vipCount}</span>
              <span className="text-[10px] uppercase tracking-wider text-charcoal-500">VIP Dignitaries</span>
            </div>
          </div>
        </div>

        {checkInFeedback && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{checkInFeedback}</span>
            </div>
            <button
              onClick={() => setCheckInFeedback(null)}
              className="text-[11px] underline font-semibold text-emerald-800"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* VISUAL SEATING TABLES ARCHITECTURE (Section 5.11) */}
        <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal">
          <div className="flex items-center justify-between pb-4 border-b border-gold-200 mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-charcoal-800">
                Palace Dining & Banqueting Tables
              </h2>
              <p className="text-xs text-charcoal-500">
                Capacity-validated seating arrangements. Prevents table over-assignment.
              </p>
            </div>
            <span className="text-xs font-semibold text-charcoal-600 bg-ivory-100 px-3 py-1 rounded-full border border-gold-200">
              {tables.length} Active Tables
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => {
              const assignedGuests = guests.filter(g => g.table_id === table.id);
              const isFull = assignedGuests.length >= table.capacity;

              return (
                <div
                  key={table.id}
                  className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                    table.shape === 'royal_banquet'
                      ? 'border-2 border-gold-400 bg-gold-50/40 shadow-sm'
                      : 'border-gold-200 bg-ivory-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif text-lg font-bold text-charcoal-800">
                        {table.table_name}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isFull
                            ? 'bg-red-50 text-red-800 border-red-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {assignedGuests.length} / {table.capacity} Seated
                      </span>
                    </div>

                    <p className="text-[11px] text-charcoal-500 capitalize mb-3">
                      Table #{table.table_number} • {table.shape.replace('_', ' ')} Layout
                    </p>

                    <div className="space-y-1.5 min-h-[90px]">
                      {assignedGuests.length === 0 ? (
                        <p className="text-[11px] text-charcoal-400 italic">No guests assigned yet.</p>
                      ) : (
                        assignedGuests.map((g) => (
                          <div
                            key={g.id}
                            className="flex items-center justify-between text-xs bg-white px-2.5 py-1 rounded-lg border border-gold-200/60"
                          >
                            <span className="font-medium text-charcoal-800">
                              {g.name} {g.is_vip && <span className="text-[10px] text-burgundy-700 font-bold">[VIP]</span>}
                            </span>
                            <span className="text-[10px] text-charcoal-400">{g.dietary_preference}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gold-200/60 mt-3 flex items-center justify-between text-[11px] text-charcoal-500">
                    <span>{isFull ? 'At Full Capacity' : `${table.capacity - assignedGuests.length} seats available`}</span>
                    {table.shape === 'royal_banquet' && (
                      <span className="font-semibold text-gold-800">VIP Head Table</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* GUEST ROSTER TABLE & QR CHECK-IN SIMULATION */}
        <div className="bg-white rounded-3xl border border-gold-300 p-6 sm:p-8 shadow-royal">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-gold-200 mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-charcoal-800">
                Guest Registry & QR Check-In Terminal
              </h2>
              <p className="text-xs text-charcoal-500">
                Simulate tablet QR badge scan at the Rambagh Palace foyer reception desk.
              </p>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search guest or dietary tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-gold-300 bg-ivory-50 text-charcoal-800"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700">
              <thead className="bg-ivory-100 text-charcoal-500 uppercase tracking-wider border-b border-gold-200">
                <tr>
                  <th className="py-3 px-4">Guest Name</th>
                  <th className="py-3 px-4">Group</th>
                  <th className="py-3 px-4">Dietary</th>
                  <th className="py-3 px-4">Table Assignment</th>
                  <th className="py-3 px-4">RSVP Status</th>
                  <th className="py-3 px-4 text-right">QR Check-In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-100">
                {filteredGuests.map((g) => (
                  <tr key={g.id} className="hover:bg-ivory-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-charcoal-900 flex items-center gap-1.5">
                        <span>{g.name}</span>
                        {g.is_vip && (
                          <span className="text-[10px] font-bold text-burgundy-800 bg-burgundy-50 px-1.5 py-0.2 rounded border border-burgundy-200">
                            VIP
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-charcoal-400">{g.phone || g.email}</span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-charcoal-600">{g.group_name}</td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] bg-ivory-100 text-charcoal-700 px-2 py-0.5 rounded border border-gold-200">
                        <Utensils className="w-3 h-3 text-gold-600" />
                        <span>{g.dietary_preference}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={g.table_id || ''}
                        onChange={(e) => {
                          if (e.target.value) handleAssignTable(g.id, e.target.value);
                        }}
                        className="px-2 py-1 text-xs rounded-lg border border-gold-300 bg-white text-charcoal-800"
                      >
                        <option value="">Unassigned</option>
                        {tables.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.table_name} (#{t.table_number})
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-bold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        {g.rsvp_status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {g.check_in_status ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Checked In</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSimulateCheckin(g)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-burgundy-700 hover:bg-burgundy-800 text-white font-semibold text-[11px] uppercase tracking-wider transition-colors shadow-sm"
                        >
                          <QrCode className="w-3 h-3 text-gold-300" />
                          <span>Scan QR</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
