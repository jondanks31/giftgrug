'use client';

import { useState } from 'react';
import { Header, MobileNav, SearchBar, CategoryGrid, PanicButton, GrugMascot, Footer, PinnedScribblesSection } from '@/components';
import { PriceSlider } from '@/components/ui';
import { uiText } from '@/lib/grug-dictionary';

export default function HomePage() {
  const [priceRange, setPriceRange] = useState<number | null>(null); // No selection by default

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center space-y-6 mb-12">
          <GrugMascot situation="welcome" size="lg" />
          
          <h1 className="font-grug text-3xl md:text-5xl text-sand leading-tight">
            {uiText.mainHeading}
          </h1>
          
          <p className="text-stone-light text-lg max-w-md mx-auto">
            {uiText.subHeading}
          </p>
        </section>

        {/* Search Section */}
        <section className="max-w-xl mx-auto space-y-6 mb-12">
          <SearchBar priceRangeIndex={priceRange} />
          
          <div className="bg-stone-dark/50 rounded-rock p-6">
            <PriceSlider value={priceRange} onChange={setPriceRange} />
          </div>
        </section>

        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="font-grug text-xl text-sand mb-6 text-center">
            {uiText.categoriesHeading}
          </h2>
          <CategoryGrid priceRangeIndex={priceRange} />
        </section>

        <PinnedScribblesSection />

        {/* Panic Button */}
        <section className="max-w-md mx-auto">
          <PanicButton />
        </section>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}
