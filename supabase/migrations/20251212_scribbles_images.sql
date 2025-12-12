-- ===========================================
-- SCRIBBLES IMAGES - Storage bucket + policies
-- ===========================================

-- Create bucket (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('scribbles-images', 'scribbles-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage.objects
-- Public can read images
CREATE POLICY "Public can read scribbles images" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'scribbles-images');

-- Admins can upload images
CREATE POLICY "Admins can upload scribbles images" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'scribbles-images'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Admins can update images
CREATE POLICY "Admins can update scribbles images" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'scribbles-images'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    bucket_id = 'scribbles-images'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Admins can delete images
CREATE POLICY "Admins can delete scribbles images" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'scribbles-images'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
