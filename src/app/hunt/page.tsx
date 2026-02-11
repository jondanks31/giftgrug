'use client';

import { useState, useEffect } from 'react';
import { Header, MobileNav, Footer } from '@/components';
import { Button, Card, ProductGridSkeleton } from '@/components/ui';
import { ShoppingBag } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { ProductDisplay } from '@/lib/products-db';

export default function HuntPage() {
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('*')
        .in('product_type', ['merch', 'own'])
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (data) {
        setProducts(data.map(p => ({
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
        })));
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="font-grug text-3xl md:text-4xl text-sand mb-3">
            Grug Find Cool Things
          </h1>
          <p className="text-stone-light max-w-md mx-auto leading-relaxed">
            No junk. Just good stuff Grug actually think worth having.
            Cool sticks. Nice rocks. Useful things.
          </p>
        </section>

        {/* Products */}
        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl block mb-6">🪨</span>
            <h2 className="font-grug text-xl text-sand mb-3">
              Grug Still Making Things
            </h2>
            <p className="text-stone-light max-w-sm mx-auto leading-relaxed">
              Grug working on cool stuff. Sticks. Rocks. Maybe shirt with stick on it.
              Check back soon.
            </p>
          </div>
        )}
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}

function ProductCard({ product }: { product: ProductDisplay }) {
  return (
    <Card className="flex flex-col">
      {/* Product Image */}
      <div className="bg-bone/10 rounded-stone h-52 flex items-center justify-center mb-4 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.realName}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-5xl opacity-20">🪨</span>
        )}
      </div>

      <h3 className="font-grug text-lg text-sand mb-0.5">{product.grugName}</h3>
      <p className="text-xs text-stone-light mb-3">{product.realName}</p>

      {product.grugSays && (
        <p className="font-grug-speech text-stone-light text-sm mb-4 flex-grow leading-relaxed">
          &ldquo;{product.grugSays}&rdquo;
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-dark/40">
        <span className="font-grug text-fire text-lg">£{product.price}</span>
        <Button size="sm" className="flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          GET THIS
        </Button>
      </div>
    </Card>
  );
}
