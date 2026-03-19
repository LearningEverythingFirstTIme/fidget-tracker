'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { FIDGET_BRANDS } from '@/lib/brands';

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [item, setItem] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/items').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([items, cats]) => {
      const found = items.find((i: any) => i.id === id);
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
    <div className="min-h-screen flex items-center justify-center bg-paper">
      <div className="text-center">
        <span className="material-symbols-outlined icon-xl animate-pulse" style={{ color: 'var(--accent)' }}>hourglass_empty</span>
        <p className="label mt-4">Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-10 bg-paper">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-6 border-b-3 border-charcoal">
          <Link href="/" className="btn btn-ghost px-3 py-2">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-display text-2xl" style={{ color: 'var(--charcoal)' }}>
              Edit Item
            </h1>
            <p className="label">
              Modifying: {item.name}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="card space-y-8">
          {/* Section: Basic Info */}
          <div className="pb-6 border-b-3 border-charcoal">
            <h2 className="section-header">
              Basic Information
            </h2>
            <div className="space-y-5">
              <div>
                <label className="form-label">Name *</label>
                <input name="name" required defaultValue={item.name} className="w-full" />
              </div>

              <div>
                <label className="form-label">Category *</label>
                <select name="categoryId" required defaultValue={item.categoryId} className="w-full">
                  {categories.map((cat: any) => (
                    <optgroup key={cat.id} label={cat.name}>
                      {cat.children?.map((child: any) => (
                        <option key={child.id} value={child.id}>{child.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="form-label">Brand</label>
                  <input 
                    name="brand" 
                    list="brand-list"
                    defaultValue={item.brand || ''} 
                    placeholder="Select or type brand..."
                    className="w-full" 
                    autoComplete="off"
                  />
                  <datalist id="brand-list">
                    {FIDGET_BRANDS.map((brand) => (
                      <option key={brand} value={brand} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <label className="form-label">Material</label>
                  <input name="material" defaultValue={item.material || ''} className="w-full" />
                </div>
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea name="description" rows={3} defaultValue={item.description || ''} className="w-full" />
              </div>
            </div>
          </div>

          {/* Section: Pricing */}
          <div className="pb-6 border-b-3 border-charcoal">
            <h2 className="section-header">
              Pricing
            </h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="form-label">Price Paid ($)</label>
                <input name="pricePaid" type="number" step="0.01" defaultValue={item.pricePaid || ''} className="w-full" />
              </div>
              <div>
                <label className="form-label">Current Value ($)</label>
                <input name="currentValue" type="number" step="0.01" defaultValue={item.currentValue || ''} className="w-full" />
              </div>
            </div>
          </div>

          {/* Section: Status */}
          <div className="pb-6 border-b-3 border-charcoal">
            <h2 className="section-header">
              Status
            </h2>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="form-label">Status</label>
                <select name="status" defaultValue={item.status} className="w-full">
                  <option value="OWNED">Owned</option>
                  <option value="WISHLIST">Wishlist</option>
                  <option value="SOLD">Sold</option>
                  <option value="TRADED">Traded</option>
                </select>
              </div>
              <div>
                <label className="form-label">Condition</label>
                <select name="condition" defaultValue={item.condition || ''} className="w-full">
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

          {/* Section: Media */}
          <div className="pb-6 border-b-3 border-charcoal">
            <h2 className="section-header">
              Media
            </h2>
            <div>
              <label className="form-label">Image URL</label>
              <input name="imageUrl" type="url" defaultValue={item.imageUrl || ''} className="w-full" />
            </div>
          </div>

          {/* Section: Specs */}
          <div className="pb-6 border-b-3 border-charcoal">
            <h2 className="section-header">
              Specifications
            </h2>
            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="form-label">Quantity</label>
                <input name="quantity" type="number" defaultValue={item.quantity || 1} min="1" className="w-full" />
              </div>
              <div>
                <label className="form-label">Weight (g)</label>
                <input name="weightGrams" type="number" step="0.1" defaultValue={item.weightGrams || ''} className="w-full" />
              </div>
              <div>
                <label className="form-label">Dimensions</label>
                <input name="dimensions" defaultValue={item.dimensions || ''} className="w-full" />
              </div>
            </div>
          </div>

          {/* Section: Additional */}
          <div className="pb-6">
            <h2 className="section-header">
              Additional Details
            </h2>
            <div className="space-y-5">
              <div>
                <label className="form-label">Purchase Source</label>
                <input name="purchaseSource" defaultValue={item.purchaseSource || ''} className="w-full" />
              </div>

              <div>
                <label className="form-label">Notes</label>
                <textarea name="notes" rows={2} defaultValue={item.notes || ''} className="w-full" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="btn btn-primary">
              <span className="material-symbols-outlined icon-sm">save</span>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/" className="btn btn-secondary">
              <span className="material-symbols-outlined icon-sm">close</span>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
