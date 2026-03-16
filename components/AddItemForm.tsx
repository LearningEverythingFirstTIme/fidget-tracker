'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <form onSubmit={onSubmit} className="space-y-6 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
        <input name="name" required className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
        <select name="categoryId" required className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">Select a category</option>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
          <input name="brand" className="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
          <input name="material" placeholder="e.g., Titanium, Brass, Steel" className="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="description" rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price Paid ($)</label>
          <input name="pricePaid" type="number" step="0.01" className="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Value ($)</label>
          <input name="currentValue" type="number" step="0.01" className="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select name="status" className="w-full rounded-md border border-gray-300 px-3 py-2">
            <option value="OWNED">Owned</option>
            <option value="WISHLIST">Wishlist</option>
            <option value="SOLD">Sold</option>
            <option value="TRADED">Traded</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
          <select name="condition" className="w-full rounded-md border border-gray-300 px-3 py-2">
            <option value="">Not specified</option>
            <option value="NEW">New</option>
            <option value="LIKE_NEW">Like New</option>
            <option value="GOOD">Good</option>
            <option value="FAIR">Fair</option>
            <option value="POOR">Poor</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input name="imageUrl" type="url" placeholder="https://..." className="w-full rounded-md border border-gray-300 px-3 py-2" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input name="quantity" type="number" defaultValue="1" min="1" className="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (g)</label>
          <input name="weightGrams" type="number" step="0.1" className="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
          <input name="dimensions" placeholder="e.g., 50x30mm" className="w-full rounded-md border border-gray-300 px-3 py-2" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Source</label>
        <input name="purchaseSource" placeholder="e.g., Etsy, Direct from maker, Amazon" className="w-full rounded-md border border-gray-300 px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <textarea name="notes" rows={2} className="w-full rounded-md border border-gray-300 px-3 py-2" />
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors">
          {loading ? 'Adding...' : 'Add to Collection'}
        </button>
        <button type="button" onClick={() => router.push('/')} className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
