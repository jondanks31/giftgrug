'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, Button } from '@/components/ui';
import { getPinnedScribbles, type ScribblePostView } from '@/lib/scribbles-db';

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function PinnedScribblesSection() {
  const [posts, setPosts] = useState<ScribblePostView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const pinned = await getPinnedScribbles(3);
      if (mounted) {
        setPosts(pinned);
        setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return null;
  if (posts.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="text-center mb-6">
        <h2 className="font-grug text-xl text-sand">🗿 GRUG FAVOURITE SCRIBBLES</h2>
        <p className="text-stone-light text-sm mt-2">Best cave wall writings. Grug proud.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Card key={post.slug} className="flex flex-col">
            <p className="text-xs text-stone-light">{formatDate(post.publishedAt)}</p>
            <h3 className="font-grug text-lg text-sand mt-2">{post.title}</h3>
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

      <div className="text-center mt-6">
        <Link href="/scribbles">
          <Button variant="ghost">See All Scribbles →</Button>
        </Link>
      </div>
    </section>
  );
}
