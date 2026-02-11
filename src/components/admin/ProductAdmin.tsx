'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Card } from '@/components/ui';
import { categories } from '@/lib/grug-dictionary';
import type { Product } from '@/lib/database.types';
import { Plus, Pencil, Trash2, X, Save, ChevronDown, ChevronUp, Table, FileText, PenTool } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { CategoryAdmin } from './CategoryAdmin';
import { BulkProductAdmin } from './BulkProductAdmin';

const ASSOCIATE_ID = 'giftgrug-21';

interface ProductFormData {
  grug_name: string;
  real_name: string;
  category: string;
  price_range: Product['price_range'];
  price: number;
  amazon_url: string;
  amazon_asin: string;
  image_url: string;
  grug_says: string;
  is_grug_pick: boolean;
  is_panic_product: boolean;
  is_active: boolean;
  tags: string;
  product_type: 'merch' | 'affiliate' | 'own';
}

const emptyForm: ProductFormData = {
  grug_name: '',
  real_name: '',
  category: 'shiny-rocks-string',
  price_range: 'many',
  price: 0,
  amazon_url: '',
  amazon_asin: '',
  image_url: '',
  grug_says: '',
  is_grug_pick: false,
  is_panic_product: false,
  is_active: true,
  tags: '',
  product_type: 'affiliate',
};

export function ProductAdmin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [bulkMode, setBulkMode] = useState(false);
  const supabase = createClient();

  // Load products
  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setProducts(data);
    setLoading(false);
  }

  // Auto-add affiliate tag to Amazon URL
  function processAmazonUrl(url: string): string {
    if (!url) return url;
    try {
      const urlObj = new URL(url);
      // Extract ASIN if present
      const asinMatch = url.match(/\/dp\/([A-Z0-9]{10})/i) || url.match(/\/gp\/product\/([A-Z0-9]{10})/i);
      if (asinMatch) {
        return `https://www.amazon.co.uk/dp/${asinMatch[1]}?tag=${ASSOCIATE_ID}`;
      }
      // Just add tag to existing URL
      urlObj.searchParams.set('tag', ASSOCIATE_ID);
      return urlObj.toString();
    } catch {
      return url;
    }
  }

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const productData = {
      grug_name: formData.grug_name,
      real_name: formData.real_name,
      category: formData.category,
      price_range: formData.price_range,
      price: formData.price,
      amazon_url: processAmazonUrl(formData.amazon_url),
      amazon_asin: formData.amazon_asin || null,
      image_url: formData.image_url || null,
      grug_says: formData.grug_says,
      is_grug_pick: formData.is_grug_pick,
      is_panic_product: formData.is_panic_product,
      is_active: formData.is_active,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      product_type: formData.product_type,
    };

    if (editingId) {
      // Update
      await supabase.from('products').update(productData).eq('id', editingId);
    } else {
      // Insert
      await supabase.from('products').insert(productData);
    }

    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    loadProducts();
  }

  // Edit product
  function handleEdit(product: Product) {
    setFormData({
      grug_name: product.grug_name,
      real_name: product.real_name,
      category: product.category,
      price_range: product.price_range,
      price: product.price,
      amazon_url: product.amazon_url,
      amazon_asin: product.amazon_asin || '',
      image_url: product.image_url || '',
      grug_says: product.grug_says,
      is_grug_pick: product.is_grug_pick,
      is_panic_product: product.is_panic_product,
      is_active: product.is_active,
      tags: product.tags.join(', '),
      product_type: product.product_type || 'affiliate',
    });
    setEditingId(product.id);
    setShowForm(true);
  }

  // Delete product
  async function handleDelete(id: string) {
    if (!confirm('Grug sure want delete this thing?')) return;
    await supabase.from('products').delete().eq('id', id);
    loadProducts();
  }

  if (loading) {
    return <p className="text-stone-light">Grug loading products...</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="font-grug text-xl text-fire">🛠️ GRUG ADMIN TOOLS</h2>

      <Card className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <p className="font-grug text-lg text-sand flex items-center gap-2">
            <PenTool className="w-5 h-5" /> Scribbles
          </p>
          <p className="text-sm text-stone-light">
            Make new scribbles and pin "Grug favourite" ones.
          </p>
        </div>
        <Link href="/admin/scribbles" className="w-full sm:w-auto">
          <Button variant="secondary" className="w-full sm:w-auto">
            Open Scribbles Admin
          </Button>
        </Link>
      </Card>

      {/* Category Management - Collapsible */}
      <Card className="p-4">
        <button
          onClick={() => setShowCategories(!showCategories)}
          className="w-full flex items-center justify-between text-left"
        >
          <span className="font-grug text-lg text-sand">📦 Category Caves</span>
          {showCategories ? (
            <ChevronUp className="w-5 h-5 text-stone-light" />
          ) : (
            <ChevronDown className="w-5 h-5 text-stone-light" />
          )}
        </button>
        {showCategories && (
          <div className="mt-4 pt-4 border-t border-stone-dark">
            <CategoryAdmin />
          </div>
        )}
      </Card>

      {/* Products Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-grug text-lg text-sand">🎁 Products</h3>
          <div className="flex items-center gap-3">
            {/* Mode Toggle */}
            <div className="flex items-center bg-cave-light rounded-stone p-1">
              <button
                onClick={() => setBulkMode(false)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${
                  !bulkMode ? 'bg-fire text-cave-dark' : 'text-stone-light hover:text-sand'
                }`}
              >
                <FileText className="w-4 h-4" />
                Single
              </button>
              <button
                onClick={() => setBulkMode(true)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm transition-colors ${
                  bulkMode ? 'bg-fire text-cave-dark' : 'text-stone-light hover:text-sand'
                }`}
              >
                <Table className="w-4 h-4" />
                Bulk
              </button>
            </div>
            {!bulkMode && (
              <Button onClick={() => { setShowForm(true); setEditingId(null); setFormData(emptyForm); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Thing
              </Button>
            )}
          </div>
        </div>

      {/* Bulk Mode */}
      {bulkMode ? (
        <BulkProductAdmin onComplete={() => { loadProducts(); setBulkMode(false); }} />
      ) : (
        <>
      {/* Product Form */}
      {showForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-grug text-lg text-sand">
              {editingId ? 'Edit Thing' : 'Add New Thing'}
            </h3>
            <button onClick={() => setShowForm(false)} className="text-stone-light hover:text-bone">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Grug Name */}
              <div>
                <label className="block text-sm text-stone-light mb-1">Grug Name *</label>
                <Input
                  required
                  value={formData.grug_name}
                  onChange={(e) => setFormData({ ...formData, grug_name: e.target.value })}
                  placeholder="Shiny Rock on String"
                />
              </div>

              {/* Real Name */}
              <div>
                <label className="block text-sm text-stone-light mb-1">Real Name *</label>
                <Input
                  required
                  value={formData.real_name}
                  onChange={(e) => setFormData({ ...formData, real_name: e.target.value })}
                  placeholder="Gold Heart Pendant Necklace"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm text-stone-light mb-1">Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-cave w-full"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.emoji} {cat.grugName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Product Type */}
              <div>
                <label className="block text-sm text-stone-light mb-1">Product Type *</label>
                <select
                  required
                  value={formData.product_type}
                  onChange={(e) => setFormData({ ...formData, product_type: e.target.value as 'merch' | 'affiliate' | 'own' })}
                  className="input-cave w-full"
                >
                  <option value="affiliate">🔗 Affiliate (Amazon)</option>
                  <option value="merch">👕 Merch (Print-on-Demand)</option>
                  <option value="own">🪨 Own Product (Stripe)</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm text-stone-light mb-1">Price Range *</label>
                <select
                  required
                  value={formData.price_range}
                  onChange={(e) => setFormData({ ...formData, price_range: e.target.value as Product['price_range'] })}
                  className="input-cave w-full"
                >
                  <option value="few">🪙 Few Coins (£0-25)</option>
                  <option value="some">🪙🪙 Some Coins (£25-50)</option>
                  <option value="many">🪙🪙🪙 Many Coins (£50-100)</option>
                  <option value="big-pile">🪙🪙🪙🪙 Big Pile (£100-250)</option>
                  <option value="whole-cave">🪙🪙🪙🪙🪙 Whole Cave (£250+)</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm text-stone-light mb-1">Price (£) *</label>
                <Input
                  required
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  placeholder="79.99"
                />
              </div>

              {/* Amazon URL */}
              <div>
                <label className="block text-sm text-stone-light mb-1">Amazon URL *</label>
                <Input
                  required
                  value={formData.amazon_url}
                  onChange={(e) => setFormData({ ...formData, amazon_url: e.target.value })}
                  placeholder="https://amazon.co.uk/dp/..."
                />
                <p className="text-xs text-stone-light mt-1">Affiliate tag added automatically</p>
              </div>

              {/* Product Image */}
              <div className="md:col-span-2">
                <label className="block text-sm text-stone-light mb-1">Product Image</label>
                <ImageUpload
                  currentUrl={formData.image_url || null}
                  onUpload={(url) => setFormData({ ...formData, image_url: url })}
                  onRemove={() => setFormData({ ...formData, image_url: '' })}
                />
              </div>

              {/* Grug Says */}
              <div className="md:col-span-2">
                <label className="block text-sm text-stone-light mb-1">Grug Says * (funny quote)</label>
                <textarea
                  required
                  value={formData.grug_says}
                  onChange={(e) => setFormData({ ...formData, grug_says: e.target.value })}
                  placeholder="Womanfolk see this, make happy water come from eyes."
                  className="input-cave w-full min-h-[80px]"
                />
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-sm text-stone-light mb-1">Tags (comma separated)</label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="romantic, anniversary, birthday"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_grug_pick}
                    onChange={(e) => setFormData({ ...formData, is_grug_pick: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sand">Grug Pick ⭐</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_panic_product}
                    onChange={(e) => setFormData({ ...formData, is_panic_product: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sand">Panic Mode 🚨</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-sand">Active (show on site)</span>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Thing'}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Products List */}
      <div className="space-y-3">
        <p className="text-stone-light">{products.length} things in cave</p>
        
        {products.map(product => (
          <div
            key={product.id}
            className={`flex items-center justify-between p-4 rounded-stone ${
              product.is_active ? 'bg-stone-dark' : 'bg-stone-dark/50 opacity-60'
            }`}
          >
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <span className="font-grug text-sand">{product.grug_name}</span>
                {product.is_grug_pick && <span className="text-fire">⭐</span>}
                {!product.is_active && <span className="text-xs text-stone-light">(hidden)</span>}
              </div>
              <p className="text-sm text-stone-light">
                {product.real_name} • £{product.price} • {product.category}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(product)}
                className="p-2 text-sand hover:text-fire transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(product.id)}
                className="p-2 text-sand hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <p className="text-center text-stone-light py-8">
            No things yet. Click "Add Thing" to add first product!
          </p>
        )}
      </div>
        </>
      )}
      </Card>
    </div>
  );
}
