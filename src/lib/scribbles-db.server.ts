import { createClient } from '@/lib/supabase/server';
import { getAllScribbles as getFallbackScribbles, getScribbleBySlug as getFallbackBySlug } from '@/lib/scribbles';
import type { ScribblesPost } from '@/lib/database.types';

export type ScribblePostView = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  paragraphs: string[];
  pinned: boolean;
  pinnedAt?: string | null;
  pinnedOrder?: number | null;
};

function splitParagraphs(content: string): string[] {
  return content
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean);
}

function mapRow(row: ScribblesPost): ScribblePostView {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    publishedAt: row.published_at,
    paragraphs: splitParagraphs(row.content),
    pinned: row.pinned,
    pinnedAt: row.pinned_at,
    pinnedOrder: row.pinned_order,
  };
}

export async function getAllScribblesServer(): Promise<ScribblePostView[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('scribbles_posts')
    .select('*')
    .order('published_at', { ascending: false });

  if (error || !data) {
    return getFallbackScribbles().map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      publishedAt: p.publishedAt,
      paragraphs: p.paragraphs,
      pinned: false,
    }));
  }

  return data.map(mapRow);
}

export async function getPinnedScribblesServer(limit: number = 3): Promise<ScribblePostView[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('scribbles_posts')
    .select('*')
    .eq('pinned', true)
    .eq('is_published', true)
    .order('pinned_order', { ascending: true, nullsFirst: false })
    .order('pinned_at', { ascending: false })
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map(mapRow);
}

export async function getScribbleBySlugServer(slug: string): Promise<ScribblePostView | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('scribbles_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    const fallback = getFallbackBySlug(slug);
    if (!fallback) return null;

    return {
      slug: fallback.slug,
      title: fallback.title,
      excerpt: fallback.excerpt,
      publishedAt: fallback.publishedAt,
      paragraphs: fallback.paragraphs,
      pinned: false,
    };
  }

  return mapRow(data);
}
