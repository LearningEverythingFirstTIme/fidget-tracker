'use client';

import { useEffect, useState } from 'react';
import AddItemForm from '@/components/AddItemForm';
import Link from 'next/link';

export default function AddPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">← Back</Link>
          <h1 className="text-2xl font-bold">Add New Item</h1>
        </div>
        <AddItemForm categories={categories} />
      </div>
    </div>
  );
}
