-- Run this in your Supabase SQL editor to create the analyses table

CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation TEXT NOT NULL,
  free_analysis JSONB,
  full_analysis JSONB,
  paid BOOLEAN DEFAULT FALSE,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Optional: Index for faster lookups
CREATE INDEX idx_analyses_paid ON analyses(paid);
CREATE INDEX idx_analyses_stripe_session ON analyses(stripe_session_id);
