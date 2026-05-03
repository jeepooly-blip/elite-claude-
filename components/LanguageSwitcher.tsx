'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import { locales } from '@/i18n';

const languageNames: Record<string, { native: string; flag: string }> = {
  en: { native: 'English', flag: '🇬🇧' },
  ar: { native: 'العربية', flag: '🇦🇪' },
  fr: { native: 'Français', flag: '🇫🇷' },
  nl: { native: 'Nederlands', flag: '🇳🇱' },
  de: { native: 'Deutsch', flag: '🇩🇪' },
  da: { native: 'Dansk', flag: '🇩🇰' },
  es: { native: 'Español', flag: '🇪🇸' },
  zh: { native: '中文', flag: '🇨🇳' },
  ru: { native: 'Русский', flag: '🇷🇺' },
  hi: { native: 'हिंदी', flag: '🇮🇳' },
  pt: { native: 'Português', flag: '🇵🇹' },
};

export default function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getLocalizedPath = (locale: string) => {
    if (!pathname) return `/${locale}`;
    const segments = pathname.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gold/10 transition-colors text-white"
        aria-label="Select language"
      >
        <Globe className="w-5 h-5 text-gold" />
        <span className="text-sm font-medium">{languageNames[currentLocale]?.flag}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 glass-effect rounded-lg shadow-xl border border-gold/20 py-2 max-h-96 overflow-y-auto">
          {locales.map((locale) => {
            const lang = languageNames[locale];
            const isActive = locale === currentLocale;

            return (
              <Link
                key={locale}
                href={getLocalizedPath(locale)}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between px-4 py-3 hover:bg-gold/10 transition-colors ${
                  isActive ? 'bg-gold/5' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className={`text-sm font-medium ${isActive ? 'text-gold' : 'text-white'}`}>
                    {lang.native}
                  </span>
                </div>
                {isActive && <Check className="w-4 h-4 text-gold" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
