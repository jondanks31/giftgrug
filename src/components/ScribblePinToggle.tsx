'use client';

import { useEffect, useState } from 'react';
import { Pin, PinOff } from 'lucide-react';
import { Button } from '@/components/ui';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/components/auth';

export function ScribblePinToggle({
  slug,
  pinned,
}: {
  slug: string;
  pinned: boolean;
}) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    async function checkAdmin() {
      if (!user) {
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (mounted) {
        setIsAdmin(Boolean(data?.is_admin));
        setLoading(false);
      }
    }

    checkAdmin();

    return () => {
      mounted = false;
    };
  }, [user]);

  const togglePin = async () => {
    if (!isAdmin) return;

    setSaving(true);
    const nextPinned = !pinned;

    const { error } = await supabase
      .from('scribbles_posts')
      .update({
        pinned: nextPinned,
        pinned_at: nextPinned ? new Date().toISOString() : null,
        pinned_order: nextPinned ? null : null,
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug);

    if (error) {
      console.error('Pin toggle failed:', error);
    } else {
      window.location.reload();
    }

    setSaving(false);
  };

  if (loading) return null;
  if (!user || !isAdmin) return null;

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={togglePin}
      disabled={saving}
      className="flex items-center gap-2"
      title={pinned ? 'Unpin' : 'Pin'}
    >
      {pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
      {pinned ? 'Unpin' : 'Pin'}
    </Button>
  );
}
