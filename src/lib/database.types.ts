// Database types for GiftGrug

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
    };
  };
}
