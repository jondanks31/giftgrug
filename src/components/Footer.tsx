import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-cave-dark border-t border-stone-dark/50 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand */}
          <div className="text-center md:text-left">
            <p className="font-grug text-sand">GIFTGRUG</p>
            <p className="text-stone-light text-xs mt-1">
              Grug help man. Man help womanfolk. Everyone happy.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-stone-light">
            <Link href="/about" className="hover:text-fire transition-colors">
              About
            </Link>
            <Link href="/legal/privacy" className="hover:text-fire transition-colors">
              Privacy
            </Link>
            <Link href="/legal/affiliate" className="hover:text-fire transition-colors">
              Affiliate Disclosure
            </Link>
          </div>

          {/* Amazon disclaimer */}
          <p className="text-stone-light/50 text-xs text-center md:text-right max-w-xs">
            As an Amazon Associate, GiftGrug earns from qualifying purchases.
          </p>
        </div>

        <div className="text-center mt-6 pt-4 border-t border-stone-dark/30">
          <p className="text-stone-light/40 text-xs">
            © {new Date().getFullYear()} GiftGrug. Made with 🪨 and ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}
