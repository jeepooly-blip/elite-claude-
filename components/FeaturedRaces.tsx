'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Calendar, MapPin, ChevronRight, AlertCircle } from 'lucide-react';
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

export default function FeaturedRaces({ locale }: { locale: string }) {
  const t = useTranslations('races');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('is_active', true)
          .gte('weekend_start', new Date().toISOString().split('T')[0])
          .order('weekend_start', { ascending: true })
          .limit(6);

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="py-24 px-4 md:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="spinner" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="section-title">{t('title')}</h2>
            <p className="text-white/60 mt-2">Upcoming premium racing experiences</p>
          </div>
          <Link 
            href={`/${locale}/races`}
            className="hidden md:flex items-center gap-2 text-gold hover:text-gold-light transition-colors font-semibold group"
          >
            View All Races
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="card-luxury text-center py-12">
            <AlertCircle className="w-12 h-12 text-gold/40 mx-auto mb-4" />
            <p className="text-white/60">No upcoming races at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <RaceCard key={event.id} event={event} locale={locale} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link href={`/${locale}/races`} className="btn-primary inline-flex items-center gap-2">
            View All Races
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function RaceCard({ event, locale }: { event: Event; locale: string }) {
  const seriesColor = getSeriesColor(event.series);
  
  return (
    <Link href={`/${locale}/races/${event.slug}`} className="group">
      <div className="card-luxury h-full overflow-hidden">
        {/* Image */}
        <div className="relative h-48 -m-6 mb-4 overflow-hidden">
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
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: seriesColor }}
          >
            {event.series}
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="text-xl font-heading text-white mb-2 group-hover:text-gold transition-colors">
            {event.circuit_name}
          </h3>
          
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span>{event.country}</span>
          </div>

          <div className="flex items-center gap-2 text-gold text-sm font-semibold">
            <Calendar className="w-4 h-4" />
            <span>{formatDateRange(event.weekend_start, event.weekend_end, locale)}</span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-white/40 text-xs uppercase tracking-wide">View Packages</span>
            <ChevronRight className="w-5 h-5 text-gold group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
