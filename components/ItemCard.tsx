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
  const statusColors: Record<string, string> = {
    OWNED: 'bg-green-100 text-green-800',
    WISHLIST: 'bg-blue-100 text-blue-800',
    SOLD: 'bg-gray-100 text-gray-800',
    TRADED: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="group relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 mb-4">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Package className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
        {item.brand && <p className="text-sm text-gray-500">{item.brand}</p>}
        {item.category && (
          <span className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
            {item.category.name}
          </span>
        )}
        <div className="flex items-center justify-between pt-2">
          <p className="font-medium text-gray-900">
            {formatCurrency(item.pricePaid)}
          </p>
          <span className={`text-xs px-2 py-1 rounded-full ${statusColors[item.status]}`}>
            {item.status}
          </span>
        </div>
      </div>

      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          href={`/item/${item.id}`}
          className="p-2 bg-white rounded-full shadow hover:bg-gray-50"
        >
          <Pencil className="h-4 w-4 text-gray-600" />
        </Link>
        <button
          onClick={() => onDelete(item.id)}
          className="p-2 bg-white rounded-full shadow hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>
    </div>
  );
}
