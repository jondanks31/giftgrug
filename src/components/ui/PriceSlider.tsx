'use client';

import { cn } from '@/lib/utils';
import { priceRanges, uiText } from '@/lib/grug-dictionary';

interface PriceSliderProps {
  value: number | null;
  onChange: (value: number | null) => void;
  className?: string;
}

export function PriceSlider({ value, onChange, className }: PriceSliderProps) {
  const currentRange = value !== null ? priceRanges[value] : null;

  // Toggle behavior - clicking selected item deselects it
  const handleClick = (index: number) => {
    if (value === index) {
      onChange(null); // Deselect
    } else {
      onChange(index); // Select
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      <label className="block font-grug text-lg text-sand text-center">
        {uiText.priceSliderLabel}
      </label>
      
      {/* Segmented stone buttons - wrap on mobile (centered), row on desktop */}
      <div className="flex flex-wrap justify-center gap-2 p-2 bg-cave rounded-rock">
        {priceRanges.map((range, index) => (
          <button
            key={range.id}
            onClick={() => handleClick(index)}
            className={cn(
              'py-2 px-3 rounded-stone transition-all duration-200',
              'flex flex-col items-center gap-1 min-w-[72px]',
              value === index
                ? 'bg-stone-dark shadow-inner border-2 border-fire/30'
                : 'hover:bg-stone-dark/50'
            )}
          >
            {/* Coin stack visualization */}
            <div className="flex gap-0.5">
              {Array.from({ length: range.coins }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'text-xs md:text-sm transition-all',
                    value === index ? 'text-fire' : 'text-sand/60'
                  )}
                >
                  🪙
                </span>
              ))}
            </div>
            
            {/* Price in real money */}
            <span className={cn(
              'text-xs font-medium',
              value === index ? 'text-bone' : 'text-stone-light'
            )}>
              {range.max ? `£${range.min}-${range.max}` : `£${range.min}+`}
            </span>
          </button>
        ))}
      </div>
      
      {/* Selected range display */}
      <div className="text-center">
        <span className="font-grug text-fire text-lg">
          {currentRange ? currentRange.grugName : 'All Prices'}
        </span>
        {value !== null && (
          <span className="text-stone-light text-xs block">(click again to show all)</span>
        )}
      </div>
    </div>
  );
}
