'use client';

import { Header, MobileNav, Footer } from '@/components';
import { ShoppingBag } from 'lucide-react';

export default function BasketPage() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <section className="pt-20 pb-16 md:pt-28 md:pb-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <ShoppingBag className="w-12 h-12 text-stone-light mx-auto mb-4" />
          <h1 className="font-grug text-3xl md:text-4xl text-sand mb-4">
            Grug Basket Empty
          </h1>
          <p className="text-stone-light text-base md:text-lg max-w-md mx-auto leading-relaxed">
            Man not put anything in basket yet. Go hunt for cool things first.
          </p>
        </div>
      </section>

      <Footer />
      <MobileNav />
    </div>
  );
}
