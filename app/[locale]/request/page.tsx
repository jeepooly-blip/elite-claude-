'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function RequestPage({ params: { locale } }: { params: { locale: string } }) {
  const t = useTranslations('lead_form');
  const tCommon = useTranslations('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    event_id: searchParams.get('event') || '',
    package_id: searchParams.get('package') || '',
    full_name: '',
    email: '',
    whatsapp: '',
    group_size: '',
    budget_range: '',
    preferred_team: '',
    needs_hotel: false,
    needs_flights: false,
    corporate_gift: false,
    message: '',
    consent: false,
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = t('required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('invalid_email');
    }

    if (!formData.consent) {
      newErrors.consent = t('required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          group_size: formData.group_size ? parseInt(formData.group_size) : null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }

      router.push(`/${locale}/thank-you`);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/${locale}/races`}
          className="inline-flex items-center gap-2 text-gold hover:text-gold-light mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Races
        </Link>

        <div className="card-luxury">
          <div className="mb-8">
            <h1 className="text-4xl font-heading text-white mb-3">{t('title')}</h1>
            <p className="text-white/60">{t('subtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="full_name" className="block text-white font-semibold mb-2">
                {t('full_name')} <span className="text-race-red">*</span>
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder={t('full_name_placeholder')}
                className={`input-luxury w-full ${errors.full_name ? 'border-race-red' : ''}`}
              />
              {errors.full_name && <p className="text-race-red text-sm mt-1">{errors.full_name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-white font-semibold mb-2">
                {t('email')} <span className="text-race-red">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('email_placeholder')}
                className={`input-luxury w-full ${errors.email ? 'border-race-red' : ''}`}
              />
              {errors.email && <p className="text-race-red text-sm mt-1">{errors.email}</p>}
            </div>

            {/* WhatsApp */}
            <div>
              <label htmlFor="whatsapp" className="block text-white font-semibold mb-2">
                {t('whatsapp')}
              </label>
              <input
                type="tel"
                id="whatsapp"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleChange}
                placeholder={t('whatsapp_placeholder')}
                className="input-luxury w-full"
              />
            </div>

            {/* Group Size & Budget */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="group_size" className="block text-white font-semibold mb-2">
                  {t('group_size')}
                </label>
                <input
                  type="number"
                  id="group_size"
                  name="group_size"
                  value={formData.group_size}
                  onChange={handleChange}
                  placeholder={t('group_size_placeholder')}
                  min="1"
                  className="input-luxury w-full"
                />
              </div>

              <div>
                <label htmlFor="budget_range" className="block text-white font-semibold mb-2">
                  {t('budget')}
                </label>
                <select
                  id="budget_range"
                  name="budget_range"
                  value={formData.budget_range}
                  onChange={handleChange}
                  className="input-luxury w-full"
                >
                  <option value="">Select budget range</option>
                  <option value="$3k-$5k">{t('budget_3k_5k')}</option>
                  <option value="$5k-$10k">{t('budget_5k_10k')}</option>
                  <option value="$10k-$20k">{t('budget_10k_20k')}</option>
                  <option value="$20k+">{t('budget_20k_plus')}</option>
                </select>
              </div>
            </div>

            {/* Preferred Team */}
            <div>
              <label htmlFor="preferred_team" className="block text-white font-semibold mb-2">
                {t('preferred_team')}
              </label>
              <input
                type="text"
                id="preferred_team"
                name="preferred_team"
                value={formData.preferred_team}
                onChange={handleChange}
                placeholder={t('preferred_team_placeholder')}
                className="input-luxury w-full"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="needs_hotel"
                  checked={formData.needs_hotel}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 rounded border-gold/20 bg-surface text-gold focus:ring-gold focus:ring-offset-background"
                />
                <span className="text-white/80 group-hover:text-white transition-colors">
                  {t('needs_hotel')}
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="needs_flights"
                  checked={formData.needs_flights}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 rounded border-gold/20 bg-surface text-gold focus:ring-gold focus:ring-offset-background"
                />
                <span className="text-white/80 group-hover:text-white transition-colors">
                  {t('needs_flights')}
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="corporate_gift"
                  checked={formData.corporate_gift}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 rounded border-gold/20 bg-surface text-gold focus:ring-gold focus:ring-offset-background"
                />
                <span className="text-white/80 group-hover:text-white transition-colors">
                  {t('corporate_gift')}
                </span>
              </label>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-white font-semibold mb-2">
                {t('message')}
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder={t('message_placeholder')}
                rows={4}
                className="input-luxury w-full resize-none"
              />
            </div>

            {/* Consent */}
            <div>
              <label className={`flex items-start gap-3 cursor-pointer ${errors.consent ? 'text-race-red' : ''}`}>
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 rounded border-gold/20 bg-surface text-gold focus:ring-gold focus:ring-offset-background"
                />
                <span className="text-sm">
                  {t('consent')} <span className="text-race-red">*</span>
                </span>
              </label>
              {errors.consent && <p className="text-race-red text-sm mt-1">{errors.consent}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('submitting')}
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  {t('submit')}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
