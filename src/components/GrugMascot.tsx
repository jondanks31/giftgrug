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
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl',
  };

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      {/* Grug face - using emojis for MVP, can replace with SVG later */}
      <div className={cn('select-none', sizes[size])}>
        🗿
      </div>
      
      {/* Speech bubble */}
      {quote && (
        <div className="relative bg-stone-dark rounded-rock p-4 max-w-xs">
          {/* Bubble pointer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-stone-dark rotate-45" />
          <p className="font-scribble text-lg text-sand text-center relative z-10">
            "{quote}"
          </p>
        </div>
      )}
    </div>
  );
}
