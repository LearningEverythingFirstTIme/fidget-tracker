'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

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

  if (!item) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">← Back</Link>
          <h1 className="text-2xl font-bold">Edit Item</h1>
        </div>

        <form onSubmit={onSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input name="name" required defaultValue={item.name} className="w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select name="categoryId" required defaultValue={item.categoryId} className="w-full rounded-md border border-gray-300 px-3 py-2">
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input name="brand" defaultValue={item.brand || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
              <input name="material" defaultValue={item.material || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" rows={3} defaultValue={item.description || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Paid ($)</label>
              <input name="pricePaid" type="number" step="0.01" defaultValue={item.pricePaid || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Value ($)</label>
              <input name="currentValue" type="number" step="0.01" defaultValue={item.currentValue || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select name="status" defaultValue={item.status} className="w-full rounded-md border border-gray-300 px-3 py-2">
                <option value="OWNED">Owned</option>
                <option value="WISHLIST">Wishlist</option>
                <option value="SOLD">Sold</option>
                <option value="TRADED">Traded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
              <select name="condition" defaultValue={item.condition || ''} className="w-full rounded-md border border-gray-300 px-3 py-2">
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
            <input name="imageUrl" type="url" defaultValue={item.imageUrl || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input name="quantity" type="number" defaultValue={item.quantity || 1} min="1" className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (g)</label>
              <input name="weightGrams" type="number" step="0.1" defaultValue={item.weightGrams || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dimensions</label>
              <input name="dimensions" defaultValue={item.dimensions || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Source</label>
            <input name="purchaseSource" defaultValue={item.purchaseSource || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" rows={2} defaultValue={item.notes || ''} className="w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button type="submit" disabled={loading} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/" className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-center transition-colors">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
