# EliteAccess Racing Concierge Platform

A luxury, Dubai-based concierge platform for Formula 1, MotoGP, WEC, and IndyCar VIP experiences. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🏎️ Project Overview

EliteAccess is **not a standard ticket marketplace**. It's a high-end concierge service for premium racing hospitality:

- **No Shopping Cart** - Every request goes to a human concierge
- **Dubai-Based** - 24/7 multilingual concierge team
- **Exclusive Access** - Paddock clubs, pit lane walks, driver meet-and-greets
- **High-Ticket** - Optimized for $3k-$50k+ transactions

### Target Audience
- Wealthy motorsport enthusiasts
- Corporate gifters
- Global customers (11 languages supported)

## 🚀 Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14 (App Router) | SSR, SEO, dynamic routing |
| Styling | Tailwind CSS | Luxury racing design system |
| Backend | Next.js API Routes | Lead submission, data management |
| Database | Supabase (PostgreSQL) | Real-time data, auth, storage |
| i18n | next-intl | 11 languages |
| Hosting | Vercel | Global CDN with Dubai POP |

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Database Setup
Run `supabase-schema.sql` in Supabase SQL Editor

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🌍 Supported Languages

🇬🇧 English • 🇦🇪 Arabic (RTL) • 🇫🇷 French • 🇳🇱 Dutch • 🇩🇪 German  
🇩🇰 Danish • 🇪🇸 Spanish • 🇨🇳 Chinese • 🇷🇺 Russian • 🇮🇳 Hindi • 🇵🇹 Portuguese

## 📊 Key Features

- **Homepage**: Hero video, featured races, how it works
- **Races Calendar**: Filter by series, circuit, date
- **Race Details**: Circuit info, packages, availability
- **Concierge Form**: Multi-step lead capture
- **Admin Dashboard**: Lead management, inventory tracking
- **Real-time Updates**: Live availability via Supabase

## 🚢 Deployment

Deploy to Vercel:
```bash
vercel --prod
```


## 📄 License

Proprietary - EliteAccess © 2026
