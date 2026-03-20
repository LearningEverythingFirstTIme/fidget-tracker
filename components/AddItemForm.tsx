'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FIDGET_BRANDS } from '@/lib/brands';
import { Plus, X } from 'lucide-react';

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
              placeholder="Enter item name..."
              className="w-full input-box"
            />
          </div>

          <div>
            <label className="label mb-3 block">Category *</label>
            <select name="categoryId" required className="w-full input-box">
              <option value="">Select category</option>
              {categories.map((cat) => (
                <optgroup key={cat.id} label={cat.name}>
                  {cat.children.map((child) => (
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
              <input name="material" placeholder="Titanium, Brass, Steel..." className="w-full input-box" />
            </div>
          </div>

          <div>
            <label className="label mb-3 block">Description</label>
            <textarea name="description" rows={3} placeholder="Describe this item..." className="w-full input-box" />
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
            <input name="pricePaid" type="number" step="0.01" placeholder="0.00" className="w-full input-box" />
          </div>
          <div>
            <label className="label mb-3 block">Current Value ($)</label>
            <input name="currentValue" type="number" step="0.01" placeholder="0.00" className="w-full input-box" />
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
            <select name="status" className="w-full input-box">
              <option value="OWNED">Owned</option>
              <option value="WISHLIST">Wishlist</option>
              <option value="SOLD">Sold</option>
              <option value="TRADED">Traded</option>
            </select>
          </div>
          <div>
            <label className="label mb-3 block">Condition</label>
            <select name="condition" className="w-full input-box">
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
          <input name="imageUrl" type="url" placeholder="https://..." className="w-full input-box" />
        </div>
      </div>

      <div className="pb-8" style={{ borderBottom: '1px solid rgba(68, 71, 72, 0.15)' }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--primary)' }}>
          Specifications
        </p>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="label mb-3 block">Quantity</label>
            <input name="quantity" type="number" defaultValue="1" min="1" className="w-full input-box" />
          </div>
          <div>
            <label className="label mb-3 block">Weight (g)</label>
            <input name="weightGrams" type="number" step="0.1" placeholder="0.0" className="w-full input-box" />
          </div>
          <div>
            <label className="label mb-3 block">Dimensions</label>
            <input name="dimensions" placeholder="50x30mm" className="w-full input-box" />
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
            <input name="purchaseSource" placeholder="Etsy, Direct from maker, Amazon..." className="w-full input-box" />
          </div>

          <div>
            <label className="label mb-3 block">Notes</label>
            <textarea name="notes" rows={2} placeholder="Additional notes..." className="w-full input-box" />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button type="submit" disabled={loading} className="btn btn-primary">
          <Plus className="h-4 w-4" />
          {loading ? 'Adding...' : 'Add to Collection'}
        </button>
        <button 
          type="button" 
          onClick={() => router.push('/')} 
          className="btn btn-secondary"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>
    </form>
  );
}
