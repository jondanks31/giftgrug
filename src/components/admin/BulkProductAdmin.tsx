'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Card } from '@/components/ui';
import { categories } from '@/lib/grug-dictionary';
import type { Product } from '@/lib/database.types';
import { Plus, Trash2, Upload, AlertCircle, CheckCircle } from 'lucide-react';

interface BulkRow {
  id: string;
  grug_name: string;
  real_name: string;
  category: string;
  price: string;
  amazon_url: string;
  image_url: string;
  grug_says: string;
  is_panic_product: boolean;
  product_type: 'merch' | 'affiliate' | 'own';
  error?: string;
}

const createEmptyRow = (): BulkRow => ({
  id: crypto.randomUUID(),
  grug_name: '',
  real_name: '',
  category: 'shiny-rocks-string',
  price: '',
  amazon_url: '',
  image_url: '',
  grug_says: '',
  is_panic_product: false,
  product_type: 'affiliate',
});

// Calculate price range from price
function getPriceRange(price: number): Product['price_range'] {
  if (price <= 25) return 'few';
  if (price <= 50) return 'some';
  if (price <= 100) return 'many';
  if (price <= 200) return 'big-pile';
  return 'whole-cave';
}

const MAX_ROWS = 20;

interface BulkProductAdminProps {
  onComplete: () => void;
}

export function BulkProductAdmin({ onComplete }: BulkProductAdminProps) {
  const [rows, setRows] = useState<BulkRow[]>([createEmptyRow(), createEmptyRow(), createEmptyRow()]);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);
  const supabase = createClient();

  const addRow = () => {
    if (rows.length >= MAX_ROWS) return;
    setRows([...rows, createEmptyRow()]);
  };

  const removeRow = (id: string) => {
    if (rows.length <= 1) return;
    setRows(rows.filter(r => r.id !== id));
  };

  const updateRow = (id: string, field: keyof BulkRow, value: string | boolean) => {
    setRows(rows.map(r => r.id === id ? { ...r, [field]: value, error: undefined } : r));
  };

  // Handle paste from spreadsheet
  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    const lines = pastedText.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) return;
    
    // Check if it looks like tab-separated data
    if (!lines[0].includes('\t')) return;
    
    e.preventDefault();
    
    const newRows: BulkRow[] = [];
    
    for (const line of lines) {
      const cols = line.split('\t');
      if (cols.length >= 5) { // Minimum required columns
        newRows.push({
          id: crypto.randomUUID(),
          grug_name: cols[0]?.trim() || '',
          real_name: cols[1]?.trim() || '',
          category: cols[2]?.trim() || 'shiny-rocks-string',
          price: cols[3]?.trim() || '',
          amazon_url: cols[4]?.trim() || '',
          image_url: cols[5]?.trim() || '',
          grug_says: cols[6]?.trim() || '',
          is_panic_product: cols[7]?.toLowerCase().trim() === 'true',
          product_type: (cols[8]?.trim() as 'merch' | 'affiliate' | 'own') || 'affiliate',
        });
      }
    }
    
    if (newRows.length > 0) {
      // Replace empty rows or append
      const nonEmptyExisting = rows.filter(r => r.grug_name || r.real_name || r.amazon_url);
      const combined = [...nonEmptyExisting, ...newRows].slice(0, MAX_ROWS);
      setRows(combined.length > 0 ? combined : [createEmptyRow()]);
    }
  };

  // Validate a row
  const validateRow = (row: BulkRow): string | undefined => {
    if (!row.grug_name.trim()) return 'Grug name required';
    if (!row.real_name.trim()) return 'Real name required';
    if (!row.category) return 'Category required';
    if (!row.price || isNaN(parseFloat(row.price))) return 'Valid price required';
    if (!row.amazon_url.trim()) return 'Amazon URL required';
    return undefined;
  };

  // Submit all rows
  const handleSubmit = async () => {
    // Filter out completely empty rows
    const filledRows = rows.filter(r => r.grug_name || r.real_name || r.amazon_url);
    
    if (filledRows.length === 0) {
      alert('No products to add!');
      return;
    }

    // Validate all rows
    let hasErrors = false;
    const validatedRows = filledRows.map(row => {
      const error = validateRow(row);
      if (error) hasErrors = true;
      return { ...row, error };
    });
    
    setRows(validatedRows);
    
    if (hasErrors) {
      return;
    }

    setSaving(true);
    setResult(null);

    // Prepare products for insert
    const products = validatedRows.map(row => ({
      grug_name: row.grug_name.trim(),
      real_name: row.real_name.trim(),
      category: row.category,
      price: parseFloat(row.price),
      price_range: getPriceRange(parseFloat(row.price)),
      amazon_url: row.amazon_url.trim(),
      image_url: row.image_url.trim() || null,
      grug_says: row.grug_says.trim() || 'Grug think this good thing.',
      is_panic_product: row.is_panic_product,
      is_grug_pick: false,
      is_active: true,
      tags: [],
      product_type: row.product_type || 'affiliate',
    }));

    // Batch insert
    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select();

    setSaving(false);

    if (error) {
      setResult({ success: 0, failed: products.length });
      alert(`Error: ${error.message}`);
    } else {
      setResult({ success: data?.length || 0, failed: 0 });
      // Clear rows after success
      setRows([createEmptyRow(), createEmptyRow(), createEmptyRow()]);
      // Notify parent to refresh
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-cave-light/50 rounded-stone p-3 text-sm text-stone-light">
        <p className="font-grug text-sand mb-2">📋 Bulk Add Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Paste from spreadsheet (tab-separated) to auto-fill rows</li>
          <li>Column order: Grug Name, Real Name, Category, Price, Amazon URL, Image URL, Grug Says, Panic (true/false)</li>
          <li>Max {MAX_ROWS} products at once</li>
        </ul>
      </div>

      {/* Result message */}
      {result && (
        <div className={`flex items-center gap-2 p-3 rounded-stone ${result.success > 0 ? 'bg-moss/20 text-moss-light' : 'bg-blood/20 text-blood'}`}>
          {result.success > 0 ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>
            {result.success > 0 
              ? `Grug added ${result.success} things! 🎉` 
              : `Failed to add products`}
          </span>
        </div>
      )}

      {/* Table */}
      <div 
        className="overflow-x-auto"
        onPaste={handlePaste}
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-dark">
              <th className="text-left p-2 text-stone-light font-normal">Grug Name *</th>
              <th className="text-left p-2 text-stone-light font-normal">Real Name *</th>
              <th className="text-left p-2 text-stone-light font-normal">Category *</th>
              <th className="text-left p-2 text-stone-light font-normal w-20">Price *</th>
              <th className="text-left p-2 text-stone-light font-normal">Amazon URL *</th>
              <th className="text-left p-2 text-stone-light font-normal">Image URL</th>
              <th className="text-left p-2 text-stone-light font-normal">Grug Says</th>
              <th className="text-center p-2 text-stone-light font-normal w-16">Panic?</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className={`border-b border-stone-dark/50 ${row.error ? 'bg-blood/10' : ''}`}>
                <td className="p-1">
                  <input
                    type="text"
                    value={row.grug_name}
                    onChange={(e) => updateRow(row.id, 'grug_name', e.target.value)}
                    className="w-full bg-cave-light border border-stone-dark rounded px-2 py-1 text-bone text-sm focus:border-fire outline-none"
                    placeholder="Shiny Rock"
                  />
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    value={row.real_name}
                    onChange={(e) => updateRow(row.id, 'real_name', e.target.value)}
                    className="w-full bg-cave-light border border-stone-dark rounded px-2 py-1 text-bone text-sm focus:border-fire outline-none"
                    placeholder="Gold Necklace"
                  />
                </td>
                <td className="p-1">
                  <select
                    value={row.category}
                    onChange={(e) => updateRow(row.id, 'category', e.target.value)}
                    className="w-full bg-cave-light border border-stone-dark rounded px-2 py-1 text-bone text-sm focus:border-fire outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.grugName}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-1">
                  <input
                    type="number"
                    value={row.price}
                    onChange={(e) => updateRow(row.id, 'price', e.target.value)}
                    className="w-full bg-cave-light border border-stone-dark rounded px-2 py-1 text-bone text-sm focus:border-fire outline-none"
                    placeholder="29.99"
                    step="0.01"
                  />
                </td>
                <td className="p-1">
                  <input
                    type="url"
                    value={row.amazon_url}
                    onChange={(e) => updateRow(row.id, 'amazon_url', e.target.value)}
                    className="w-full bg-cave-light border border-stone-dark rounded px-2 py-1 text-bone text-sm focus:border-fire outline-none"
                    placeholder="https://amazon.co.uk/..."
                  />
                </td>
                <td className="p-1">
                  <input
                    type="url"
                    value={row.image_url}
                    onChange={(e) => updateRow(row.id, 'image_url', e.target.value)}
                    className="w-full bg-cave-light border border-stone-dark rounded px-2 py-1 text-bone text-sm focus:border-fire outline-none"
                    placeholder="https://..."
                  />
                </td>
                <td className="p-1">
                  <input
                    type="text"
                    value={row.grug_says}
                    onChange={(e) => updateRow(row.id, 'grug_says', e.target.value)}
                    className="w-full bg-cave-light border border-stone-dark rounded px-2 py-1 text-bone text-sm focus:border-fire outline-none"
                    placeholder="Grug like this..."
                  />
                </td>
                <td className="p-1 text-center">
                  <input
                    type="checkbox"
                    checked={row.is_panic_product}
                    onChange={(e) => updateRow(row.id, 'is_panic_product', e.target.checked)}
                    className="w-4 h-4 accent-fire"
                  />
                </td>
                <td className="p-1">
                  <button
                    onClick={() => removeRow(row.id)}
                    className="p-1 text-stone-light hover:text-blood transition-colors"
                    title="Remove row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Row error messages */}
      {rows.some(r => r.error) && (
        <div className="text-blood text-sm space-y-1">
          {rows.map((r, i) => r.error && (
            <p key={r.id}>Row {i + 1}: {r.error}</p>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          onClick={addRow}
          disabled={rows.length >= MAX_ROWS}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Row ({rows.length}/{MAX_ROWS})
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          {saving ? 'Grug adding...' : `Add ${rows.filter(r => r.grug_name || r.real_name).length} Products`}
        </Button>
      </div>
    </div>
  );
}
