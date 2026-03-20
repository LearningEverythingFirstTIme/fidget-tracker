'use client';

import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Package, Pencil, Trash2 } from 'lucide-react';

interface ItemCardProps {
  item: {
    id: string;
    name: string;
    brand: string | null;
    imageUrl: string | null;
    pricePaid: number | null;
    currentValue: number | null;
    status: string;
    condition: string | null;
    category: { name: string } | null;
    material?: string | null;
  };
  onDelete: (id: string) => void;
}

export default function ItemCard({ item, onDelete }: ItemCardProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'OWNED':
        return 'badge-owned';
      case 'WISHLIST':
        return 'badge-wishlist';
      case 'SOLD':
        return 'badge-sold';
      case 'TRADED':
        return 'badge-traded';
      default:
        return 'badge-category';
    }
  };

  return (
    <div className="card group relative cursor-pointer transition-all duration-300 hover:translate-y-[-4px]" style={{ background: 'var(--surface-container-low)' }}>
      <div 
        className="aspect-square w-full overflow-hidden mb-4 relative"
        style={{ 
          background: 'var(--surface-container-highest)',
          borderRadius: '0.5rem'
        }}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-12 w-12 transition-transform duration-300 group-hover:scale-110" style={{ color: 'var(--on-surface-dim)' }} />
          </div>
        )}
        {item.material && (
          <span className="badge-material absolute top-4 right-4">
            {item.material}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <h3 
          className="font-bold text-base truncate uppercase tracking-wide transition-colors duration-300 group-hover:text-primary"
          style={{ color: 'var(--on-surface)', fontFamily: 'var(--font-headline)' }}
          title={item.name}
        >
          {item.name}
        </h3>
        
        {item.brand && (
          <p className="text-xs uppercase tracking-wider truncate" style={{ color: 'var(--on-surface-variant)' }} title={item.brand}>
            {item.brand}
          </p>
        )}
        
        {item.category && (
          <span className="badge badge-category">
            {item.category.name}
          </span>
        )}
        
        <div className="flex items-center justify-between pt-2 mt-2" style={{ borderTop: '1px solid rgba(68, 71, 72, 0.15)' }}>
          <p className="font-bold text-sm" style={{ color: 'var(--primary)', fontFamily: 'var(--font-headline)' }}>
            {formatCurrency(item.currentValue || item.pricePaid)}
          </p>
          <span className={`badge ${getStatusClass(item.status)}`}>
            {item.status}
          </span>
        </div>
      </div>

      <div className="floating-actions absolute top-3 right-3 flex gap-2">
        <Link
          href={`/item/${item.id}`}
          className="p-2 transition-all duration-300 hover:border-primary"
          style={{ 
            background: 'rgba(24, 24, 28, 0.95)',
            border: '1px solid rgba(68, 71, 72, 0.15)',
            color: 'var(--on-surface-variant)',
            backdropFilter: 'blur(8px)',
            borderRadius: '0.25rem'
          }}
        >
          <Pencil className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="p-2 transition-all duration-300"
          style={{ 
            background: 'rgba(24, 24, 28, 0.95)',
            border: '1px solid rgba(255, 180, 171, 0.3)',
            color: 'var(--error)',
            backdropFilter: 'blur(8px)',
            borderRadius: '0.25rem'
          }}
        >
          <Trash2 className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
        </button>
      </div>
    </div>
  );
}
