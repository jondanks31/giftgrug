'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { X, Search, Package } from 'lucide-react';
import { Input } from '@/components/ui';

interface Product {
  id: string;
  grug_name: string;
  real_name: string;
  price: number;
  image_url: string | null;
  category: string;
}

interface ProductPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (product: Product) => void;
}

export function ProductPicker({ isOpen, onClose, onSelect }: ProductPickerProps) {
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!isOpen) return;

    async function loadProducts() {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('id, grug_name, real_name, price, image_url, category')
        .eq('is_active', true)
        .order('grug_name', { ascending: true })
        .limit(50);

      if (search.trim()) {
        query = query.or(`grug_name.ilike.%${search}%,real_name.ilike.%${search}%`);
      }

      const { data } = await query;
      setProducts((data as Product[]) || []);
      setLoading(false);
    }

    const debounce = setTimeout(loadProducts, 300);
    return () => clearTimeout(debounce);
  }, [isOpen, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-cave-dark/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-cave border border-stone-dark rounded-stone w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-stone-dark">
          <h3 className="font-grug text-lg text-fire flex items-center gap-2">
            <Package className="w-5 h-5" />
            Pick a Product to Embed
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-stone-light hover:text-sand hover:bg-stone-dark/50 rounded-stone transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-stone-dark">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-light" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by name..."
              className="pl-10"
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-stone-light text-center py-8">Grug searching cave...</p>
          ) : products.length === 0 ? (
            <p className="text-stone-light text-center py-8">
              {search ? 'No products found. Try different words.' : 'No products in cave yet.'}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => {
                    onSelect(product);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-3 bg-stone-dark/30 hover:bg-stone-dark/60 rounded-stone text-left transition-colors group"
                >
                  <div className="w-14 h-14 bg-bone/90 rounded-stone flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.real_name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-2xl opacity-40">🎁</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-grug text-sand text-sm truncate group-hover:text-fire transition-colors">
                      {product.grug_name}
                    </p>
                    <p className="text-xs text-stone-light truncate">{product.real_name}</p>
                    <p className="text-xs text-fire mt-1">£{product.price}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-stone-dark bg-stone-dark/20">
          <p className="text-xs text-stone-light text-center">
            Click a product to embed it in your scribble
          </p>
        </div>
      </div>
    </div>
  );
}
