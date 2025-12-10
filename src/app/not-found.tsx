import Link from 'next/link';
import { Header, MobileNav, GrugMascot } from '@/components';
import { Button } from '@/components/ui';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />
      
      <div className="container mx-auto px-4 py-16 text-center">
        <GrugMascot 
          size="lg" 
          customMessage="Grug confused. This cave empty. Maybe wrong turn?"
        />
        
        <h1 className="font-grug text-6xl md:text-8xl text-fire mt-8 mb-4">
          404
        </h1>
        
        <h2 className="font-grug text-2xl md:text-3xl text-sand mb-4">
          GRUG LOST IN CAVE
        </h2>
        
        <p className="font-scribble text-xl text-sand/80 mb-8 max-w-md mx-auto">
          "Page man looking for not exist. Maybe sabertooth eat it. 
          Grug suggest go back to main cave."
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Back to Cave
            </Button>
          </Link>
          <Link href="/hunt">
            <Button variant="secondary" size="lg" className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Hunt for Gifts
            </Button>
          </Link>
        </div>
        
        {/* Fun cave drawing */}
        <div className="mt-16 text-stone-light/30 font-mono text-xs">
          <pre className="inline-block text-left">
{`
       /\\
      /  \\
     /    \\
    / ???? \\
   /________\\
  |  ______  |
  | |      | |
  | | GRUG | |
  | |______| |
  |__________|
`}
          </pre>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
