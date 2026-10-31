import React, { useState } from 'react';
import { StayPicker } from '../../components/ui/StayPicker';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Plane,
  Hotel,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const DestinationPage: React.FC = () => {
  const [selectedDestination, setSelectedDestination] = useState('Jaipur');
  const [stayBookedMessage, setStayBookedMessage] = useState<string | null>(null);

  const destinations = [
    {
      city: 'Jaipur',
      title: 'The Pink City of Palaces',
      tagline: 'Amber grandeur, imperial processions & majestic fortresses',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
      avgGuests: '300 – 600',
      bestSeason: 'October to March'
    },
    {
      city: 'Udaipur',
      title: 'Venice of the East',
      tagline: 'Serene lakefront pavilions and marble island palaces',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      avgGuests: '200 – 450',
      bestSeason: 'September to March'
    },
    {
      city: 'Jodhpur',
      title: 'The Sun City Citadel',
      tagline: 'Towering golden sandstone bastions and royal courtyards',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      avgGuests: '250 – 500',
      bestSeason: 'October to February'
    },
    {
      city: 'Goa',
      title: 'Tropical Coastal Elegance',
      tagline: 'Pristine private beachside mandaps and sunset cocktail lawns',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      avgGuests: '150 – 350',
      bestSeason: 'November to April'
    }
  ];

  return (
    <div className="bg-ivory min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-gold-700 bg-gold-100/80 px-3 py-1 rounded-full border border-gold-300">
            Regal Locations
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 mt-3 mb-2">
            Destination Wedding Architect
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 leading-relaxed">
            From Jaipur’s walled palace avenues to Lake Pichola’s gleaming pavilions, curate multi-day guest itineraries, room blocks, and airport hospitality.
          </p>
        </div>

        {/* Destination Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {destinations.map((dest) => {
            const isSelected = selectedDestination === dest.city;
            return (
              <div
                key={dest.city}
                onClick={() => setSelectedDestination(dest.city)}
                className={`cursor-pointer rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'border-2 border-gold-400 shadow-royal-lg scale-102 bg-white'
                    : 'border-gold-200 bg-white hover:border-gold-300'
                }`}
              >
                <div>
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={dest.image}
                      alt={dest.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-white/95 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-charcoal-800 border border-gold-200">
                      {dest.city}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-serif text-lg font-bold text-charcoal-900">{dest.title}</h3>
                    <p className="text-[11px] text-charcoal-500 italic mt-0.5 mb-3">{dest.tagline}</p>

                    <div className="space-y-1 text-[11px] text-charcoal-600">
                      <div className="flex justify-between">
                        <span className="text-charcoal-400">Typical Scale:</span>
                        <span className="font-semibold text-charcoal-800">{dest.avgGuests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-charcoal-400">Optimal Weather:</span>
                        <span className="font-semibold text-charcoal-800">{dest.bestSeason}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <span
                    className={`block w-full py-2 rounded-xl text-center text-xs font-semibold uppercase tracking-wider transition-colors ${
                      isSelected
                        ? 'bg-burgundy-700 text-white'
                        : 'bg-ivory-100 text-charcoal-600'
                    }`}
                  >
                    {isSelected ? 'Selected Hub' : 'Select Destination'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Accommodation & Stay Block Planner (Section 6.4) */}
        <div className="bg-white rounded-3xl border border-gold-300 p-8 shadow-royal max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs uppercase tracking-widest font-bold text-burgundy-700 bg-burgundy-50 px-3 py-1 rounded-full border border-burgundy-200">
              Interactive Room Block Engine
            </span>
            <h3 className="font-serif text-2xl font-bold text-charcoal-800 mt-2">
              Plan Destination Stays for {selectedDestination}
            </h3>
            <p className="text-xs text-charcoal-500 mt-1">
              Select check-in/out dates, guest counts, and room blocks to estimate hospitality commitments.
            </p>
          </div>

          <StayPicker
            venueName={`Luxury Palace Suites in ${selectedDestination}`}
            defaultGuests={60}
            defaultRooms={25}
            onConfirm={(details) => {
              setStayBookedMessage(
                `Room block request logged: ${details.rooms} rooms (${details.guests} guests) in ${selectedDestination} from ${details.checkIn} to ${details.checkOut}.`
              );
            }}
          />

          {stayBookedMessage && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{stayBookedMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
