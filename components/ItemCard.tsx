'use client';

import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

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
    <div className="card group relative">
      {/* Image */}
      <div 
        className="aspect-square w-full overflow-hidden mb-4 border-3 border-charcoal relative bg-paper-dark"
      >
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="material-symbols-outlined icon-xl" style={{ color: 'var(--muted)' }}>inventory_2</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h3 
          className="font-display text-lg truncate group-hover:text-accent transition-colors duration-300"
          style={{ color: 'var(--charcoal)' }}
        >
          {item.name}
        </h3>
        
        {item.brand && (
          <p className="label">
            {item.brand}
          </p>
        )}
        
        {item.category && (
          <span className="badge badge-category">
            {item.category.name}
          </span>
        )}
        
        <div className="flex items-center justify-between pt-3 mt-3 border-t-3 border-charcoal">
          <p className="price">
            {formatCurrency(item.currentValue || item.pricePaid)}
          </p>
          <span className={`badge ${getStatusClass(item.status)}`}>
            {item.status === 'OWNED' && <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>check</span>}
            {item.status === 'WISHLIST' && <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>favorite</span>}
            {item.status === 'SOLD' && <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>sell</span>}
            {item.status === 'TRADED' && <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>swap_horiz</span>}
            {item.status}
          </span>
        </div>
      </div>

      {/* Floating Actions */}
      <div className="floating-actions absolute top-3 right-3 flex gap-2">
        <Link
          href={`/item/${item.id}`}
          className="btn-icon"
          style={{ 
            background: 'white',
            border: '3px solid var(--charcoal)',
            padding: '10px',
            boxShadow: '3px 3px 0px var(--charcoal)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
        </Link>
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(item.id);
          }}
          className="btn-icon btn-danger"
          style={{ 
            background: 'white',
            padding: '10px',
            boxShadow: '3px 3px 0px var(--danger)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
        </button>
      </div>
    </div>
  );
}
