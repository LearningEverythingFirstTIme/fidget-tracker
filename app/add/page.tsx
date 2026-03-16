'use client';

import { useEffect, useState } from 'react';
import AddItemForm from '@/components/AddItemForm';
import Link from 'next/link';
import { ChevronLeft, Terminal } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Terminal className="h-8 w-8 mx-auto mb-4 animate-pulse" style={{ color: 'var(--accent)' }} />
          <p className="text-sm uppercase tracking-widest" style={{ color: 'var(--foreground-muted)' }}>LOADING_CATEGORIES...</p>
        </div>
      </div>
    );
  }

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
              NEW_ENTRY
            </h1>
            <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>
              Add item to collection
            </p>
          </div>
        </div>
        <AddItemForm categories={categories} />
      </div>
    </div>
  );
}
