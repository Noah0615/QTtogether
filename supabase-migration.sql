-- Run this SQL in your Supabase Dashboard > SQL Editor
-- This creates the qt_logs table for the QT Note application

CREATE TABLE IF NOT EXISTS qt_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT NOT NULL,
  password TEXT NOT NULL,
  content TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  bible_verse TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE qt_logs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access (authentication is handled at API level with bcrypt)
CREATE POLICY "Allow all operations for anon" ON qt_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create index for faster sorting by created_at
CREATE INDEX idx_qt_logs_created_at ON qt_logs (created_at DESC);
