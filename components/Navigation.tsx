'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Menu, X, Globe } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('nav');

  const navLinks = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/races`, label: t('races') },
    { href: `/${locale}#how-it-works`, label: t('how_it_works') },
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center group-hover:bg-gold/20 transition-all">
              <span className="text-2xl font-heading text-gold">EA</span>
            </div>
            <div>
              <div className="text-xl font-heading text-white">EliteAccess</div>
              <div className="text-xs text-gold/70">Racing Concierge</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-gold transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            <LanguageSwitcher currentLocale={locale} />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <LanguageSwitcher currentLocale={locale} />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 hover:text-gold transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-6 border-t border-gold/10">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-gold transition-colors font-medium py-2"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
