'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs';
import ItemCard from '@/components/ItemCard';
import { Plus, Package, DollarSign, Grid3X3, ChevronRight, Terminal } from 'lucide-react';

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
    if (!confirm('DELETE: Confirm removal from collection?')) return;
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    setItems(items.filter(i => i.id !== id));
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Terminal className="h-8 w-8 mx-auto mb-4 animate-pulse text-accent" style={{ color: 'var(--accent)' }} />
          <p className="text-muted text-sm uppercase tracking-widest" style={{ color: 'var(--foreground-muted)' }}>INITIALIZING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="header">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex items-center justify-center border border-current animate-flicker" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                <span className="text-sm font-bold">FT</span>
              </div>
              <div>
                <h1 className="header-title">FIDGET://TRACKER</h1>
                <p className="header-subtitle">Collection Management System v2.0</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!isSignedIn ? (
              <SignInButton>
                <button className="btn btn-primary">
                  <ChevronRight className="h-4 w-4" />
                  ACCESS
                </button>
              </SignInButton>
            ) : (
              <>
                <Link href="/add" className="btn btn-primary">
                  <Plus className="h-4 w-4" />
                  NEW_ENTRY
                </Link>
                <div className="border" style={{ borderColor: 'var(--border)' }}>
                  <UserButton />
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {isSignedIn ? (
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="stat-card">
              <div className="stat-icon">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="stat-value">{items.length}</p>
                <p className="stat-label">Total Items</p>
              </div>
            </div>
            <div className="stat-card card-accent">
              <div className="stat-icon" style={{ borderColor: 'var(--status-owned)', color: 'var(--status-owned)' }}>
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="stat-value">${totalValue.toFixed(2)}</p>
                <p className="stat-label">Collection Value</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Grid3X3 className="h-5 w-5" />
              </div>
              <div>
                <p className="stat-value">{ownedCount}</p>
                <p className="stat-label">Owned</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon" style={{ borderColor: 'var(--status-wishlist)', color: 'var(--status-wishlist)' }}>
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="stat-value">{wishlistCount}</p>
                <p className="stat-label">Wishlist</p>
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            <input
              type="text"
              placeholder="SEARCH_NAME_OR_BRAND..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="filter-input flex-1"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">ALL_CATEGORIES</option>
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
              className="filter-select"
            >
              <option value="">ALL_STATUS</option>
              <option value="OWNED">OWNED</option>
              <option value="WISHLIST">WISHLIST</option>
              <option value="SOLD">SOLD</option>
              <option value="TRADED">TRADED</option>
            </select>
            {(filter || statusFilter || search) && (
              <button
                onClick={() => { setFilter(''); setStatusFilter(''); setSearch(''); }}
                className="btn btn-secondary"
              >
                RESET
              </button>
            )}
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="text-center py-16">
              <Terminal className="h-12 w-12 mx-auto mb-4 animate-pulse" style={{ color: 'var(--accent)' }} />
              <p className="text-sm uppercase tracking-widest" style={{ color: 'var(--foreground-muted)' }}>LOADING_COLLECTION...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <Package className="h-16 w-16 mx-auto mb-4 empty-state-icon" />
              <h3 className="empty-state-title">
                {items.length === 0 ? 'COLLECTION_EMPTY' : 'NO_MATCHING_ITEMS'}
              </h3>
              <p className="empty-state-text">
                {items.length === 0
                  ? 'Initialize your collection by adding your first fidget item.'
                  : 'Adjust search parameters or reset filters.'}
              </p>
              {items.length === 0 && (
                <Link href="/add" className="btn btn-primary">
                  <Plus className="h-4 w-4" />
                  ADD_FIRST_ITEM
                </Link>
              )}
            </div>
          ) : (
            <div className="item-grid">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} onDelete={deleteItem} />
              ))}
            </div>
          )}
        </main>
      ) : (
        <div className="max-w-2xl mx-auto text-center py-24 px-4">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 border-2 mb-6 animate-flicker" style={{ borderColor: 'var(--accent)' }}>
              <span className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>FT</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>
            TERMINAL-GRADE COLLECTION MANAGEMENT
          </h2>
          <p className="mb-8 text-base" style={{ color: 'var(--foreground-muted)' }}>
            Professional tracking for fidget enthusiasts. Monitor spinners, sliders, clickers, and more with precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignInButton>
              <button className="btn btn-primary">
                <ChevronRight className="h-4 w-4" />
                INITIALIZE_SESSION
              </button>
            </SignInButton>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div className="card">
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>01</p>
              <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>Track</p>
            </div>
            <div className="card">
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>02</p>
              <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>Organize</p>
            </div>
            <div className="card">
              <p className="text-2xl font-bold mb-1" style={{ color: 'var(--accent)' }}>03</p>
              <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>Analyze</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t mt-auto py-4 text-center" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--foreground-dim)' }}>
          FIDGET://TRACKER — System Online
        </p>
      </footer>
    </div>
  );
}
