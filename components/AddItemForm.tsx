'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X, Save } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  children: { id: string; name: string }[];
}

interface AddItemFormProps {
  categories: Category[];
}

export default function AddItemForm({ categories }: AddItemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    router.push('/');
    router.refresh();
  }

  return (
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
            <input 
              name="name" 
              required 
              placeholder="Enter item name..."
              className="w-full" 
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
              CATEGORY *
            </label>
            <select name="categoryId" required className="w-full">
              <option value="">SELECT_CATEGORY</option>
              {categories.map((cat) => (
                <optgroup key={cat.id} label={cat.name}>
                  {cat.children.map((child) => (
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
              <input name="brand" placeholder="Manufacturer..." className="w-full" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
                MATERIAL
              </label>
              <input name="material" placeholder="Titanium, Brass, Steel..." className="w-full" />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
              DESCRIPTION
            </label>
            <textarea name="description" rows={3} placeholder="Describe this item..." className="w-full" />
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
            <input name="pricePaid" type="number" step="0.01" placeholder="0.00" className="w-full" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
              CURRENT_VALUE ($)
            </label>
            <input name="currentValue" type="number" step="0.01" placeholder="0.00" className="w-full" />
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
            <select name="status" className="w-full">
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
            <select name="condition" className="w-full">
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
          <input name="imageUrl" type="url" placeholder="https://..." className="w-full" />
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
            <input name="quantity" type="number" defaultValue="1" min="1" className="w-full" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
              WEIGHT (g)
            </label>
            <input name="weightGrams" type="number" step="0.1" placeholder="0.0" className="w-full" />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
              DIMENSIONS
            </label>
            <input name="dimensions" placeholder="50x30mm" className="w-full" />
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
            <input name="purchaseSource" placeholder="Etsy, Direct from maker, Amazon..." className="w-full" />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--foreground-muted)' }}>
              NOTES
            </label>
            <textarea name="notes" rows={2} placeholder="Additional notes..." className="w-full" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button type="submit" disabled={loading} className="btn btn-primary">
          <Plus className="h-4 w-4" />
          {loading ? 'ADDING...' : 'ADD_TO_COLLECTION'}
        </button>
        <button 
          type="button" 
          onClick={() => router.push('/')} 
          className="btn btn-secondary"
        >
          <X className="h-4 w-4" />
          CANCEL
        </button>
      </div>
    </form>
  );
}
