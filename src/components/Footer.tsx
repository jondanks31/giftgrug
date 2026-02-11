import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-stone-dark/40 py-8 mt-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-grug text-sand text-sm">GRUG</p>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-stone-light">
            <Link href="/about" className="hover:text-sand transition-colors">About</Link>
            <Link href="/legal/privacy" className="hover:text-sand transition-colors">Privacy</Link>
          </div>
        </div>

        <p className="text-stone-light/40 text-xs text-center mt-6">
          © {new Date().getFullYear()} Grug. Made with 🪨 and ❤️
        </p>
      </div>
    </footer>
  );
}
