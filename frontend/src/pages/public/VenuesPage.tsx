import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Venue } from '../../types';
import { RoyalLoader } from '../../components/ui/RoyalLoader';
import { SlotPicker } from '../../components/ui/SlotPicker';
import {
  MapPin,
  Users,
  Search,
  SlidersHorizontal,
  Calendar,
  Building,
  CheckCircle,
  ExternalLink,
  X,
  Phone,
  Mail,
  Sparkles,
  Hotel
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { StayPicker } from '../../components/ui/StayPicker';

// Fix Leaflet default marker icon in bundlers
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const VenuesPage: React.FC = () => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVenueForSlot, setSelectedVenueForSlot] = useState<Venue | null>(null);
  const [selectedVenueForRoomBlock, setSelectedVenueForRoomBlock] = useState<Venue | null>(null);

  useEffect(() => {
    async function fetchVenues() {
      setIsLoading(true);
      try {
        const data = await api.getVenues({
          category: categoryFilter !== 'All' ? categoryFilter : undefined,
          city: cityFilter !== 'All' ? cityFilter : undefined,
        });
        setVenues(data);
      } catch (err) {
        console.error('Error fetching venues:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVenues();
  }, [categoryFilter, cityFilter]);

  const filteredVenues = venues.filter(v =>
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-ivory min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase tracking-widest font-bold text-gold-700 bg-gold-100/80 px-3 py-1 rounded-full border border-gold-300">
            Royal Palaces & Estates
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 mt-3 mb-2">
            Curated Heritage Wedding Venues
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 leading-relaxed">
            Discover majestic courtyards, Mughal gardens, and imperial banqueting halls across Rajasthan. All listings are clearly labelled and verified for royal celebrations.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl border border-gold-300 p-4 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by palace name, garden, or architectural style..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gold-200 bg-ivory-50 text-charcoal-800 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-gold-200 bg-ivory-50 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              <option value="All">All Cities</option>
              <option value="Jaipur">Jaipur</option>
              <option value="Udaipur">Udaipur</option>
              <option value="Jodhpur">Jodhpur</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl border border-gold-200 bg-ivory-50 text-charcoal-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
            >
              <option value="All">All Categories</option>
              <option value="Palaces">Palaces</option>
              <option value="Heritage properties">Heritage properties</option>
              <option value="Resorts">Luxury Resorts</option>
            </select>
          </div>
        </div>

        {/* Interactive Leaflet Map (Section 9) */}
        <div className="bg-white rounded-2xl border border-gold-300 overflow-hidden shadow-royal mb-10">
          <div className="px-6 py-3 bg-ivory-100 border-b border-gold-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold-600" />
              <span className="font-semibold text-charcoal-800">Geographic Palace Map (OpenStreetMap)</span>
            </div>
            <span className="text-[11px] text-charcoal-500">
              Data &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline hover:text-gold-700">OpenStreetMap contributors</a>
            </span>
          </div>

          <div className="h-72 w-full z-0">
            <MapContainer
              center={[26.9124, 75.7873]}
              zoom={7}
              scrollWheelZoom={false}
              className="h-full w-full z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredVenues.map((v) => (
                <Marker key={v.id} position={[v.lat, v.lng]} icon={customIcon}>
                  <Popup>
                    <div className="text-xs p-1">
                      <strong className="block font-serif text-sm text-charcoal-800">{v.name}</strong>
                      <span className="text-charcoal-600 block">{v.city}, {v.state}</span>
                      <span className="text-burgundy-700 font-bold block mt-1">Cap: {v.capacity_min} - {v.capacity_max} Guests</span>
                      <button
                        onClick={() => setSelectedVenueForSlot(v)}
                        className="mt-2 text-[10px] text-white bg-burgundy-700 px-2 py-1 rounded block w-full text-center"
                      >
                        Book Walkthrough
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Venue Cards Grid */}
        {isLoading ? (
          <div className="py-20">
            <RoyalLoader message="Fetching verified royal palaces and heritage grounds..." />
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gold-200 p-8">
            <p className="font-serif text-lg text-charcoal-700">No palace venues found matching your criteria.</p>
            <button
              onClick={() => { setCategoryFilter('All'); setCityFilter('All'); setSearchQuery(''); }}
              className="mt-3 text-xs text-burgundy-700 underline font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredVenues.map((venue) => (
              <div
                key={venue.id}
                className="bg-white rounded-3xl border border-gold-300/80 overflow-hidden shadow-royal hover:shadow-royal-lg transition-all group flex flex-col"
              >
                {/* Image */}
                <div className="relative h-60 overflow-hidden bg-ivory-200">
                  <img
                    src={venue.images_json[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                    alt={venue.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 text-charcoal-800 shadow-sm border border-gold-200">
                      {venue.category}
                    </span>
                    {venue.is_sample && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-100 text-gold-900 border border-gold-300">
                        Sample Listing
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-serif text-2xl font-bold text-charcoal-900 group-hover:text-burgundy-800 transition-colors">
                        {venue.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </div>
                    </div>

                    <p className="text-xs text-charcoal-500 flex items-center gap-1.5 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                      <span>{venue.address}</span>
                    </p>

                    <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed mb-4">
                      {venue.description}
                    </p>

                    {/* Facilities Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {venue.facilities_json.slice(0, 4).map((f, i) => (
                        <span key={i} className="text-[11px] px-2.5 py-0.5 rounded-md bg-ivory-100 text-charcoal-600 border border-gold-200">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gold-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-charcoal-400 block">Capacity Range</span>
                      <span className="text-xs font-bold text-charcoal-800 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-gold-600" />
                        {venue.capacity_min} – {venue.capacity_max} Guests
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedVenueForRoomBlock(venue)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-ivory-100 hover:bg-gold-100 text-charcoal-800 text-xs font-semibold uppercase tracking-wider border border-gold-300 transition-colors shadow-sm"
                      >
                        <Hotel className="w-3.5 h-3.5 text-gold-600" />
                        <span>Room Block</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedVenueForSlot(venue)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-burgundy-700 hover:bg-burgundy-800 text-white text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5 text-gold-300" />
                        <span>Walkthrough</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Slot Picker Modal for Walkthrough */}
        {selectedVenueForSlot && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-xl">
              <button
                onClick={() => setSelectedVenueForSlot(null)}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white text-charcoal-400 hover:text-charcoal-700 border border-gold-200 shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
              <SlotPicker
                entityName={selectedVenueForSlot.name}
                onSlotSelected={() => {
                  setTimeout(() => setSelectedVenueForSlot(null), 2500);
                }}
              />
            </div>
          </div>
        )}

        {/* StayPicker Room Block Modal */}
        {selectedVenueForRoomBlock && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-xl">
              <button
                onClick={() => setSelectedVenueForRoomBlock(null)}
                className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white text-charcoal-400 hover:text-charcoal-700 border border-gold-200 shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
              <StayPicker
                venueName={selectedVenueForRoomBlock.name}
                defaultRooms={30}
                defaultGuests={75}
                onConfirm={() => {
                  setTimeout(() => setSelectedVenueForRoomBlock(null), 2000);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
