'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Calendar, MapPin, Clock, Check, ChevronRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDateRange, getSeriesColor } from '@/lib/utils';

type Event = {
  id: string;
  series: string;
  circuit_name: string;
  country: string;
  weekend_start: string;
  weekend_end: string;
  session_types: string[];
  image_url?: string;
};

type Package = {
  id: string;
  name: string;
  price_min_cents: number | null;
  price_max_cents: number | null;
  includes: string[];
  access_level: string | null;
  allocation_remaining: number | null;
};

export default function RaceDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  const t = useTranslations('race_detail');
  const [event, setEvent] = useState<Event | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch event
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('slug', slug)
          .single();

        if (eventError) throw eventError;
        setEvent(eventData);

        // Fetch packages
        const { data: packagesData, error: packagesError } = await supabase
          .from('packages')
          .select('*')
          .eq('event_id', eventData.id)
          .eq('is_hidden', false)
          .order('price_min_cents', { ascending: true });

        if (packagesError) throw packagesError;
        setPackages(packagesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card-luxury text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-gold/40 mx-auto mb-4" />
          <h2 className="text-2xl font-heading text-white mb-2">Race Not Found</h2>
          <p className="text-white/60 mb-6">The race you're looking for doesn't exist or has been removed.</p>
          <Link href={`/${locale}/races`} className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Back to Races
          </Link>
        </div>
      </div>
    );
  }

  const seriesColor = getSeriesColor(event.series);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-surface-dark to-surface-light"
          style={{
            backgroundImage: event.image_url ? `url(${event.image_url})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pb-12 w-full">
          <Link
            href={`/${locale}/races`}
            className="inline-flex items-center gap-2 text-gold hover:text-gold-light mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Races
          </Link>

          <div
            className="inline-block px-4 py-2 rounded-full text-sm font-bold text-white mb-4"
            style={{ backgroundColor: seriesColor }}
          >
            {event.series}
          </div>

          <h1 className="font-heading text-5xl md:text-7xl text-white mb-4">
            {event.circuit_name}
          </h1>

          <div className="flex flex-wrap gap-6 text-white/80">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gold" />
              <span className="font-semibold">{event.country}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gold" />
              <span className="font-semibold">
                {formatDateRange(event.weekend_start, event.weekend_end, locale)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Weekend Schedule */}
      <section className="py-12 px-4 md:px-8 bg-surface border-b border-gold/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-heading text-white mb-6">{t('weekend_schedule')}</h2>
          <div className="flex flex-wrap gap-3">
            {event.session_types.map((session, idx) => (
              <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-background rounded-md border border-gold/20">
                <Clock className="w-4 h-4 text-gold" />
                <span className="text-white font-medium text-sm">{session}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="section-title mb-12">{t('available_packages')}</h2>

          {packages.length === 0 ? (
            <div className="card-luxury text-center py-16">
              <AlertCircle className="w-16 h-16 text-gold/40 mx-auto mb-4" />
              <h3 className="text-xl font-heading text-white mb-2">No Packages Available</h3>
              <p className="text-white/60">Packages for this race are coming soon. Check back later!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} package={pkg} eventId={event.id} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function PackageCard({
  package: pkg,
  eventId,
  locale,
}: {
  package: Package;
  eventId: string;
  locale: string;
}) {
  const t = useTranslations('race_detail');
  const tCommon = useTranslations('races');

  const isLowInventory = pkg.allocation_remaining !== null && pkg.allocation_remaining <= 5;
  const isSoldOut = pkg.allocation_remaining === 0;

  const priceDisplay = pkg.price_min_cents
    ? pkg.price_max_cents && pkg.price_max_cents !== pkg.price_min_cents
      ? `${formatCurrency(pkg.price_min_cents)} - ${formatCurrency(pkg.price_max_cents)}`
      : `${t('from')} ${formatCurrency(pkg.price_min_cents)}`
    : 'Contact for pricing';

  return (
    <div className="card-luxury h-full flex flex-col">
      <div className="flex-1">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-2xl font-heading text-white">{pkg.name}</h3>
          {isLowInventory && !isSoldOut && (
            <span className="badge-urgent">{tCommon('spots_left', { count: pkg.allocation_remaining })}</span>
          )}
          {isSoldOut && <span className="badge-urgent bg-red-500/10 text-red-500">{tCommon('sold_out')}</span>}
        </div>

        <div className="text-3xl font-heading text-gold mb-6">
          {priceDisplay}
          {pkg.price_min_cents && (
            <span className="text-sm text-white/60 font-sans ml-2">{t('per_person')}</span>
          )}
        </div>

        <div className="space-y-3 mb-6">
          <h4 className="text-sm font-semibold text-white/80 uppercase tracking-wide">{t('includes')}</h4>
          {pkg.includes.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
              <span className="text-white/80 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <Link
        href={`/${locale}/request?event=${eventId}&package=${pkg.id}`}
        className={`btn-primary w-full text-center ${isSoldOut ? 'opacity-50 pointer-events-none' : ''}`}
      >
        {isSoldOut ? tCommon('sold_out') : t('request_access')}
        {!isSoldOut && <ChevronRight className="w-5 h-5 inline ml-2" />}
      </Link>
    </div>
  );
}
