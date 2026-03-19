'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FIDGET_BRANDS } from '@/lib/brands';

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
    <form onSubmit={onSubmit} className="card space-y-8">
      {/* Section: Basic Info */}
      <div className="pb-6 border-b-3 border-charcoal">
        <h2 className="section-header">
          Basic Information
        </h2>
        <div className="space-y-5">
          <div>
            <label className="form-label">Name *</label>
            <input 
              name="name" 
              required 
              placeholder="Enter item name..."
              className="w-full" 
            />
          </div>

          <div>
            <label className="form-label">Category *</label>
            <select name="categoryId" required className="w-full">
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

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="form-label">Brand</label>
              <input 
                name="brand" 
                list="brand-list"
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
              <input name="material" placeholder="Titanium, Brass, Steel..." className="w-full" />
            </div>
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea name="description" rows={3} placeholder="Describe this item..." className="w-full" />
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
            <input name="pricePaid" type="number" step="0.01" placeholder="0.00" className="w-full" />
          </div>
          <div>
            <label className="form-label">Current Value ($)</label>
            <input name="currentValue" type="number" step="0.01" placeholder="0.00" className="w-full" />
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
            <select name="status" className="w-full">
              <option value="OWNED">Owned</option>
              <option value="WISHLIST">Wishlist</option>
              <option value="SOLD">Sold</option>
              <option value="TRADED">Traded</option>
            </select>
          </div>
          <div>
            <label className="form-label">Condition</label>
            <select name="condition" className="w-full">
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
          <input name="imageUrl" type="url" placeholder="https://..." className="w-full" />
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
            <input name="quantity" type="number" defaultValue="1" min="1" className="w-full" />
          </div>
          <div>
            <label className="form-label">Weight (g)</label>
            <input name="weightGrams" type="number" step="0.1" placeholder="0.0" className="w-full" />
          </div>
          <div>
            <label className="form-label">Dimensions</label>
            <input name="dimensions" placeholder="50x30mm" className="w-full" />
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
            <input name="purchaseSource" placeholder="Etsy, Direct from maker, Amazon..." className="w-full" />
          </div>

          <div>
            <label className="form-label">Notes</label>
            <textarea name="notes" rows={2} placeholder="Additional notes..." className="w-full" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button type="submit" disabled={loading} className="btn btn-primary">
          <span className="material-symbols-outlined icon-sm">add</span>
          {loading ? 'Adding...' : 'Add to Collection'}
        </button>
        <button 
          type="button" 
          onClick={() => router.push('/')} 
          className="btn btn-secondary"
        >
          <span className="material-symbols-outlined icon-sm">close</span>
          Cancel
        </button>
      </div>
    </form>
  );
}
