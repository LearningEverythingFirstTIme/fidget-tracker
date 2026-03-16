'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs';
import ItemCard from '@/components/ItemCard';
import { Plus, Package, DollarSign, Grid3X3 } from 'lucide-react';

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }
    Promise.all([
      fetch('/api/items').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([itemsData, categoriesData]) => {
      setItems(itemsData);
      setCategories(categoriesData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [isSignedIn]);

  const filteredItems = items.filter(item => {
    const matchesCategory = !filter || item.categoryId === filter;
    const matchesStatus = !statusFilter || item.status === statusFilter;
    const matchesSearch = !search || 
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.brand?.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const totalValue = items.reduce((sum: number, item: any) => sum + (item.currentValue || item.pricePaid || 0), 0);
  const ownedCount = items.filter((i: any) => i.status === 'OWNED').length;
  const wishlistCount = items.filter((i: any) => i.status === 'WISHLIST').length;

  async function deleteItem(id: string) {
    if (!confirm('Delete this item from your collection?')) return;
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    setItems(items.filter(i => i.id !== id));
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">🎯 Fidget Tracker</h1>
            <p className="text-sm text-gray-500">Your Collection Manager</p>
          </div>
          <div className="flex items-center gap-4">
            {!isSignedIn ? (
              <SignInButton>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                  Sign In
                </button>
              </SignInButton>
            ) : (
              <>
                <Link href="/add" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium transition-colors">
                  <Plus className="h-4 w-4" /> Add Item
                </Link>
                <UserButton />
              </>
            )}
          </div>
        </div>
      </header>

      {isSignedIn ? (
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Items</p>
                  <p className="text-2xl font-bold">{items.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Collection Value</p>
                  <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Grid3X3 className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Owned</p>
                  <p className="text-2xl font-bold">{ownedCount}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Package className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Wishlist</p>
                  <p className="text-2xl font-bold">{wishlistCount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by name or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="px-4 py-2 border rounded-md w-64 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map((cat: any) => (
                <optgroup key={cat.id} label={cat.name}>
                  {cat.children?.map((child: any) => (
                    <option key={child.id} value={child.id}>{child.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="">All Status</option>
              <option value="OWNED">Owned</option>
              <option value="WISHLIST">Wishlist</option>
              <option value="SOLD">Sold</option>
              <option value="TRADED">Traded</option>
            </select>
            {(filter || statusFilter || search) && (
              <button
                onClick={() => { setFilter(''); setStatusFilter(''); setSearch(''); }}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Items */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading your collection...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg border shadow-sm">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {items.length === 0 ? 'No items yet' : 'No matching items'}
              </h3>
              <p className="text-gray-500 mb-6">
                {items.length === 0
                  ? 'Add your first fidget to start building your collection!'
                  : 'Try adjusting your search or filters.'}
              </p>
              {items.length === 0 && (
                <Link href="/add" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <Plus className="h-4 w-4" /> Add Your First Item
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} onDelete={deleteItem} />
              ))}
            </div>
          )}
        </main>
      ) : (
        <div className="max-w-lg mx-auto text-center py-20 px-4">
          <div className="text-6xl mb-6">🎯</div>
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Track Your Fidget Collection</h2>
          <p className="text-gray-600 mb-8 text-lg">
            The ultimate collection manager for fidget enthusiasts. Track spinners, sliders, clickers, and more.
          </p>
          <SignInButton>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-lg transition-colors">
              Get Started
            </button>
          </SignInButton>
        </div>
      )}
    </div>
  );
}
