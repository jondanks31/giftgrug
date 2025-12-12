import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header, MobileNav, Footer, GrugMascot } from '@/components';
import { Card, Button } from '@/components/ui';
import { getScribbleBySlugServer } from '@/lib/scribbles-db.server';
import { ScribblePinToggle } from '@/components/ScribblePinToggle';
import { ScribbleProductEmbed } from './ScribbleProductEmbed';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getScribbleBySlugServer(params.slug);

  if (!post) {
    return {
      title: 'Scribble Not Found - GiftGrug',
    };
  }

  return {
    title: `${post.title} - Scribbles - GiftGrug`,
    description: post.excerpt,
  };
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function renderScribbleBlock(block: string, idx: number) {
  const trimmed = block.trim();
  const imgMatch = trimmed.match(/^\{\{img:(.+)\}\}$/);
  if (imgMatch) {
    const url = imgMatch[1]?.trim();
    const isAllowed =
      typeof url === 'string' &&
      url.startsWith('https://') &&
      url.includes('/storage/v1/object/public/scribbles-images/');

    if (!isAllowed) {
      return (
        <p key={idx} className="font-grug-speech text-lg leading-relaxed text-sand/90">
          {block}
        </p>
      );
    }

    return (
      <div key={idx} className="bg-stone-dark/30 rounded-stone p-3">
        <img
          src={url}
          alt="Scribble picture"
          className="w-full max-h-[520px] object-contain rounded-stone bg-bone/95"
          loading="lazy"
        />
      </div>
    );
  }

  const productMatch = trimmed.match(/^\{\{product:([0-9a-fA-F-]{36})\}\}$/);
  if (productMatch) {
    const productId = productMatch[1];
    return (
      <div key={idx} className="my-2">
        <ScribbleProductEmbed productId={productId} />
      </div>
    );
  }

  return (
    <p key={idx} className="font-grug-speech text-lg leading-relaxed text-sand/90">
      {block}
    </p>
  );
}

export default async function ScribblePostPage({ params }: { params: { slug: string } }) {
  const post = await getScribbleBySlugServer(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <section className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🗿</span>
            <h1 className="font-grug text-2xl md:text-4xl text-sand">{post.title}</h1>
          </div>

          <p className="text-stone-light text-sm">{formatDate(post.publishedAt)}</p>

          <div className="mt-6">
            <GrugMascot
              size="md"
              customMessage="Grug write this with charcoal stick. No judge handwriting."
            />
          </div>
        </section>

        <Card className="bg-cave border border-stone-dark">
          <div className="mb-4 flex justify-end">
            <ScribblePinToggle slug={post.slug} pinned={post.pinned} />
          </div>
          <div className="space-y-5">
            {post.paragraphs.map(renderScribbleBlock)}
          </div>

          <div className="mt-8 pt-6 border-t border-stone-dark/50 flex flex-col sm:flex-row gap-3 justify-between">
            <Link href="/scribbles" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full sm:w-auto">
                Back to Scribbles
              </Button>
            </Link>

            <Link href="/hunt" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto">Go Hunt</Button>
            </Link>
          </div>
        </Card>
      </div>

      <Footer />
      <MobileNav />
    </div>
  );
}
