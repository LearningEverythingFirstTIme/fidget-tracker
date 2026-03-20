'use client';

import { useEffect, useState } from 'react';
import AddItemForm from '@/components/AddItemForm';
import Link from 'next/link';
import { ChevronLeft, Plus } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  children: { id: string; name: string }[];
}

export default function AddPage() {
  const [categories, setCategories] = useState<Category[]>([]);
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
          <div className="h-8 w-8 mx-auto mb-4 animate-pulse" style={{ background: 'var(--primary)', borderRadius: '50%' }}></div>
          <p className="label" style={{ color: 'var(--on-surface-variant)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8 pb-6" style={{ borderBottom: '1px solid rgba(68, 71, 72, 0.15)' }}>
          <Link href="/" className="btn btn-ghost">
            <ChevronLeft className="h-4 w-4" />
            Back
          </Link>
          <div>
            <p className="text-lg font-bold uppercase tracking-wider" style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-headline)' }}>
              New Entry
            </p>
            <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--on-surface-variant)' }}>
              Add to your collection
            </p>
          </div>
        </div>
        
        <AddItemForm categories={categories} />
      </div>
    </div>
  );
}
