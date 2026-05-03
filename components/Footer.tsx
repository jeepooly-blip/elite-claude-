import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer({ locale }: { locale: string }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center">
                <span className="text-lg font-heading text-gold">EA</span>
              </div>
              <div>
                <div className="font-heading text-white">EliteAccess</div>
                <div className="text-xs text-gold/70">Racing Concierge</div>
              </div>
            </div>
            <p className="text-white/60 text-sm">
              Dubai-based luxury concierge for world-class racing experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/races`} className="text-white/60 hover:text-gold transition-colors text-sm">
                  Browse Races
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about`} className="text-white/60 hover:text-gold transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="text-white/60 hover:text-gold transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Racing Series */}
          <div>
            <h3 className="text-gold font-semibold mb-4">Racing Series</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Formula 1</li>
              <li>MotoGP</li>
              <li>WEC</li>
              <li>IndyCar</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gold font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <span>Dubai, United Arab Emirates</span>
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="mailto:concierge@eliteaccess.ae" className="hover:text-gold transition-colors">
                  concierge@eliteaccess.ae
                </a>
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span>+971 (Available 24/7)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm">
            © {currentYear} EliteAccess. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href={`/${locale}/privacy`} className="text-white/40 hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link href={`/${locale}/terms`} className="text-white/40 hover:text-gold transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
