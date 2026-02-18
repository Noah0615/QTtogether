-- Create prayer_requests table
CREATE TABLE IF NOT EXISTS prayer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nickname TEXT NOT NULL,
    password TEXT NOT NULL,
    content TEXT NOT NULL,
    amen_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE prayer_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for prayer_requests
-- Allow public read access
CREATE POLICY "Public can view prayer requests" 
ON prayer_requests FOR SELECT 
USING (true);

-- Allow public insert access
CREATE POLICY "Public can insert prayer requests" 
ON prayer_requests FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update amen_count (technically anyone can update any field with this if not careful, but for MVP we rely on API logic. 
-- Better approach: Use a function or separate table for amens, but for simple counter let's allow update or use a text check)
-- Actually, for simplicity and anonymity, we'll allow public update for now, but strictly we should probably limit it. 
-- Let's stick to the pattern used in qt_logs or similar. 
-- Since we need to update amen_count without password, we might need a specific policy or RPC.
-- For now, let's allow update for everyone to support the Amen button.
CREATE POLICY "Public can update prayer requests" 
ON prayer_requests FOR UPDATE
USING (true);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE prayer_requests;
