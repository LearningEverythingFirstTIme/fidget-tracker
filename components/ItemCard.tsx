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
  };
  onDelete: (id: string) => void;
}

export default function ItemCard({ item, onDelete }: ItemCardProps) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'OWNED':
        return 'badge-owned';
      case 'WISHLIST':
        return 'badge-wishlist badge-wishlist-animated';
      case 'SOLD':
        return 'badge-sold';
      case 'TRADED':
        return 'badge-traded';
      default:
        return 'badge-category';
    }
  };

  return (
    <div className="group relative card-enhanced card-holographic">
      <div 
        className="aspect-square w-full overflow-hidden mb-4 border relative"
        style={{ 
          borderColor: 'var(--border)',
          background: 'var(--background-input)'
        }}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-12 w-12 transition-transform duration-300 group-hover:scale-110" style={{ color: 'var(--foreground-dim)' }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent group-hover:via-transparent pointer-events-none transition-all duration-300"></div>
      </div>

      <div className="space-y-2">
        <h3 
          className="font-bold truncate uppercase tracking-wide text-sm group-hover:text-accent transition-colors duration-300"
          style={{ color: 'var(--foreground)' }}
        >
          {item.name}
        </h3>
        
        {item.brand && (
          <p 
            className="text-xs uppercase tracking-wider"
            style={{ color: 'var(--foreground-muted)' }}
          >
            {item.brand}
          </p>
        )}
        
        {item.category && (
          <span className="badge badge-category transition-all duration-300 group-hover:border-accent">
            {item.category.name}
          </span>
        )}
        
        <div className="flex items-center justify-between pt-2 mt-2 border-t transition-colors duration-300" style={{ borderColor: 'var(--border)' }}>
          <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>
            {formatCurrency(item.currentValue || item.pricePaid)}
          </p>
          <span className={`badge ${getStatusClass(item.status)}`}>
            {item.status}
          </span>
        </div>
      </div>

      <div className="floating-actions absolute top-2 right-2 flex gap-1">
        <Link
          href={`/item/${item.id}`}
          className="p-2 border transition-all duration-300 hover:border-accent hover:shadow-lg"
          style={{ 
            background: 'rgba(24, 24, 28, 0.95)',
            borderColor: 'var(--border)',
            color: 'var(--foreground-muted)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Pencil className="h-4 w-4 transition-transform duration-200 hover:rotate-12" />
        </Link>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 border transition-all duration-300 hover:border-red-500 hover:shadow-lg hover:shadow-red-500/20"
          style={{ 
            background: 'rgba(24, 24, 28, 0.95)',
            borderColor: 'var(--border)',
            color: 'var(--foreground-muted)',
            backdropFilter: 'blur(8px)'
          }}
        >
          <Trash2 className="h-4 w-4 transition-transform duration-200 hover:scale-110" />
        </button>
      </div>
    </div>
  );
}
