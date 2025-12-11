-- ===========================================
-- WISHLISTS (Cave Paintings) - Shareable gift lists
-- ===========================================

-- Wishlists table - "Cave Paintings"
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Cave Painting',
  recipient_name TEXT, -- "Sarah", "Mum", etc.
  share_token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(12), 'base64url'),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Wishlist items - products saved to a wishlist with voting
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  vote TEXT CHECK (vote IN ('up', 'down')), -- null = no vote yet
  voted_at TIMESTAMPTZ,
  UNIQUE(wishlist_id, product_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_wishlists_user_id ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_share_token ON wishlists(share_token);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist_id ON wishlist_items(wishlist_id);

-- RLS Policies

-- Enable RLS
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

-- Wishlists: Owner can do everything
CREATE POLICY "Users can view own wishlists" ON wishlists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own wishlists" ON wishlists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own wishlists" ON wishlists
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own wishlists" ON wishlists
  FOR DELETE USING (auth.uid() = user_id);

-- Public can view wishlists by share_token (for shared links)
CREATE POLICY "Anyone can view shared wishlists by token" ON wishlists
  FOR SELECT USING (is_active = true);

-- Wishlist items: Owner can manage
CREATE POLICY "Users can view own wishlist items" ON wishlist_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.user_id = auth.uid())
  );

CREATE POLICY "Users can add items to own wishlists" ON wishlist_items
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.user_id = auth.uid())
  );

CREATE POLICY "Users can update own wishlist items" ON wishlist_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.user_id = auth.uid())
  );

CREATE POLICY "Users can delete own wishlist items" ON wishlist_items
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.user_id = auth.uid())
  );

-- Public can view items from active wishlists (for shared links)
CREATE POLICY "Anyone can view items from shared wishlists" ON wishlist_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.is_active = true)
  );

-- Public can vote on items from active wishlists (update vote/voted_at only)
CREATE POLICY "Anyone can vote on items from shared wishlists" ON wishlist_items
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.is_active = true)
  );

-- Function to update wishlist updated_at
CREATE OR REPLACE FUNCTION update_wishlist_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE wishlists SET updated_at = now() WHERE id = NEW.wishlist_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update wishlist timestamp when items change
CREATE TRIGGER wishlist_items_update_timestamp
  AFTER INSERT OR UPDATE OR DELETE ON wishlist_items
  FOR EACH ROW
  EXECUTE FUNCTION update_wishlist_timestamp();
