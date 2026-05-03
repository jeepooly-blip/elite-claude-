-- EliteAccess Racing Concierge Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Events (Races) Table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  series TEXT NOT NULL CHECK (series IN ('F1', 'MotoGP', 'WEC', 'IndyCar')),
  circuit_name TEXT NOT NULL,
  country TEXT NOT NULL,
  weekend_start DATE NOT NULL,
  weekend_end DATE NOT NULL,
  session_types TEXT[] DEFAULT ARRAY['FP1','FP2','Quali','Race'],
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for active events
CREATE INDEX IF NOT EXISTS idx_events_active_date ON events(is_active, weekend_start);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);
CREATE INDEX IF NOT EXISTS idx_events_series ON events(series);

-- Packages (Hospitality Tiers) Table
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price_min_cents INTEGER,
  price_max_cents INTEGER,
  includes TEXT[] DEFAULT ARRAY[]::TEXT[],
  access_level TEXT CHECK (access_level IN ('standard', 'premium', 'ultimate')),
  allocation_total INTEGER,
  allocation_remaining INTEGER,
  is_hidden BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for package queries
CREATE INDEX IF NOT EXISTS idx_packages_event ON packages(event_id);
CREATE INDEX IF NOT EXISTS idx_packages_visible ON packages(is_hidden);

-- Leads (Concierge Requests) Table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  group_size INTEGER,
  budget_range TEXT,
  preferred_team TEXT,
  needs_hotel BOOLEAN DEFAULT false,
  needs_flights BOOLEAN DEFAULT false,
  corporate_gift BOOLEAN DEFAULT false,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'lost')),
  assigned_to UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for lead management
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);

-- Racing Inventory (Real-time Availability) Table
CREATE TABLE IF NOT EXISTS racing_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  available_spots INTEGER NOT NULL,
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- Create index for inventory queries
CREATE INDEX IF NOT EXISTS idx_inventory_package ON racing_inventory(package_id);
CREATE INDEX IF NOT EXISTS idx_inventory_event ON racing_inventory(event_id);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'concierge' CHECK (role IN ('concierge', 'ops', 'super_admin')),
  full_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for admin lookups
CREATE INDEX IF NOT EXISTS idx_admin_email ON admin_users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE racing_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public read access for events and packages
CREATE POLICY "Public can view active events" ON events
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view visible packages" ON packages
  FOR SELECT USING (is_hidden = false);

-- Public insert for leads (anyone can submit)
CREATE POLICY "Anyone can create leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Admin full access (authenticated users with admin role)
CREATE POLICY "Admins have full access to leads" ON leads
  FOR ALL USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM admin_users
    )
  );

CREATE POLICY "Admins have full access to events" ON events
  FOR ALL USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM admin_users WHERE role IN ('ops', 'super_admin')
    )
  );

CREATE POLICY "Admins have full access to packages" ON packages
  FOR ALL USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM admin_users WHERE role IN ('ops', 'super_admin')
    )
  );

-- Public read access for inventory
CREATE POLICY "Public can view inventory" ON racing_inventory
  FOR SELECT USING (true);

CREATE POLICY "Admins can modify inventory" ON racing_inventory
  FOR ALL USING (
    auth.jwt() ->> 'email' IN (
      SELECT email FROM admin_users WHERE role IN ('ops', 'super_admin')
    )
  );

-- Functions and Triggers

-- Update updated_at timestamp on leads
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample Data (for development)
-- Formula 1 Events
INSERT INTO events (series, circuit_name, country, weekend_start, weekend_end, slug, session_types) VALUES
  ('F1', 'Monaco Grand Prix', 'Monaco', '2026-05-21', '2026-05-24', 'monaco-gp-2026', ARRAY['FP1','FP2','FP3','Quali','Race']),
  ('F1', 'Silverstone Circuit', 'United Kingdom', '2026-07-02', '2026-07-05', 'silverstone-gp-2026', ARRAY['FP1','FP2','FP3','Quali','Race']),
  ('F1', 'Yas Marina Circuit', 'United Arab Emirates', '2026-11-26', '2026-11-29', 'abu-dhabi-gp-2026', ARRAY['FP1','FP2','FP3','Quali','Race'])
ON CONFLICT (slug) DO NOTHING;

-- MotoGP Events
INSERT INTO events (series, circuit_name, country, weekend_start, weekend_end, slug, session_types) VALUES
  ('MotoGP', 'Circuit of the Americas', 'United States', '2026-04-10', '2026-04-12', 'cota-motogp-2026', ARRAY['FP1','FP2','Quali','Race']),
  ('MotoGP', 'Mugello Circuit', 'Italy', '2026-05-29', '2026-05-31', 'mugello-motogp-2026', ARRAY['FP1','FP2','Quali','Race'])
ON CONFLICT (slug) DO NOTHING;

-- Sample Packages for Monaco GP
DO $$
DECLARE
  monaco_id UUID;
BEGIN
  SELECT id INTO monaco_id FROM events WHERE slug = 'monaco-gp-2026' LIMIT 1;
  
  IF monaco_id IS NOT NULL THEN
    INSERT INTO packages (event_id, name, price_min_cents, price_max_cents, includes, access_level, allocation_total, allocation_remaining) VALUES
      (monaco_id, 'Paddock Club', 1200000, 1500000, 
       ARRAY['Paddock access', 'Pit lane walk', 'Gourmet dining', 'Open bar', 'F1 insider Q&A', 'Commemorative gift'],
       'ultimate', 50, 12),
      (monaco_id, 'Champions Club', 500000, 800000,
       ARRAY['Premium grandstand seats', 'Hospitality lounge', 'Welcome champagne', 'Team radio access'],
       'premium', 100, 35),
      (monaco_id, 'Grid Walk Experience', 300000, 350000,
       ARRAY['Pre-race grid walk', 'Grandstand seats', 'Light refreshments'],
       'standard', 200, 78)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

-- Create a sample admin user (replace with your email)
INSERT INTO admin_users (email, role, full_name) VALUES
  ('admin@eliteaccess.ae', 'super_admin', 'Admin User')
ON CONFLICT (email) DO NOTHING;

COMMENT ON TABLE events IS 'Racing events (F1, MotoGP, WEC, IndyCar)';
COMMENT ON TABLE packages IS 'Hospitality packages for each event';
COMMENT ON TABLE leads IS 'Customer concierge requests';
COMMENT ON TABLE racing_inventory IS 'Real-time availability tracking';
COMMENT ON TABLE admin_users IS 'Dubai-based concierge team members';
