import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-stone bg-stone-dark/50',
        className
      )}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-stone-dark rounded-stone p-4 space-y-4">
      {/* Image placeholder */}
      <Skeleton className="h-48 w-full rounded-stone" />
      
      {/* Title */}
      <Skeleton className="h-6 w-3/4" />
      
      {/* Subtitle */}
      <Skeleton className="h-4 w-1/2" />
      
      {/* Quote */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      
      {/* Price */}
      <Skeleton className="h-5 w-24" />
      
      {/* Button */}
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
