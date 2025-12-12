'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button, Card, Input } from '@/components/ui';
import type { ScribblesPost } from '@/lib/database.types';
import { ScribblesImageUpload } from '@/components/admin/ScribblesImageUpload';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function ScribblesAdminClient() {
  const supabase = createClient();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [publishedAt, setPublishedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successSlug, setSuccessSlug] = useState<string | null>(null);

  const suggestedSlug = useMemo(() => slugify(title), [title]);

  useEffect(() => {
    if (!slug) {
      setSlug(suggestedSlug);
    }
  }, [suggestedSlug]);

  function resetForm() {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setIsPublished(true);
    setPublishedAt(new Date().toISOString().slice(0, 10));
  }

  function startEdit(post: ScribblesPost) {
    setError(null);
    setSuccessSlug(null);
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setPublishedAt(post.published_at);
    setIsPublished(post.is_published);
  }

  async function handleUpdate() {
    if (!editingId) return;

    setError(null);
    setSuccessSlug(null);

    if (!title.trim()) return setError('Title required');
    if (!slug.trim()) return setError('Slug required');
    if (!excerpt.trim()) return setError('Excerpt required');
    if (!content.trim()) return setError('Content required');

    setSaving(true);

    const { error: updateError } = await supabase
      .from('scribbles_posts')
      .update({
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        published_at: publishedAt,
        is_published: isPublished,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingId);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    const updatedSlug = slug.trim();
    resetForm();
    setSuccessSlug(updatedSlug);
    setSaving(false);
    await loadPosts();
  }

  async function handleDelete(post: ScribblesPost) {
    const ok = confirm(`Delete scribble "${post.title}"?`);
    if (!ok) return;

    setSaving(true);
    const { error: delError } = await supabase.from('scribbles_posts').delete().eq('id', post.id);
    setSaving(false);

    if (delError) {
      alert(delError.message);
      return;
    }

    if (editingId === post.id) {
      resetForm();
    }

    await loadPosts();
  }

  function insertAtEnd(block: string) {
    const trimmed = content.trimEnd();
    const next = `${trimmed}${trimmed ? '\n\n' : ''}${block}\n\n`;
    setContent(next);
  }

  const [posts, setPosts] = useState<ScribblesPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  async function loadPosts() {
    setLoadingPosts(true);
    const { data } = await supabase
      .from('scribbles_posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(25);

    setPosts((data as ScribblesPost[]) || []);
    setLoadingPosts(false);
  }

  useEffect(() => {
    loadPosts();
  }, []);

  async function handleCreate() {
    setError(null);
    setSuccessSlug(null);

    if (!title.trim()) return setError('Title required');
    if (!slug.trim()) return setError('Slug required');
    if (!excerpt.trim()) return setError('Excerpt required');
    if (!content.trim()) return setError('Content required');

    setSaving(true);

    const { error: insertError } = await supabase.from('scribbles_posts').insert({
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      published_at: publishedAt,
      is_published: isPublished,
      pinned: false,
      pinned_at: null,
      pinned_order: null,
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    resetForm();
    setSuccessSlug(slug.trim());
    setSaving(false);

    await loadPosts();
  }

  async function togglePinned(post: ScribblesPost) {
    const nextPinned = !post.pinned;
    const { error: updateError } = await supabase
      .from('scribbles_posts')
      .update({
        pinned: nextPinned,
        pinned_at: nextPinned ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', post.id);

    if (updateError) {
      alert(updateError.message);
      return;
    }

    await loadPosts();
  }

  return (
    <div className="space-y-8">
      <Card className="bg-cave border border-stone-dark">
        <h2 className="font-grug text-xl text-fire mb-4">
          {editingId ? '✏️ EDIT SCRIBBLE' : '✍️ MAKE NEW SCRIBBLE'}
        </h2>

        {error && (
          <div className="mb-4 bg-blood/10 border border-blood/30 rounded-stone p-3 text-bone">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {successSlug && (
          <div className="mb-4 bg-moss/10 border border-moss/30 rounded-stone p-3">
            <p className="text-sm text-sand">Scribble made.</p>
            <Link href={`/scribbles/${successSlug}`} className="text-fire hover:underline text-sm">
              Go see scribble →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-stone-light mb-1">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Grug write about gift..." />
            {title && (
              <p className="text-xs text-stone-light mt-1">Suggested slug: {suggestedSlug}</p>
            )}
          </div>

          <div>
            <label className="block text-sm text-stone-light mb-1">Slug</label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="my-scribble-slug" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-stone-light mb-1">Excerpt</label>
            <Input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short thing man read before click..." />
          </div>

          <div>
            <label className="block text-sm text-stone-light mb-1">Published date</label>
            <Input type="date" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
          </div>

          <div className="flex items-end gap-2">
            <label className="flex items-center gap-2 text-sm text-sand">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              Published
            </label>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-stone-light mb-1">Content</label>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <ScribblesImageUpload
                onUpload={(url) => {
                  insertAtEnd(`{{img:${url}}}`);
                }}
              />

              <button
                type="button"
                onClick={() => {
                  const id = prompt('Paste product UUID to embed (from products table):');
                  if (!id) return;
                  insertAtEnd(`{{product:${id.trim()}}}`);
                }}
                className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-stone border border-stone-dark text-stone-light hover:text-sand hover:bg-stone-dark/40 cursor-pointer transition-colors"
              >
                + Embed Product
              </button>
              <p className="text-xs text-stone-light">
                Best: put embeds on their own line (blank lines around).
              </p>
            </div>
            <textarea
              className="input-cave w-full min-h-[220px] py-3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Use blank lines to make new paragraph..."
            />
            <p className="text-xs text-stone-light mt-2">
              Tip: Use empty line to split paragraphs.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {editingId ? (
            <>
              <Button onClick={handleUpdate} disabled={saving}>
                {saving ? 'Grug saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="secondary"
                onClick={() => resetForm()}
                disabled={saving}
              >
                Cancel Edit
              </Button>
            </>
          ) : (
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? 'Grug saving...' : 'Create Scribble'}
            </Button>
          )}
          <Link href="/scribbles" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full sm:w-auto">
              View Scribbles
            </Button>
          </Link>
        </div>
      </Card>

      <Card>
        <h2 className="font-grug text-xl text-sand mb-4">📜 EXISTING SCRIBBLES</h2>

        {loadingPosts ? (
          <p className="text-stone-light">Grug loading scribbles...</p>
        ) : posts.length === 0 ? (
          <p className="text-stone-light">No scribbles in cave wall yet.</p>
        ) : (
          <div className="space-y-2">
            {posts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-3 bg-stone-dark/30 rounded-stone p-3"
              >
                <div className="min-w-0">
                  <p className="font-grug text-sand text-sm truncate">{p.title}</p>
                  <p className="text-xs text-stone-light truncate">/{p.slug}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => togglePinned(p)}
                    className={`text-xs px-3 py-2 rounded-stone border transition-colors ${
                      p.pinned
                        ? 'border-fire text-fire hover:bg-fire/10'
                        : 'border-stone-dark text-stone-light hover:text-sand hover:bg-stone-dark/40'
                    }`}
                  >
                    {p.pinned ? 'Pinned' : 'Pin'}
                  </button>

                  <button
                    onClick={() => startEdit(p)}
                    className="text-xs px-3 py-2 rounded-stone border border-stone-dark text-stone-light hover:text-sand hover:bg-stone-dark/40 transition-colors"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(p)}
                    className="text-xs px-3 py-2 rounded-stone border border-blood/40 text-blood hover:bg-blood/10 transition-colors"
                    disabled={saving}
                  >
                    Delete
                  </button>

                  <Link href={`/scribbles/${p.slug}`} className="text-xs text-fire hover:underline">
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
