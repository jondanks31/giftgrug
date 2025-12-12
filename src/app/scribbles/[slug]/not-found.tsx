import Link from 'next/link';
import { Header, MobileNav, Footer, GrugMascot } from '@/components';
import { Button, Card } from '@/components/ui';

export default function ScribbleNotFound() {
  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-cave-dark">
      <Header />

      <div className="container mx-auto px-4 py-16 text-center max-w-xl">
        <GrugMascot situation="error" size="lg" />

        <Card className="mt-6">
          <h1 className="font-grug text-2xl text-sand">Ugh. Scribble Not Here.</h1>
          <p className="text-stone-light mt-2">
            Grug look at cave wall. No find this scribble. Maybe wind take it.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/scribbles" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full sm:w-auto">
                Back to Scribbles
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">Go Home</Button>
            </Link>
          </div>
        </Card>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}
