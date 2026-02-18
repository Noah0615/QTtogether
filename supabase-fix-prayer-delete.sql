-- Allow public delete access for prayer_requests
-- (Authentication is handled by the API checking the password)
CREATE POLICY "Public can delete prayer requests"
ON prayer_requests FOR DELETE
USING (true);
