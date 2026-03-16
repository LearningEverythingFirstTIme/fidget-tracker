'use client';

import Image from 'next/image';
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
    <div className="group relative card transition-all duration-150 hover:border-accent" style={{ transition: 'border-color 150ms ease-out' }}>
      {/* Image Container */}
      <div 
        className="aspect-square w-full overflow-hidden mb-4 border"
        style={{ 
          borderColor: 'var(--border)',
          background: 'var(--background-input)'
        }}
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-12 w-12" style={{ color: 'var(--foreground-dim)' }} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        {/* Name */}
        <h3 
          className="font-bold truncate uppercase tracking-wide text-sm"
          style={{ color: 'var(--foreground)' }}
        >
          {item.name}
        </h3>
        
        {/* Brand */}
        {item.brand && (
          <p 
            className="text-xs uppercase tracking-wider"
            style={{ color: 'var(--foreground-muted)' }}
          >
            {item.brand}
          </p>
        )}
        
        {/* Category Badge */}
        {item.category && (
          <span className="badge badge-category">
            {item.category.name}
          </span>
        )}
        
        {/* Price & Status Row */}
        <div className="flex items-center justify-between pt-2 mt-2 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>
            {formatCurrency(item.currentValue || item.pricePaid)}
          </p>
          <span className={`badge ${getStatusClass(item.status)}`}>
            {item.status}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div 
        className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      >
        <Link
          href={`/item/${item.id}`}
          className="p-2 border transition-colors duration-150"
          style={{ 
            background: 'var(--background-card)',
            borderColor: 'var(--border)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent)';
            e.currentTarget.style.color = 'var(--accent)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--foreground-muted)';
          }}
        >
          <Pencil className="h-4 w-4" />
        </Link>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 border transition-colors duration-150"
          style={{ 
            background: 'var(--background-card)',
            borderColor: 'var(--border)',
            color: 'var(--foreground-muted)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--danger)';
            e.currentTarget.style.color = 'var(--danger)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--foreground-muted)';
          }}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
