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

  const mobileSizes = {
    sm: 'text-3xl',
    md: 'text-4xl',
    lg: 'text-5xl',
  };

  return (
    <>
      {/* Desktop: Vertical layout (original) */}
      <div className={cn('hidden md:flex flex-col items-center gap-3', className)}>
        <div className={cn('select-none', sizes[size])}>
          🗿
        </div>
        {quote && (
          <div className="relative bg-stone-dark rounded-rock p-4 max-w-xs">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-stone-dark rotate-45" />
            <p className="font-grug-speech text-lg text-sand text-center relative z-10">
              "{quote}"
            </p>
          </div>
        )}
      </div>

      {/* Mobile: Horizontal layout with Grug on right */}
      <div className={cn('flex md:hidden items-center gap-3', className)}>
        {/* Speech bubble */}
        {quote && (
          <div className="relative bg-stone-dark rounded-rock p-3 flex-grow">
            {/* Bubble pointer - pointing right to Grug */}
            <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-3 h-3 bg-stone-dark rotate-45" />
            <p className="text-sm text-sand relative z-10 font-grug-speech">
              "{quote}"
            </p>
          </div>
        )}
        {/* Grug face on right (facing left toward bubble) */}
        <div className={cn('select-none flex-shrink-0', mobileSizes[size])}>
          🗿
        </div>
      </div>
    </>
  );
}
