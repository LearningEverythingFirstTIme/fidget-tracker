'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FIDGET_BRANDS } from '@/lib/brands';
import { ChevronLeft, Save, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  children: { id: string; name: string }[];
}

interface Item {
  id: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  pricePaid: number | null;
  currentValue: number | null;
  status: string;
  condition: string | null;
  categoryId: string;
  category: { name: string } | null;
  material: string | null;
  description: string | null;
  quantity: number | null;
  weightGrams: number | null;
  dimensions: string | null;
  purchaseSource: string | null;
  notes: string | null;
}

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<Item | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/items').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([items, cats]) => {
      const found = items.find((i: Item) => i.id === id);
      setItem(found);
      setCategories(cats);
    });
  }, [id]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    await fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    router.push('/');
    router.refresh();
  }

  if (!item) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 mx-auto mb-4 animate-pulse" style={{ background: 'var(--primary)', borderRadius: '50%' }}></div>
        <p className="label" style={{ color: 'var(--on-surface-variant)' }}>Loading entry...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8 pb-6" style={{ borderBottom: '1px solid rgba(68, 71, 72, 0.15)' }}>
          <Link href="/" className="btn btn-ghost">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
          <div>
            <p className="text-lg font-bold uppercase tracking-wider" style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-headline)' }}>
              Edit Entry
            </p>
            <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--on-surface-variant)' }}>
              Modifying: {item.name}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="card card-elevated space-y-10">
          <div className="pb-8" style={{ borderBottom: '1px solid rgba(68, 71, 72, 0.15)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--primary)' }}>
              Basic Information
            </p>
            <div className="space-y-6">
              <div>
                <label className="label mb-3 block">Name *</label>
                <input 
                  name="name" 
                  required 
                  defaultValue={item.name}
                  className="w-full input-box"
                />
              </div>

              <div>
                <label className="label mb-3 block">Category *</label>
                <select name="categoryId" required defaultValue={item.categoryId} className="w-full input-box">
                  {categories.map((cat) => (
                    <optgroup key={cat.id} label={cat.name}>
                      {cat.children?.map((child) => (
                        <option key={child.id} value={child.id}>{child.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="label mb-3 block">Brand</label>
                  <input 
                    name="brand" 
                    list="brand-list"
                    defaultValue={item.brand || ''}
                    placeholder="Select or type brand..."
                    className="w-full input-box"
                    autoComplete="off"
                  />
                  <datalist id="brand-list">
                    {FIDGET_BRANDS.map((brand) => (
                      <option key={brand} value={brand} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="label mb-3 block">Material</label>
                  <input name="material" defaultValue={item.material || ''} className="w-full input-box" />
                </div>
              </div>

              <div>
                <label className="label mb-3 block">Description</label>
                <textarea name="description" rows={3} defaultValue={item.description || ''} className="w-full input-box" />
              </div>
            </div>
          </div>

          <div className="pb-8" style={{ borderBottom: '1px solid rgba(68, 71, 72, 0.15)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--primary)' }}>
              Pricing
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="label mb-3 block">Price Paid ($)</label>
                <input name="pricePaid" type="number" step="0.01" defaultValue={item.pricePaid || ''} className="w-full input-box" />
              </div>
              <div>
                <label className="label mb-3 block">Current Value ($)</label>
                <input name="currentValue" type="number" step="0.01" defaultValue={item.currentValue || ''} className="w-full input-box" />
              </div>
            </div>
          </div>

          <div className="pb-8" style={{ borderBottom: '1px solid rgba(68, 71, 72, 0.15)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--primary)' }}>
              Status
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="label mb-3 block">Status</label>
                <select name="status" defaultValue={item.status} className="w-full input-box">
                  <option value="OWNED">Owned</option>
                  <option value="WISHLIST">Wishlist</option>
                  <option value="SOLD">Sold</option>
                  <option value="TRADED">Traded</option>
                </select>
              </div>
              <div>
                <label className="label mb-3 block">Condition</label>
                <select name="condition" defaultValue={item.condition || ''} className="w-full input-box">
                  <option value="">Not specified</option>
                  <option value="NEW">New</option>
                  <option value="LIKE_NEW">Like New</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                  <option value="POOR">Poor</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pb-8" style={{ borderBottom: '1px solid rgba(68, 71, 72, 0.15)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--primary)' }}>
              Media
            </p>
            <div>
              <label className="label mb-3 block">Image URL</label>
              <input name="imageUrl" type="url" defaultValue={item.imageUrl || ''} className="w-full input-box" />
            </div>
          </div>

          <div className="pb-8" style={{ borderBottom: '1px solid rgba(68, 71, 72, 0.15)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--primary)' }}>
              Specifications
            </p>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="label mb-3 block">Quantity</label>
                <input name="quantity" type="number" defaultValue={item.quantity || 1} min="1" className="w-full input-box" />
              </div>
              <div>
                <label className="label mb-3 block">Weight (g)</label>
                <input name="weightGrams" type="number" step="0.1" defaultValue={item.weightGrams || ''} className="w-full input-box" />
              </div>
              <div>
                <label className="label mb-3 block">Dimensions</label>
                <input name="dimensions" defaultValue={item.dimensions || ''} className="w-full input-box" />
              </div>
            </div>
          </div>

          <div className="pb-8">
            <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--primary)' }}>
              Additional Details
            </p>
            <div className="space-y-6">
              <div>
                <label className="label mb-3 block">Purchase Source</label>
                <input name="purchaseSource" defaultValue={item.purchaseSource || ''} className="w-full input-box" />
              </div>

              <div>
                <label className="label mb-3 block">Notes</label>
                <textarea name="notes" rows={2} defaultValue={item.notes || ''} className="w-full input-box" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Save className="h-4 w-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/" className="btn btn-secondary">
              <X className="h-4 w-4" />
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
