'use client';

import { useEffect, useRef } from 'react';
import '@/types/ezoic.d';

interface EzoicAdProps {
  placementId: number;
  className?: string;
}

export function EzoicAd({ placementId, className = '' }: EzoicAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const hasLoaded = useRef(false);

  useEffect(() => {
    // Only run once per mount
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    // Push the showAds command
    if (typeof window !== 'undefined' && window.ezstandalone) {
      window.ezstandalone.cmd.push(() => {
        window.ezstandalone?.showAds(placementId);
      });
    }
  }, [placementId]);

  return (
    <div
      ref={adRef}
      id={`ezoic-pub-ad-placeholder-${placementId}`}
      className={className}
    />
  );
}
