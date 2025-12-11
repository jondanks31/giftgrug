'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { categories, priceRanges, type Category } from '@/lib/grug-dictionary';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

interface CategoryGridProps {
  className?: string;
  priceRangeIndex?: number | null;
}

export function CategoryGrid({ className, priceRangeIndex = null }: CategoryGridProps) {
  const [enabledCategories, setEnabledCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const priceId = priceRangeIndex !== null ? priceRanges[priceRangeIndex]?.id : null;

  useEffect(() => {
    async function fetchEnabledCategories() {
      const supabase = createClient();
      const { data } = await supabase
        .from('categories')
        .select('id')
        .eq('is_enabled', true)
        .order('display_order', { ascending: true });
      
      if (data) {
        setEnabledCategories(data.map(c => c.id));
      }
      setLoading(false);
    }
    fetchEnabledCategories();
  }, []);

  // Filter categories to only show enabled ones
  const visibleCategories = categories.filter(cat => enabledCategories.includes(cat.id));

  if (loading) {
    return (
      <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3', className)}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="category-card animate-pulse bg-stone-dark/50 h-28" />
        ))}
      </div>
    );
  }

  if (visibleCategories.length === 0) {
    return (
      <div className="text-center py-8 text-stone-light">
        <p className="font-grug-speech text-lg">Grug preparing cave... come back soon!</p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3', className)}>
      {visibleCategories.map((category) => (
        <CategoryCard key={category.id} category={category} priceId={priceId} />
      ))}
    </div>
  );
}

function CategoryCard({ category, priceId }: { category: Category; priceId: string | null }) {
  const href = priceId 
    ? `/hunt?category=${category.id}&price=${priceId}`
    : `/hunt?category=${category.id}`;
    
  return (
    <Link
      href={href}
      className="category-card group"
    >
      <span className="emoji text-4xl group-hover:scale-110 transition-transform">
        {category.emoji}
      </span>
      <span className="name text-sm leading-tight">
        {category.grugName}
      </span>
      <span className="text-xs text-stone-light opacity-0 group-hover:opacity-100 transition-opacity">
        ({category.realName})
      </span>
    </Link>
  );
}
