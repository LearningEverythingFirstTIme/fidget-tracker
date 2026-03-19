'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs';
import ItemCard from '@/components/ItemCard';

function useCountUp(end: number, duration: number = 1000, start: boolean = false) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!start) return;
    
    let startTime: number | null = null;
    let animationFrame: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);
  
  return count;
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image skeleton mb-4"></div>
      <div className="skeleton-text skeleton"></div>
      <div className="skeleton-text skeleton skeleton-text-sm"></div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t-3 border-charcoal">
        <div className="skeleton-text skeleton skeleton-text-lg"></div>
        <div className="skeleton skeleton" style={{ width: '70px', height: '24px' }}></div>
      </div>
    </div>
  );
}

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSignedIn) return;
    
    let cancelled = false;
    Promise.all([
      fetch('/api/items').then(r => r.json()),
      fetch('/api/categories').then(r => r.json()),
    ]).then(([itemsData, categoriesData]) => {
      if (cancelled) return;
      setItems(itemsData);
      setCategories(categoriesData);
      setLoading(false);
      setTimeout(() => setStatsVisible(true), 100);
    }).catch(() => {
      if (cancelled) return;
      setLoading(false);
    });
    
    return () => { cancelled = true; };
  }, [isSignedIn]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

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

  const animatedTotal = useCountUp(Math.round(totalValue), 1500, statsVisible);
  const animatedItems = useCountUp(items.length, 1000, statsVisible);
  const animatedOwned = useCountUp(ownedCount, 800, statsVisible);
  const animatedWishlist = useCountUp(wishlistCount, 800, statsVisible);

  async function deleteItem(id: string) {
    if (!confirm('Remove this item from your collection?')) return;
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    setItems(items.filter(i => i.id !== id));
  }

  if (!isLoaded) {
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
    <div className="min-h-screen relative z-10">
      {/* Header */}
      <header className="header">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 flex items-center justify-center border-3 border-charcoal bg-charcoal">
                <span className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-serif)' }}>F</span>
              </div>
              <div>
                <h1 className="header-title">FIDGET COLLECTOR</h1>
                <p className="header-subtitle">Curated Catalog</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!isSignedIn ? (
              <SignInButton>
                <button className="btn btn-primary">
                  <span className="material-symbols-outlined icon-sm">login</span>
                  Sign In
                </button>
              </SignInButton>
            ) : (
              <>
                <Link href="/add" className="btn btn-primary">
                  <span className="material-symbols-outlined icon-sm">add</span>
                  Add Item
                </Link>
                <div className="border-3 border-charcoal p-1 bg-white" style={{ boxShadow: '4px 4px 0px var(--charcoal)' }}>
                  <UserButton />
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {isSignedIn ? (
        <main className="max-w-7xl mx-auto px-6 py-10">
          {/* Stats Grid */}
          <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="stat-card">
              <span className="material-symbols-outlined stat-card-icon">inventory</span>
              <p className="stat-value">{animatedItems}</p>
              <p className="stat-label">Total Items</p>
            </div>
            <div className="stat-card stat-card-accent">
              <span className="material-symbols-outlined stat-card-icon">payments</span>
              <p className="stat-value">${animatedTotal.toLocaleString()}</p>
              <p className="stat-label">Collection Value</p>
            </div>
            <div className="stat-card">
              <span className="material-symbols-outlined stat-card-icon">task_alt</span>
              <p className="stat-value">{animatedOwned}</p>
              <p className="stat-label">Owned</p>
            </div>
            <div className="stat-card">
              <span className="material-symbols-outlined stat-card-icon" style={{ color: 'var(--accent)' }}>favorite</span>
              <p className="stat-value">{animatedWishlist}</p>
              <p className="stat-label">Wishlist</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="filter-bar">
            <input
              type="text"
              placeholder="Search by name or brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="filter-input"
            />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
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
              className="filter-select"
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
                className="btn btn-secondary"
              >
                <span className="material-symbols-outlined icon-sm">close</span>
                Reset
              </button>
            )}
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="item-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-stagger" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                  <SkeletonCard />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <span className="material-symbols-outlined icon-xl" style={{ color: 'var(--muted)' }}>inventory_2</span>
              <h3 className="empty-state-title">
                {items.length === 0 ? 'Your Collection Awaits' : 'No Matching Items'}
              </h3>
              <p className="empty-state-text">
                {items.length === 0
                  ? 'Start building your curated fidget toy collection today.'
                  : 'Try adjusting your search or filters.'}
              </p>
              {items.length === 0 && (
                <Link href="/add" className="btn btn-primary">
                  <span className="material-symbols-outlined icon-sm">add</span>
                  Add Your First Item
                </Link>
              )}
            </div>
          ) : (
            <div className="item-grid">
              {filteredItems.map((item, index) => (
                <div key={item.id} className="card-stagger card-animate" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ItemCard item={item} onDelete={deleteItem} />
                </div>
              ))}
            </div>
          )}
        </main>
      ) : (
        /* Landing Page */
        <div className="max-w-4xl mx-auto text-center py-20 px-6">
          <div className="mb-10">
            <div className="inline-flex items-center justify-center w-28 h-28 border-3 border-charcoal bg-charcoal mb-8" style={{ boxShadow: '8px 8px 0px var(--charcoal)' }}>
              <span className="text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-serif)' }}>F</span>
            </div>
          </div>
          
          <h2 className="font-display text-4xl md:text-5xl mb-6" style={{ color: 'var(--charcoal)' }}>
            The Curated Catalog<br/>for Fidget Enthusiasts
          </h2>
          
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
            Track your spinners, sliders, clickers, and more with precision. 
            Build a beautiful collection catalog that celebrates tactile design.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <SignInButton>
              <button className="btn btn-primary text-base px-8 py-4">
                <span className="material-symbols-outlined">login</span>
                Get Started
              </button>
            </SignInButton>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card text-center">
              <span className="material-symbols-outlined icon-xl mb-4" style={{ color: 'var(--charcoal)' }}>inventory</span>
              <h3 className="font-display text-xl mb-2">Catalog</h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Organize your entire fidget collection in one beautiful place</p>
            </div>
            <div className="card card-accent text-center">
              <span className="material-symbols-outlined icon-xl mb-4 text-white">analytics</span>
              <h3 className="font-display text-xl mb-2 text-white">Track Value</h3>
              <p className="text-sm text-white" style={{ opacity: 0.9 }}>Monitor the value of your collection over time</p>
            </div>
            <div className="card text-center">
              <span className="material-symbols-outlined icon-xl mb-4" style={{ color: 'var(--charcoal)' }}>category</span>
              <h3 className="font-display text-xl mb-2">Categorize</h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Sort by type, material, brand, and custom categories</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t-3 border-charcoal mt-auto py-6 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="label">
            FIDGET COLLECTOR — <span style={{ color: 'var(--accent)' }}>Built with purpose</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
