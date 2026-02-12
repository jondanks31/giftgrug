import type { Metadata } from 'next';
import Link from 'next/link';
import { Header, MobileNav, Footer, GrugMascot } from '@/components';
import { Button, Card } from '@/components/ui';
import { getAllScribblesServer } from '@/lib/scribbles-db.server';

export const metadata: Metadata = {
  title: 'Scribbles - GiftGrug',
  description: 'Grug scribble thoughts on cave wall. Man read. Man do better.',
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function ScribblesPage() {
  const posts = await getAllScribblesServer();

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <section className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/grug_avatar.png" alt="Grug" className="h-12 w-auto" />
            <h1 className="font-grug text-3xl md:text-4xl text-sand">SCRIBBLES</h1>
          </div>
          <GrugMascot size="md" customMessage="Grug scribble on cave wall. Man read. Man learn." />
        </section>

        {posts.length === 0 ? (
          <Card className="text-center py-10">
            <p className="font-grug text-sand text-lg">No scribbles yet.</p>
            <p className="text-stone-light mt-2">Grug brain empty right now.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Card key={post.slug} className="flex flex-col">
                <p className="text-xs text-stone-light">{formatDate(post.publishedAt)}</p>
                <h2 className="font-grug text-lg text-sand mt-2">{post.title}</h2>
                <p className="text-stone-light mt-2 text-sm flex-grow">{post.excerpt}</p>

                <div className="mt-4">
                  <Link href={`/scribbles/${post.slug}`}>
                    <Button variant="secondary" size="sm" className="w-full">
                      Read Scribble
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        <section className="mt-10 text-center">
          <p className="font-grug-speech text-sand/80 text-lg">
            "Man read scribble. Man not panic later."
          </p>
          <div className="mt-4">
            <Link href="/hunt">
              <Button>Go Hunt</Button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}
