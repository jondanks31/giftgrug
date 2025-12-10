'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui';
import { categories as allCategories } from '@/lib/grug-dictionary';
import { Eye, EyeOff, GripVertical } from 'lucide-react';

interface CategoryStatus {
  id: string;
  is_enabled: boolean;
  display_order: number;
}

export function CategoryAdmin() {
  const [categoryStatuses, setCategoryStatuses] = useState<CategoryStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('display_order', { ascending: true });

    if (data) {
      setCategoryStatuses(data);
    }
    setLoading(false);
  }

  async function toggleCategory(categoryId: string, currentStatus: boolean) {
    setSaving(categoryId);
    
    const { error } = await supabase
      .from('categories')
      .update({ is_enabled: !currentStatus, updated_at: new Date().toISOString() })
      .eq('id', categoryId);

    if (!error) {
      setCategoryStatuses(prev => 
        prev.map(cat => 
          cat.id === categoryId ? { ...cat, is_enabled: !currentStatus } : cat
        )
      );
    }
    
    setSaving(null);
  }

  // Get category details from dictionary
  function getCategoryDetails(id: string) {
    return allCategories.find(c => c.id === id);
  }

  // Count enabled categories
  const enabledCount = categoryStatuses.filter(c => c.is_enabled).length;

  if (loading) {
    return <p className="text-stone-light">Loading categories...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-stone-light">
          Toggle categories on/off. Disabled categories won't show on homepage or in search.
        </p>
        <span className="text-sm text-fire font-grug">
          {enabledCount}/{categoryStatuses.length} on
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {categoryStatuses.map(status => {
          const details = getCategoryDetails(status.id);
          if (!details) return null;

          return (
            <button
              key={status.id}
              onClick={() => toggleCategory(status.id, status.is_enabled)}
              disabled={saving === status.id}
              className={`
                flex items-center justify-between p-3 rounded-stone transition-all
                ${status.is_enabled 
                  ? 'bg-moss/20 border border-moss/40 hover:bg-moss/30' 
                  : 'bg-stone-dark/50 border border-stone-dark hover:bg-stone-dark'
                }
                ${saving === status.id ? 'opacity-50' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{details.emoji}</span>
                <div className="text-left">
                  <p className={`font-grug text-sm ${status.is_enabled ? 'text-sand' : 'text-stone-light'}`}>
                    {details.grugName}
                  </p>
                  <p className="text-xs text-stone-light/60">
                    {details.realName}
                  </p>
                </div>
              </div>
              
              {status.is_enabled ? (
                <Eye className="w-5 h-5 text-moss" />
              ) : (
                <EyeOff className="w-5 h-5 text-stone-light/40" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
