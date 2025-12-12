'use client';

import { createClient } from '@/lib/supabase/client';
import type { ScribblesPost } from '@/lib/database.types';

export type ScribblePostView = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  pinned: boolean;
  pinnedAt: string | null;
  pinnedOrder: number | null;
};

export async function getPinnedScribbles(limit: number = 3): Promise<ScribblePostView[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('scribbles_posts')
    .select('id, slug, title, excerpt, published_at, pinned, pinned_at, pinned_order')
    .eq('is_published', true)
    .eq('pinned', true)
    .order('pinned_order', { ascending: true, nullsFirst: false })
    .order('pinned_at', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  return (data as ScribblesPost[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    publishedAt: row.published_at,
    pinned: row.pinned,
    pinnedAt: row.pinned_at,
    pinnedOrder: row.pinned_order,
  }));
}
