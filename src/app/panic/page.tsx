'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header, MobileNav, GrugMascot, Footer } from '@/components';
import { Button, Card } from '@/components/ui';
import { uiText } from '@/lib/grug-dictionary';
import { getPanicProducts, type ProductDisplay } from '@/lib/products-db';
import { ExternalLink, AlertTriangle } from 'lucide-react';

export default function PanicPage() {
  const [products, setProducts] = useState<ProductDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPanicProducts() {
      const data = await getPanicProducts();
      setProducts(data);
      setLoading(false);
    }
    fetchPanicProducts();
  }, []);

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-gradient-to-b from-blood/20 to-cave-dark">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Panic Header */}
        <section className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-blood animate-pulse" />
            <h1 className="font-grug text-3xl md:text-5xl text-blood">
              {uiText.panicHeading}
            </h1>
            <AlertTriangle className="w-8 h-8 text-blood animate-pulse" />
          </div>
          
          <GrugMascot situation="panic" size="md" />
          
          <p className="text-sand mt-4 max-w-md mx-auto">
            {uiText.panicSubheading}
          </p>
        </section>

        {/* Quick Tips */}
        <section className="max-w-2xl mx-auto mb-8">
          <Card className="bg-blood/10 border border-blood/30">
            <h2 className="font-grug text-lg text-sand mb-3">GRUG SURVIVAL TIPS:</h2>
            <ul className="space-y-2 text-sand/80 font-scribble text-lg">
              <li>• Gift card NEVER wrong. Womanfolk pick own thing.</li>
              <li>• Flower arrive same day from many place.</li>
              <li>• Sweet brown rocks (chocolate) always safe.</li>
              <li>• Say "Grug plan special thing later" - buy time.</li>
            </ul>
          </Card>
        </section>

        {/* Emergency Products */}
        <section>
          <h2 className="font-grug text-xl text-sand mb-6 text-center">
            FAST THINGS THAT SAVE MAN:
          </h2>
          
          {loading ? (
            <p className="text-center font-grug text-sand animate-pulse">Grug finding fast things...</p>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <PanicProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-stone-light">No panic products yet. Add some in admin!</p>
          )}
        </section>

        {/* Back to Safety */}
        <section className="text-center mt-12">
          <Link href="/">
            <Button variant="secondary" size="lg">
              Man Calm Now. Go Back Cave.
            </Button>
          </Link>
        </section>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}

function PanicProductCard({ product }: { product: ProductDisplay }) {
  return (
    <Card className="flex flex-col bg-cave border border-blood/20">
      {/* Product Image */}
      <div className="bg-bone/95 rounded-stone h-32 flex items-center justify-center mb-3 overflow-hidden p-3">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.realName}
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <span className="text-4xl opacity-30">🎁</span>
        )}
      </div>
      
      <h3 className="font-grug text-md text-sand mb-1">{product.grugName}</h3>
      <p className="text-xs text-stone-light mb-2">({product.realName})</p>
      
      {/* Price */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-grug text-fire">£{product.price}</span>
      </div>
      
      {/* CTA */}
      <a
        href={product.amazonUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto"
      >
        <Button variant="panic" size="sm" className="w-full flex items-center justify-center gap-2">
          GET NOW
          <ExternalLink className="w-3 h-3" />
        </Button>
      </a>
    </Card>
  );
}
