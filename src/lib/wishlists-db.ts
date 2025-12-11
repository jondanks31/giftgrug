// ===========================================
// WISHLISTS SERVICE (Cave Paintings)
// Manages wishlists and items with voting
// ===========================================

import { createClient } from '@/lib/supabase/client';
import type { Wishlist, WishlistItem, WishlistItemWithProduct, Product } from '@/lib/database.types';

// ===========================================
// WISHLIST CRUD
// ===========================================

// Get all wishlists for current user
export async function getUserWishlists(): Promise<Wishlist[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('wishlists')
    .select('*')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data;
}

// Get a single wishlist by ID (owner only)
export async function getWishlistById(id: string): Promise<Wishlist | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('wishlists')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data;
}

// Get wishlist by share token (public - for shared links)
export async function getWishlistByToken(shareToken: string): Promise<Wishlist | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('wishlists')
    .select('*')
    .eq('share_token', shareToken)
    .eq('is_active', true)
    .single();

  if (error || !data) return null;
  return data;
}

// Create a new wishlist
export async function createWishlist(
  name: string,
  recipientName?: string
): Promise<Wishlist | null> {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    console.error('Auth error in createWishlist:', authError);
    return null;
  }
  
  if (!user) {
    console.error('No user found in createWishlist');
    return null;
  }

  const { data, error } = await supabase
    .from('wishlists')
    .insert({
      user_id: user.id,
      name,
      recipient_name: recipientName || null,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating wishlist:', error);
    return null;
  }
  
  return data;
}

// Update wishlist
export async function updateWishlist(
  id: string,
  updates: { name?: string; recipient_name?: string; is_active?: boolean }
): Promise<Wishlist | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('wishlists')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error || !data) return null;
  return data;
}

// Delete wishlist
export async function deleteWishlist(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('id', id);

  return !error;
}

// ===========================================
// WISHLIST ITEMS
// ===========================================

// Get items for a wishlist (with product details)
export async function getWishlistItems(wishlistId: string): Promise<WishlistItemWithProduct[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('wishlist_items')
    .select(`
      *,
      product:products(*)
    `)
    .eq('wishlist_id', wishlistId)
    .order('added_at', { ascending: false });

  if (error || !data) return [];
  
  return data.map((item: any) => ({
    id: item.id,
    wishlist_id: item.wishlist_id,
    product_id: item.product_id,
    added_at: item.added_at,
    vote: item.vote,
    voted_at: item.voted_at,
    product: item.product,
  }));
}

// Get items by share token (public - for shared links)
export async function getWishlistItemsByToken(shareToken: string): Promise<WishlistItemWithProduct[]> {
  const supabase = createClient();
  
  // First get the wishlist
  const wishlist = await getWishlistByToken(shareToken);
  if (!wishlist) return [];
  
  return getWishlistItems(wishlist.id);
}

// Add product to wishlist
export async function addToWishlist(
  wishlistId: string,
  productId: string
): Promise<WishlistItem | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('wishlist_items')
    .insert({
      wishlist_id: wishlistId,
      product_id: productId,
      vote: null,
      voted_at: null,
    })
    .select()
    .single();

  if (error || !data) return null;
  return data;
}

// Remove product from wishlist
export async function removeFromWishlist(
  wishlistId: string,
  productId: string
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('wishlist_id', wishlistId)
    .eq('product_id', productId);

  return !error;
}

// Check if product is in any of user's wishlists
export async function getProductWishlists(productId: string): Promise<string[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data, error } = await supabase
    .from('wishlist_items')
    .select(`
      wishlist_id,
      wishlists!inner(user_id)
    `)
    .eq('product_id', productId)
    .eq('wishlists.user_id', user.id);

  if (error || !data) return [];
  return data.map((item: any) => item.wishlist_id);
}

// ===========================================
// VOTING (for womanfolk - no auth required)
// ===========================================

// Vote on an item (called via API route for security)
export async function voteOnItem(
  itemId: string,
  vote: 'up' | 'down' | null
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('wishlist_items')
    .update({
      vote,
      voted_at: vote ? new Date().toISOString() : null,
    })
    .eq('id', itemId);

  return !error;
}

// ===========================================
// STATS
// ===========================================

// Get vote counts for a wishlist
export async function getWishlistVoteCounts(wishlistId: string): Promise<{
  total: number;
  up: number;
  down: number;
  pending: number;
}> {
  const items = await getWishlistItems(wishlistId);
  
  return {
    total: items.length,
    up: items.filter(i => i.vote === 'up').length,
    down: items.filter(i => i.vote === 'down').length,
    pending: items.filter(i => i.vote === null).length,
  };
}

// Get user's default wishlist (create if doesn't exist)
export async function getOrCreateDefaultWishlist(): Promise<Wishlist | null> {
  const wishlists = await getUserWishlists();
  
  if (wishlists.length > 0) {
    return wishlists[0];
  }
  
  // Create default wishlist
  return createWishlist('My Cave Painting');
}
