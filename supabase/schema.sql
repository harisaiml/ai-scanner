-- AI Automation Opportunity Scanner - Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  website_url TEXT NOT NULL,
  company_name TEXT,
  industry TEXT,
  location TEXT,
  employees_count TEXT,
  leads_per_month INTEGER,
  current_crm TEXT,
  additional_context TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scan sessions table
CREATE TABLE IF NOT EXISTS scans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  progress INTEGER DEFAULT 0,
  current_step TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Business profiles table
CREATE TABLE IF NOT EXISTS business_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
  company_name TEXT,
  industry TEXT,
  location TEXT,
  services TEXT[],
  target_customers TEXT[],
  lead_channels TEXT[],
  booking_methods TEXT[],
  contact_methods TEXT[],
  website_features JSONB DEFAULT '{}',
  customer_journey JSONB DEFAULT '[]',
  observed_processes JSONB DEFAULT '[]',
  unknowns JSONB DEFAULT '[]',
  raw_research JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT,
  problem TEXT,
  evidence JSONB DEFAULT '[]',
  evidence_type TEXT CHECK (evidence_type IN ('observed', 'inferred', 'unknown')),
  automation_solution TEXT,
  workflow JSONB DEFAULT '[]',
  business_impact INTEGER DEFAULT 0,
  frequency INTEGER DEFAULT 0,
  automation_fit INTEGER DEFAULT 0,
  confidence INTEGER DEFAULT 0,
  priority_score INTEGER DEFAULT 0,
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blueprints table
CREATE TABLE IF NOT EXISTS blueprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE,
  title TEXT,
  trigger_description TEXT,
  workflow_steps JSONB DEFAULT '[]',
  technology_stack TEXT[],
  human_handoffs JSONB DEFAULT '[]',
  failure_handling TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id UUID REFERENCES scans(id) ON DELETE CASCADE UNIQUE,
  content JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scans_company_id ON scans(company_id);
CREATE INDEX IF NOT EXISTS idx_scans_status ON scans(status);
CREATE INDEX IF NOT EXISTS idx_business_profiles_scan_id ON business_profiles(scan_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_scan_id ON opportunities(scan_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_priority ON opportunities(priority_score DESC);
CREATE INDEX IF NOT EXISTS idx_blueprints_scan_id ON blueprints(scan_id);
CREATE INDEX IF NOT EXISTS idx_reports_scan_id ON reports(scan_id);

-- Row Level Security (RLS) - Allow public read/write for now
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow all operations for anon key (MVP - can be tightened later)
CREATE POLICY "Allow all for anon" ON companies FOR ALL TO anon USING (true);
CREATE POLICY "Allow all for anon" ON scans FOR ALL TO anon USING (true);
CREATE POLICY "Allow all for anon" ON business_profiles FOR ALL TO anon USING (true);
CREATE POLICY "Allow all for anon" ON opportunities FOR ALL TO anon USING (true);
CREATE POLICY "Allow all for anon" ON blueprints FOR ALL TO anon USING (true);
CREATE POLICY "Allow all for anon" ON reports FOR ALL TO anon USING (true);
