'use client';

import { cn } from '@/lib/utils';
import { getRandomQuote } from '@/lib/grug-dictionary';
import { useEffect, useState } from 'react';

interface GrugMascotProps {
  situation?: 'welcome' | 'searching' | 'found' | 'panic' | 'empty' | 'saved' | 'error';
  customMessage?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function GrugMascot({
  situation = 'welcome',
  customMessage,
  className,
  size = 'md',
}: GrugMascotProps) {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(customMessage || getRandomQuote(situation));
  }, [situation, customMessage]);

  const sizes = {
    sm: 'text-3xl',
    md: 'text-4xl',
    lg: 'text-5xl',
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Grug face - using emojis for MVP, can replace with SVG later */}
      <div className={cn('select-none flex-shrink-0', sizes[size])}>
        🗿
      </div>
      
      {/* Speech bubble */}
      {quote && (
        <div className="relative bg-stone-dark rounded-rock p-3 flex-grow">
          {/* Bubble pointer - pointing left to Grug */}
          <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-3 bg-stone-dark rotate-45" />
          <p className="text-sm text-sand relative z-10" style={{ fontFamily: '"Comic Sans MS", "Comic Sans", cursive' }}>
            "{quote}"
          </p>
        </div>
      )}
    </div>
  );
}
