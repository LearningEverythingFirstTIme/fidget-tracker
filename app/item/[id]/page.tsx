'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Save, X, Terminal } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Terminal className="h-8 w-8 mx-auto mb-4 animate-pulse" style={{ color: 'var(--accent)' }} />
        <p className="text-sm uppercase tracking-widest" style={{ color: 'var(--foreground-muted)' }}>LOADING_ENTRY...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <Link href="/" className="btn btn-secondary text-xs px-3 py-2">
            <ChevronLeft className="h-4 w-4" />
            BACK
          </Link>
          <div>
            <h1 className="text-lg font-bold uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>
              EDIT_ENTRY
            </h1>
            <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>
              Modifying: {item.name}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 card">
          {/* Section: Basic Info */}
          <div className="pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
              // BASIC_INFO
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  NAME *
                </label>
                <input name="name" required defaultValue={item.name} className="w-full" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  CATEGORY *
                </label>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
                    BRAND
                  </label>
                  <input name="brand" defaultValue={item.brand || ''} className="w-full" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
                    MATERIAL
                  </label>
                  <input name="material" defaultValue={item.material || ''} className="w-full" />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  DESCRIPTION
                </label>
                <textarea name="description" rows={3} defaultValue={item.description || ''} className="w-full" />
              </div>
            </div>
          </div>

          {/* Section: Pricing */}
          <div className="pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
              // PRICING
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  PRICE_PAID ($)
                </label>
                <input name="pricePaid" type="number" step="0.01" defaultValue={item.pricePaid || ''} className="w-full" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  CURRENT_VALUE ($)
                </label>
                <input name="currentValue" type="number" step="0.01" defaultValue={item.currentValue || ''} className="w-full" />
              </div>
            </div>
          </div>

          {/* Section: Status */}
          <div className="pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
              // STATUS
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  STATUS
                </label>
                <select name="status" defaultValue={item.status} className="w-full">
                  <option value="OWNED">OWNED</option>
                  <option value="WISHLIST">WISHLIST</option>
                  <option value="SOLD">SOLD</option>
                  <option value="TRADED">TRADED</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  CONDITION
                </label>
                <select name="condition" defaultValue={item.condition || ''} className="w-full">
                  <option value="">NOT_SPECIFIED</option>
                  <option value="NEW">NEW</option>
                  <option value="LIKE_NEW">LIKE_NEW</option>
                  <option value="GOOD">GOOD</option>
                  <option value="FAIR">FAIR</option>
                  <option value="POOR">POOR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section: Media */}
          <div className="pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
              // MEDIA
            </h2>
            <div>
              <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
                IMAGE_URL
              </label>
              <input name="imageUrl" type="url" defaultValue={item.imageUrl || ''} className="w-full" />
            </div>
          </div>

          {/* Section: Specs */}
          <div className="pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
              // SPECIFICATIONS
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  QTY
                </label>
                <input name="quantity" type="number" defaultValue={item.quantity || 1} min="1" className="w-full" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  WEIGHT (g)
                </label>
                <input name="weightGrams" type="number" step="0.1" defaultValue={item.weightGrams || ''} className="w-full" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  DIMENSIONS
                </label>
                <input name="dimensions" defaultValue={item.dimensions || ''} className="w-full" />
              </div>
            </div>
          </div>

          {/* Section: Additional */}
          <div className="pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
              // ADDITIONAL
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  PURCHASE_SOURCE
                </label>
                <input name="purchaseSource" defaultValue={item.purchaseSource || ''} className="w-full" />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
                  NOTES
                </label>
                <textarea name="notes" rows={2} defaultValue={item.notes || ''} className="w-full" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="btn btn-primary">
              <Save className="h-4 w-4" />
              {loading ? 'SAVING...' : 'SAVE_CHANGES'}
            </button>
            <Link href="/" className="btn btn-secondary">
              <X className="h-4 w-4" />
              CANCEL
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
