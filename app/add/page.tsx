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
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="text-center">
          <span className="material-symbols-outlined icon-xl animate-pulse" style={{ color: 'var(--accent)' }}>hourglass_empty</span>
          <p className="label mt-4">Loading...</p>
        </div>
      </div>
    );
  }

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
              New Item
            </h1>
            <p className="label">
              Add to your collection
            </p>
          </div>
        </div>
        
        <AddItemForm categories={categories} />
      </div>
    </div>
  );
}
