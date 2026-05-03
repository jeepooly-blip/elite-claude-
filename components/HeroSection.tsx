'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ChevronRight, Play } from 'lucide-react';

export default function HeroSection({ locale }: { locale: string }) {
  const t = useTranslations('hero');

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background z-10" />
        <div className="absolute inset-0 bg-black/40 z-10" />
        {/* Placeholder for video - in production, use actual onboard lap video */}
        <div className="w-full h-full bg-gradient-to-br from-surface-dark via-surface to-surface-light">
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="w-24 h-24 text-gold/20" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 md:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-8 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="text-gold text-sm font-semibold">
            {t('trust_badge')}
          </span>
        </div>

        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-tight animate-slide-up">
          <span className="text-gradient-gold">Exclusive Access</span>
          <br />
          <span>to the World's</span>
          <br />
          <span>Greatest Races</span>
        </h1>

        <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto animate-fade-in">
          {t('subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Link href={`/${locale}/races`} className="btn-primary inline-flex items-center justify-center gap-2 group">
            {t('cta')}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <Link href={`/${locale}#how-it-works`} className="btn-secondary inline-flex items-center justify-center">
            How It Works
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-heading text-gold mb-2">100+</div>
            <div className="text-sm text-white/60">Races per Year</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-heading text-gold mb-2">24/7</div>
            <div className="text-sm text-white/60">Concierge Service</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-heading text-gold mb-2">VIP</div>
            <div className="text-sm text-white/60">Exclusive Access</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-gold/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-gold rounded-full" />
        </div>
      </div>
    </section>
  );
}
