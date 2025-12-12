-- ===========================================
-- SCRIBBLES - Blog posts (admin authored)
-- ===========================================

CREATE TABLE IF NOT EXISTS scribbles_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  published_at DATE NOT NULL DEFAULT CURRENT_DATE,
  is_published BOOLEAN NOT NULL DEFAULT true,
  pinned BOOLEAN NOT NULL DEFAULT false,
  pinned_at TIMESTAMPTZ,
  pinned_order INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_scribbles_posts_published_at ON scribbles_posts(published_at);
CREATE INDEX IF NOT EXISTS idx_scribbles_posts_pinned ON scribbles_posts(pinned);

ALTER TABLE scribbles_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published scribbles" ON scribbles_posts
  FOR SELECT USING (
    is_published = true
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can insert scribbles" ON scribbles_posts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update scribbles" ON scribbles_posts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete scribbles" ON scribbles_posts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

INSERT INTO scribbles_posts (slug, title, excerpt, content, published_at, is_published, pinned)
VALUES
  (
    'why-grug-make-scribbles',
    'Why Grug Make Scribbles',
    'Man ask Grug many question. Grug write answer on cave wall so man no forget.',
    'Once upon time, man ask Grug same thing every sun. Grug get tired. Grug decide: Grug scribble on cave wall.\n\nScribbles is where Grug put thoughts, gift tricks, and warning for man. Simple. Short. Like club.\n\nIf man read Scribbles, man have better chance not mess up special sun. Grug proud.',
    '2025-12-12',
    true,
    false
  ),
  (
    'three-gift-rules-grug-never-break',
    'Three Gift Rules Grug Never Break',
    'Grug have rules. Rules keep man safe from womanfolk disappointment face.',
    'Rule one: listen to womanfolk. If she say “I like this”, Grug believe her. If she say “no want”, Grug also believe her.\n\nRule two: do not wait for last sun. Shipping slow. Panic big. Man cry.\n\nRule three: if unsure, pick something she use every sun. Cozy, smell good, shiny rock. Simple.',
    '2025-12-10',
    true,
    false
  )
ON CONFLICT (slug) DO NOTHING;
