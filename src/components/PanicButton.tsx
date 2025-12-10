'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { uiText } from '@/lib/grug-dictionary';
import { cn } from '@/lib/utils';

interface PanicButtonProps {
  className?: string;
}

export function PanicButton({ className }: PanicButtonProps) {
  return (
    <Link
      href="/panic"
      className={cn(
        'btn-panic block w-full py-4 px-6 text-center rounded-rock',
        'hover:scale-[1.02] active:scale-[0.98] transition-transform',
        className
      )}
    >
      <div className="flex items-center justify-center gap-3">
        <AlertTriangle className="w-6 h-6 animate-pulse" />
        <span className="font-grug text-lg">{uiText.panicButton}</span>
        <AlertTriangle className="w-6 h-6 animate-pulse" />
      </div>
    </Link>
  );
}
