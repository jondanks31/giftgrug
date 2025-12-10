'use client';

import Link from 'next/link';
import { Home, Search, User, LogIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth';

export function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-cave-dark/95 backdrop-blur-sm border-b border-stone-dark">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - centered on mobile, left on desktop */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <span className="font-grug text-2xl md:text-xl text-sand">GIFTGRUG</span>
          </Link>

          {/* Spacer for mobile centering */}
          <div className="w-8 md:hidden" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/" icon={<Home className="w-4 h-4" />}>
              Cave Home
            </NavLink>
            <NavLink href="/hunt" icon={<Search className="w-4 h-4" />}>
              Hunt
            </NavLink>
            {user ? (
              <NavLink 
                href="/cave" 
                icon={
                  <div className="relative">
                    <User className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-moss rounded-full" />
                  </div>
                }
              >
                My Cave
              </NavLink>
            ) : (
              <NavLink href="/cave" icon={<LogIn className="w-4 h-4" />}>
                Enter Cave
              </NavLink>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-stone-light hover:text-sand transition-colors"
    >
      {icon}
      <span className="font-grug text-sm">{children}</span>
    </Link>
  );
}

// Mobile bottom navigation
export function MobileNav() {
  const { user } = useAuth();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cave-dark border-t border-stone-dark">
      <div className="flex items-center justify-around h-16">
        <MobileNavLink href="/" icon={<Home className="w-5 h-5" />} label="Home" />
        <MobileNavLink href="/hunt" icon={<Search className="w-5 h-5" />} label="Hunt" />
        <MobileNavLink 
          href="/cave" 
          icon={
            <div className="relative">
              <User className="w-5 h-5" />
              {user && <span className="absolute -top-1 -right-1 w-2 h-2 bg-moss rounded-full" />}
            </div>
          } 
          label={user ? "Cave" : "Login"} 
        />
      </div>
    </nav>
  );
}

function MobileNavLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-1 text-stone-light hover:text-sand transition-colors"
    >
      {icon}
      <span className="text-xs font-grug">{label}</span>
    </Link>
  );
}
