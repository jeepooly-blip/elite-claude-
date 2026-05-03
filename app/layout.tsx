import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EliteAccess - Luxury Racing Concierge | Dubai',
  description: 'Dubai-based luxury concierge for Formula 1, MotoGP, WEC & IndyCar VIP experiences. Exclusive paddock access, hospitality, and racing packages.',
  keywords: ['F1 tickets', 'racing hospitality', 'paddock club', 'luxury racing', 'Dubai concierge', 'Formula 1 VIP'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
