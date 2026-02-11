import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-16">
      <div className="cave-divider"><span className="cave-divider-center" /></div>
      <div className="py-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="font-grug text-sand text-sm">GRUG</p>

            <div className="flex flex-wrap justify-center gap-5 text-xs text-stone-light">
              <Link href="/about" className="hover:text-sand transition-colors duration-200">About</Link>
              <Link href="/legal/privacy" className="hover:text-sand transition-colors duration-200">Privacy</Link>
            </div>
          </div>

          <p className="text-stone-light/30 text-xs text-center mt-6">
            © {new Date().getFullYear()} Grug. Made with rocks and fire.
          </p>
        </div>
      </div>
    </footer>
  );
}
