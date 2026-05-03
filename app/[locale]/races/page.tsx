'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Calendar, MapPin, Filter, Search, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatDateRange, getSeriesColor } from '@/lib/utils';

type Event = {
  id: string;
  series: string;
  circuit_name: string;
  country: string;
  weekend_start: string;
  weekend_end: string;
  slug: string;
  image_url?: string;
};

export default function RacesPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('races');
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeries, setSelectedSeries] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const series = ['all', 'F1', 'MotoGP', 'WEC', 'IndyCar'];

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('is_active', true)
          .gte('weekend_start', new Date().toISOString().split('T')[0])
          .order('weekend_start', { ascending: true });

        if (error) throw error;
        setEvents(data || []);
        setFilteredEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = events;

    // Filter by series
    if (selectedSeries !== 'all') {
      filtered = filtered.filter((event) => event.series === selectedSeries);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (event) =>
          event.circuit_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [selectedSeries, searchQuery, events]);

  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="section-title mb-4">{t('title')}</h1>
          <p className="text-white/60 text-lg">
            Browse exclusive racing packages for Formula 1, MotoGP, WEC, and IndyCar
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search by circuit or country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-luxury w-full pl-12"
            />
          </div>

          {/* Series Filter */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 text-white/60">
              <Filter className="w-5 h-5" />
              <span className="text-sm font-semibold">{t('filter_all')}</span>
            </div>
            {series.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSeries(s)}
                className={`px-4 py-2 rounded-md font-semibold text-sm transition-all ${
                  selectedSeries === s
                    ? 'bg-gold text-background'
                    : 'bg-surface border border-gold/20 text-white hover:border-gold/40'
                }`}
              >
                {s === 'all' ? 'All Series' : s}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="spinner" />
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="card-luxury text-center py-16">
            <AlertCircle className="w-16 h-16 text-gold/40 mx-auto mb-4" />
            <h3 className="text-xl font-heading text-white mb-2">{t('no_results')}</h3>
            <p className="text-white/60">Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event, locale }: { event: Event; locale: string }) {
  const t = useTranslations('races');
  const seriesColor = getSeriesColor(event.series);

  return (
    <Link href={`/${locale}/races/${event.slug}`} className="group">
      <div className="card-luxury h-full overflow-hidden">
        {/* Image */}
        <div className="relative h-56 -m-6 mb-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-br from-surface-dark to-surface-light group-hover:scale-110 transition-transform duration-500"
            style={{
              backgroundImage: event.image_url ? `url(${event.image_url})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Series Badge */}
          <div
            className="absolute top-4 left-4 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg"
            style={{ backgroundColor: seriesColor }}
          >
            {event.series}
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-2xl font-heading text-white mb-3 group-hover:text-gold transition-colors">
            {event.circuit_name}
          </h3>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{event.country}</span>
            </div>

            <div className="flex items-center gap-2 text-gold text-sm font-semibold">
              <Calendar className="w-4 h-4" />
              <span>{formatDateRange(event.weekend_start, event.weekend_end, locale)}</span>
            </div>
          </div>

          <div className="btn-secondary w-full text-center group-hover:bg-gold group-hover:text-background transition-all">
            {t('view_details')}
          </div>
        </div>
      </div>
    </Link>
  );
}
