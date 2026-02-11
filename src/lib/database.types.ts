// Database types for JustGrug

export interface Profile {
  id: string;
  grug_name: string | null;
  created_at: string;
  updated_at: string;
  is_admin: boolean;
}

export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  grug_name: string;
  real_name: string;
  category: string;
  price_range: 'few' | 'some' | 'many' | 'big-pile' | 'whole-cave';
  price: number;
  amazon_url: string;
  amazon_asin: string | null;
  image_url: string | null;
  grug_says: string;
  is_grug_pick: boolean;
  is_active: boolean;
  is_panic_product: boolean;
  tags: string[];
  product_type: 'merch' | 'affiliate' | 'own';
}

export interface SpecialSun {
  id: string;
  user_id: string;
  name: string;
  recipient_type: string;
  occasion_type: string;
  date: string;
  reminder_days: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Reminder tracking
  reminder_14_sent: boolean;
  reminder_4_sent: boolean;
  reminder_4_enabled: boolean;
  man_remembered: boolean;
  man_remembered_at: string | null;
}

export interface SavedProduct {
  id: string;
  user_id: string;
  product_id: string;
  special_sun_id: string | null;
  created_at: string;
}

export interface ScribblesPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  published_at: string;
  is_published: boolean;
  pinned: boolean;
  pinned_at: string | null;
  pinned_order: number | null;
  created_at: string;
  updated_at: string;
}

// Wishlists - "Cave Paintings"
export interface Wishlist {
  id: string;
  user_id: string;
  name: string;
  recipient_name: string | null;
  share_token: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Wishlist items with voting
export interface WishlistItem {
  id: string;
  wishlist_id: string;
  product_id: string;
  added_at: string;
  vote: 'up' | 'down' | null;
  voted_at: string | null;
}

// Extended wishlist item with product details (for display)
export interface WishlistItemWithProduct extends WishlistItem {
  product: Product;
}

// Chat messages for Talk to Grug
export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string | null;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      special_suns: {
        Row: SpecialSun;
        Insert: Omit<SpecialSun, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SpecialSun, 'id' | 'user_id' | 'created_at'>>;
      };
      saved_products: {
        Row: SavedProduct;
        Insert: Omit<SavedProduct, 'id' | 'created_at'>;
        Update: Partial<Omit<SavedProduct, 'id' | 'user_id' | 'created_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at'>>;
      };
      scribbles_posts: {
        Row: ScribblesPost;
        Insert: Omit<ScribblesPost, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ScribblesPost, 'id' | 'created_at'>>;
      };
      wishlists: {
        Row: Wishlist;
        Insert: Omit<Wishlist, 'id' | 'share_token' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Wishlist, 'id' | 'user_id' | 'share_token' | 'created_at'>>;
      };
      wishlist_items: {
        Row: WishlistItem;
        Insert: Omit<WishlistItem, 'id' | 'added_at'>;
        Update: Partial<Omit<WishlistItem, 'id' | 'wishlist_id' | 'product_id' | 'added_at'>>;
      };
    };
  };
}
