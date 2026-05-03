import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Flag, Calendar, Users, CheckCircle } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import FeaturedRaces from '@/components/FeaturedRaces';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  return (
    <div className="min-h-screen">
      <HeroSection locale={locale} />
      
      <FeaturedRaces locale={locale} />
      
      <HowItWorksSection locale={locale} />
      
      <TrustSection locale={locale} />
    </div>
  );
}

function HowItWorksSection({ locale }: { locale: string }) {
  const t = useTranslations('how_it_works');
  
  const steps = [
    {
      number: '1',
      title: t('step1_title'),
      description: t('step1_desc'),
      icon: Flag,
    },
    {
      number: '2',
      title: t('step2_title'),
      description: t('step2_desc'),
      icon: Calendar,
    },
    {
      number: '3',
      title: t('step3_title'),
      description: t('step3_desc'),
      icon: Users,
    },
    {
      number: '4',
      title: t('step4_title'),
      description: t('step4_desc'),
      icon: CheckCircle,
    },
  ];

  return (
    <section className="py-24 px-4 md:px-8 bg-surface">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title text-center mb-16">
          {t('title')}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="card-luxury text-center">
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center">
                    <Icon className="w-8 h-8 text-gold" />
                  </div>
                </div>
                <h3 className="text-xl font-heading text-gold mb-3">
                  {step.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TrustSection({ locale }: { locale: string }) {
  const t = useTranslations('hero');
  
  return (
    <section className="py-16 px-4 md:px-8 bg-background">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gold/10 border border-gold/30">
          <CheckCircle className="w-5 h-5 text-gold" />
          <span className="text-gold font-semibold">
            {t('trust_badge')}
          </span>
        </div>
        
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-50">
          <div className="text-center">
            <div className="text-3xl font-heading text-gold mb-2">F1</div>
            <div className="text-sm text-white/60">Formula 1</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading text-gold mb-2">MotoGP</div>
            <div className="text-sm text-white/60">Motorcycle Racing</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading text-gold mb-2">WEC</div>
            <div className="text-sm text-white/60">Endurance Racing</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-heading text-gold mb-2">IndyCar</div>
            <div className="text-sm text-white/60">American Racing</div>
          </div>
        </div>
      </div>
    </section>
  );
}
