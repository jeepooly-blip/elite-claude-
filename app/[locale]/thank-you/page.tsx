import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { CheckCircle, Home, Calendar } from 'lucide-react';

export default function ThankYouPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('thank_you');

  const nextSteps = [
    { text: t('step1') },
    { text: t('step2') },
    { text: t('step3') },
    { text: t('step4') },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-4 md:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="w-20 h-20 rounded-full bg-gold/10 border-2 border-gold flex items-center justify-center mx-auto mb-8">
          <CheckCircle className="w-12 h-12 text-gold" />
        </div>

        <h1 className="text-5xl font-heading text-white mb-4">{t('title')}</h1>
        <p className="text-xl text-white/80 mb-12">{t('message')}</p>

        <div className="card-luxury text-left mb-12">
          <h2 className="text-2xl font-heading text-gold mb-6">{t('next_steps_title')}</h2>
          <div className="space-y-4">
            {nextSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-gold font-bold text-sm">{idx + 1}</span>
                </div>
                <p className="text-white/80 pt-1">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/${locale}`} className="btn-secondary inline-flex items-center justify-center gap-2">
            <Home className="w-5 h-5" />
            {t('return_home')}
          </Link>
          <Link href={`/${locale}/races`} className="btn-primary inline-flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" />
            {t('browse_more')}
          </Link>
        </div>
      </div>
    </div>
  );
}
