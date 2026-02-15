-- 1. Add media_url column to qt_logs
ALTER TABLE qt_logs ADD COLUMN IF NOT EXISTS media_url TEXT;

-- 2. Create Storage Bucket for image uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('qt_uploads', 'qt_uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Enable Public Access Policies for Storage
-- Allow anyone to upload (Anon)
CREATE POLICY "Public Upload" ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'qt_uploads');

-- Allow anyone to view
CREATE POLICY "Public Select" ON storage.objects 
FOR SELECT 
USING (bucket_id = 'qt_uploads');
