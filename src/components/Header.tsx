'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, User, LogIn, PenTool, MessageCircle, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth';

export function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-cave-dark/95 backdrop-blur-sm border-b border-stone-dark/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo (left) */}
          <Link href="/" className="shrink-0 group">
            <span className="font-grug text-2xl md:text-xl text-sand group-hover:text-fire transition-colors duration-200">GRUG</span>
          </Link>

          {/* Desktop: Centre nav */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/" icon={<Home className="w-4 h-4" />} active={pathname === '/'}>
              Home
            </NavLink>
            <NavLink href="/hunt" icon={<Search className="w-4 h-4" />} active={pathname.startsWith('/hunt')}>
              Hunt
            </NavLink>
            <NavLink href="/scribbles" icon={<PenTool className="w-4 h-4" />} active={pathname.startsWith('/scribbles')}>
              Scribbles
            </NavLink>
            <NavLink href="/talk" icon={<MessageCircle className="w-4 h-4" />} active={pathname.startsWith('/talk')}>
              Talk to Grug
            </NavLink>
          </nav>

          {/* Desktop: Right actions (basket + login) */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/basket"
              className={cn(
                'relative p-2 rounded-stone transition-colors',
                pathname.startsWith('/basket') ? 'text-sand' : 'text-stone-light hover:text-sand'
              )}
            >
              <ShoppingBag className="w-5 h-5" />
            </Link>
            {user ? (
              <Link
                href="/cave"
                className={cn(
                  'flex items-center gap-2 transition-colors',
                  pathname.startsWith('/cave') ? 'text-sand' : 'text-stone-light hover:text-sand'
                )}
              >
                <div className="relative">
                  <User className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-moss rounded-full" />
                </div>
                <span className="font-grug text-sm">My Cave</span>
              </Link>
            ) : (
              <Link
                href="/cave"
                className={cn(
                  'flex items-center gap-2 transition-colors',
                  pathname.startsWith('/cave') ? 'text-sand' : 'text-stone-light hover:text-sand'
                )}
              >
                <LogIn className="w-5 h-5" />
                <span className="font-grug text-sm">Login</span>
              </Link>
            )}
          </div>

          {/* Mobile: Basket icon (top right, always visible) */}
          <Link
            href="/basket"
            className={cn(
              'md:hidden p-2 transition-colors',
              pathname.startsWith('/basket') ? 'text-sand' : 'text-stone-light hover:text-sand'
            )}
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>

        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  icon,
  children,
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'nav-link flex items-center gap-2 transition-colors',
        active ? 'active text-sand' : 'text-stone-light hover:text-sand'
      )}
    >
      {icon}
      <span className="font-grug text-sm">{children}</span>
    </Link>
  );
}

// Mobile bottom navigation
export function MobileNav() {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[60] bg-cave-dark/95 backdrop-blur-sm border-t border-stone-dark/60">
      <div className="flex items-center justify-around h-16">
        <MobileNavLink href="/" icon={<Home className="w-5 h-5" />} label="Home" active={pathname === '/'} />
        <MobileNavLink href="/hunt" icon={<Search className="w-5 h-5" />} label="Hunt" active={pathname.startsWith('/hunt')} />
        <MobileNavLink href="/scribbles" icon={<PenTool className="w-5 h-5" />} label="Scribbles" active={pathname.startsWith('/scribbles')} />
        <MobileNavLink href="/talk" icon={<MessageCircle className="w-5 h-5" />} label="Grug" active={pathname.startsWith('/talk')} />
        <MobileNavLink 
          href="/cave" 
          active={pathname.startsWith('/cave')}
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
  active = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'mobile-nav-link flex flex-col items-center gap-1 transition-colors',
        active ? 'text-sand' : 'text-stone-light hover:text-sand'
      )}
    >
      {icon}
      <span className="text-xs font-grug">{label}</span>
      <span className="mobile-nav-dot" />
    </Link>
  );
}
