-- ===========================================
-- JUSTGRUG PIVOT - Product types + Chat messages
-- ===========================================

-- Add product_type column to products table
-- 'affiliate' = Amazon affiliate products (existing)
-- 'merch' = Print-on-demand merch (t-shirts etc)
-- 'own' = Grug's own products sold via Stripe (sticks, rocks, gimmicks)
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type TEXT NOT NULL DEFAULT 'affiliate'
  CHECK (product_type IN ('merch', 'affiliate', 'own'));

-- Set all existing products to affiliate (they already are)
UPDATE products SET product_type = 'affiliate' WHERE product_type = 'affiliate';

-- Index for filtering by product type
CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);

-- ===========================================
-- CHAT MESSAGES - Talk to Grug analytics/history
-- ===========================================

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- RLS for chat_messages
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Users can view their own chat messages
CREATE POLICY "Users can view own chat messages" ON chat_messages
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone can insert chat messages (anonymous users have null user_id)
CREATE POLICY "Anyone can insert chat messages" ON chat_messages
  FOR INSERT WITH CHECK (true);

-- Admins can view all chat messages (for analytics)
CREATE POLICY "Admins can view all chat messages" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );
