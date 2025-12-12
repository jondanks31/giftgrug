import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Header, MobileNav, Footer, GrugMascot } from '@/components';
import { Button, Card } from '@/components/ui';
import { ScribblesAdminClient } from './ScribblesAdminClient';

export const dynamic = 'force-dynamic';

export default async function ScribblesAdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single();

  if (!profile?.is_admin) {
    notFound();
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <section className="text-center mb-10">
          <GrugMascot size="md" customMessage="Only chief Grug write on cave wall." />
          <h1 className="font-grug text-3xl md:text-4xl text-sand mt-6">🛠️ SCRIBBLES ADMIN</h1>
          <p className="text-stone-light mt-2">Make new scribbles. Pin best scribbles.</p>
          <div className="mt-6 flex justify-center">
            <Link href="/cave">
              <Button variant="secondary">Back to Cave</Button>
            </Link>
          </div>
        </section>

        <ScribblesAdminClient />

        <Card className="mt-10">
          <p className="text-stone-light text-sm">
            Note: Pins + new posts need the latest Supabase migration applied.
          </p>
        </Card>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}
