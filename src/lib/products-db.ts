// ===========================================
// DATABASE PRODUCTS SERVICE
// Fetches products from Supabase
// ===========================================

import { createClient } from '@/lib/supabase/client';
import type { Product } from '@/lib/database.types';

// Convert DB product to frontend format
export interface ProductDisplay {
  id: string;
  grugName: string;
  realName: string;
  category: string;
  priceRange: 'few' | 'some' | 'many' | 'big-pile' | 'whole-cave';
  price: number;
  amazonUrl: string;
  imageUrl: string | null;
  grugSays: string;
  isGrugPick: boolean;
  isPanicProduct: boolean;
  tags: string[];
}

function mapProduct(p: Product): ProductDisplay {
  return {
    id: p.id,
    grugName: p.grug_name,
    realName: p.real_name,
    category: p.category,
    priceRange: p.price_range,
    price: p.price,
    amazonUrl: p.amazon_url,
    imageUrl: p.image_url,
    grugSays: p.grug_says,
    isGrugPick: p.is_grug_pick,
    isPanicProduct: p.is_panic_product,
    tags: p.tags || [],
  };
}

// Get all active affiliate products (default for hunt affiliate tab)
export async function getAllProducts(): Promise<ProductDisplay[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('product_type', 'affiliate')
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapProduct);
}

// Get merch + own products (for hunt store tab)
export async function getMerchProducts(): Promise<ProductDisplay[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .in('product_type', ['merch', 'own'])
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapProduct);
}

// Get products by category
export async function getProductsByCategory(categoryId: string): Promise<ProductDisplay[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('category', categoryId)
    .order('is_grug_pick', { ascending: false });

  if (error || !data) return [];
  return data.map(mapProduct);
}

// Search products by name or tags
export async function searchProducts(query: string): Promise<ProductDisplay[]> {
  const supabase = createClient();
  const lowerQuery = query.toLowerCase();
  
  // Search in grug_name, real_name, and tags
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .or(`grug_name.ilike.%${lowerQuery}%,real_name.ilike.%${lowerQuery}%`);

  if (error || !data) return [];
  
  // Also filter by tags (Supabase doesn't support array contains with ilike easily)
  const results = data.filter(p => 
    p.grug_name.toLowerCase().includes(lowerQuery) ||
    p.real_name.toLowerCase().includes(lowerQuery) ||
    p.tags?.some((tag: string) => tag.toLowerCase().includes(lowerQuery))
  );
  
  return results.map(mapProduct);
}

// Get Grug Picks (featured products)
export async function getGrugPicks(): Promise<ProductDisplay[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_grug_pick', true)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data.map(mapProduct);
}

// Get Panic Mode products (last-minute emergency gifts)
export async function getPanicProducts(): Promise<ProductDisplay[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .eq('is_panic_product', true)
    .order('price', { ascending: true });

  if (error || !data) return [];
  return data.map(mapProduct);
}

// Filter products by price range
export function filterByPriceRange(
  products: ProductDisplay[],
  minPrice: number,
  maxPrice: number | null
): ProductDisplay[] {
  return products.filter((p) => {
    if (p.price < minPrice) return false;
    if (maxPrice !== null && p.price > maxPrice) return false;
    return true;
  });
}

// Get price coins count
export function getPriceCoins(range: ProductDisplay['priceRange']): number {
  const coins = { few: 1, some: 2, many: 3, 'big-pile': 4, 'whole-cave': 5 };
  return coins[range];
}
