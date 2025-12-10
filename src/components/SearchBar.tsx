'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { uiText, priceRanges } from '@/lib/grug-dictionary';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  priceRangeIndex?: number | null;
}

export function SearchBar({ className, priceRangeIndex = null }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      let url = `/hunt?q=${encodeURIComponent(query.trim())}`;
      if (priceRangeIndex !== null) {
        const priceId = priceRanges[priceRangeIndex]?.id;
        if (priceId) url += `&price=${priceId}`;
      }
      router.push(url);
    }
  };

  return (
    <form onSubmit={handleSearch} className={cn('space-y-4', className)}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-light" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={uiText.searchPlaceholder}
          className="pl-12 text-lg"
        />
      </div>
      <Button type="submit" className="w-full" size="lg">
        {uiText.searchButton}
      </Button>
    </form>
  );
}
