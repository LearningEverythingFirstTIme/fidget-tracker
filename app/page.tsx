'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs';
import ItemCard from '@/components/ItemCard';
import { Plus, Search, Bell, FileText, TrendingUp, Package, Sparkles, Wallet, Box } from 'lucide-react';

interface Item {
  id: string;
  name: string;
  brand: string | null;
  imageUrl: string | null;
  pricePaid: number | null;
  currentValue: number | null;
  status: string;
  condition: string | null;
  categoryId: string;
  category: { name: string } | null;
}

interface Category {
  id: string;
  name: string;
  children: { id: string; name: string }[];
}

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
    <div className="card">
      <div className="aspect-square w-full skeleton mb-4" style={{ background: 'var(--surface-container-highest)', borderRadius: '0.5rem' }}></div>
      <div className="h-4 skeleton mb-2" style={{ background: 'var(--surface-container-highest)', width: '80%' }}></div>
      <div className="h-3 skeleton mb-4" style={{ background: 'var(--surface-container-highest)', width: '50%' }}></div>
      <div className="flex justify-between items-center pt-4" style={{ borderTop: '1px solid rgba(68, 71, 72, 0.15)' }}>
        <div className="h-5 skeleton" style={{ background: 'var(--surface-container-highest)', width: '40%' }}></div>
        <div className="skeleton" style={{ width: '60px', height: '20px', background: 'var(--surface-container-highest)' }}></div>
      </div>
    </div>
  );
}

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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

  const totalValue = items.reduce((sum, item) => sum + (item.currentValue || item.pricePaid || 0), 0);
  const ownedCount = items.filter(i => i.status === 'OWNED').length;
  const wishlistCount = items.filter(i => i.status === 'WISHLIST').length;

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="h-10 w-10 mx-auto mb-4 loading-spinner" style={{ color: 'var(--primary)' }} />
          <p className="text-sm uppercase tracking-widest" style={{ color: 'var(--on-surface-variant)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Header */}
      <header className="top-header">
        <div className="flex items-center gap-8 flex-1">
          <div className="header-title">The Kinetic Atelier</div>
          {isSignedIn && (
            <div className="search-bar hidden lg:flex">
              <Search className="h-4 w-4" style={{ color: 'var(--on-surface-variant)' }} />
              <input 
                type="text" 
                placeholder="Search the collection..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-6">
          {isSignedIn && (
            <>
              <button className="btn-ghost p-2" style={{ background: 'transparent' }}>
                <Bell className="h-5 w-5" style={{ color: 'var(--on-surface-variant)' }} />
              </button>
              <button className="btn-ghost p-2" style={{ background: 'transparent' }}>
                <FileText className="h-5 w-5" style={{ color: 'var(--on-surface-variant)' }} />
              </button>
            </>
          )}
          <div className="w-10 h-10 rounded-full overflow-hidden ghost-border" style={{ background: 'var(--surface-container-highest)' }}>
            <UserButton />
          </div>
        </div>
      </header>

      {isSignedIn ? (
        <div className="flex-1 p-8">
          {/* Welcome Section */}
          <section className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--primary)' }}>Authenticated Access</p>
                <h2 className="headline-lg" style={{ fontFamily: 'var(--font-headline)' }}>Welcome back, Collector</h2>
              </div>
              <Link href="/add" className="btn btn-primary">
                <Plus className="h-5 w-5" />
                <span>Add Piece</span>
              </Link>
            </div>

            {/* Stats Cards */}
            <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="stat-card">
                <Wallet className="stat-icon" style={{ transform: 'rotate(12deg)' }} />
                <p className="stat-label">Total Collection Value</p>
                <p className="stat-value">${animatedTotal.toLocaleString()}</p>
                <div className="stat-meta stat-meta-positive">
                  <TrendingUp className="h-3 w-3" />
                  <span>Track your investment</span>
                </div>
              </div>
              <div className="stat-card">
                <Box className="stat-icon" style={{ transform: 'rotate(12deg)' }} />
                <p className="stat-label">Items Owned</p>
                <p className="stat-value" style={{ color: 'var(--on-surface)' }}>{animatedItems}</p>
                <div className="stat-meta">
                  <span>{animatedOwned} currently in collection</span>
                </div>
              </div>
              <div className="stat-card">
                <Sparkles className="stat-icon" style={{ transform: 'rotate(12deg)' }} />
                <p className="stat-label">Wishlist Items</p>
                <p className="stat-value" style={{ color: 'var(--tertiary)' }}>{animatedWishlist}</p>
                <div className="stat-meta">
                  <span>Pieces to acquire</span>
                </div>
              </div>
            </div>
          </section>

          {/* Filter Bar */}
          <div className="filter-bar">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-box"
              style={{ minWidth: '160px' }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <optgroup key={cat.id} label={cat.name}>
                  {cat.children?.map((child) => (
                    <option key={child.id} value={child.id}>{child.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <button 
              onClick={() => setStatusFilter(statusFilter === 'OWNED' ? '' : 'OWNED')}
              className={`chip ${statusFilter === 'OWNED' ? 'chip-active' : ''}`}
            >
              Owned
            </button>
            <button 
              onClick={() => setStatusFilter(statusFilter === 'WISHLIST' ? '' : 'WISHLIST')}
              className={`chip ${statusFilter === 'WISHLIST' ? 'chip-active' : ''}`}
            >
              Wishlist
            </button>
            <button 
              onClick={() => setStatusFilter(statusFilter === 'SOLD' ? '' : 'SOLD')}
              className={`chip ${statusFilter === 'SOLD' ? 'chip-active' : ''}`}
            >
              Sold
            </button>
            {(filter || statusFilter) && (
              <button
                onClick={() => { setFilter(''); setStatusFilter(''); }}
                className="btn btn-ghost"
                style={{ padding: '6px 12px' }}
              >
                Reset
              </button>
            )}
          </div>

          {/* Items Grid */}
          {loading ? (
            <div className="item-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-stagger" style={{ animationDelay: `${i * 0.1}s` }}>
                  <SkeletonCard />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <Package className="h-16 w-16 mx-auto mb-6 empty-state-icon" />
              <h3 className="empty-state-title">
                {items.length === 0 ? 'Collection Empty' : 'No Matching Items'}
              </h3>
              <p className="empty-state-text">
                {items.length === 0
                  ? 'Begin your curated collection by adding your first piece.'
                  : 'Adjust filters to discover your pieces.'}
              </p>
              {items.length === 0 && (
                <Link href="/add" className="btn btn-primary">
                  <Plus className="h-4 w-4" />
                  Add First Piece
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
        </div>
      ) : (
        /* Landing Page */
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-2xl text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 mb-6 relative" style={{ border: '2px solid var(--primary)' }}>
                <span className="text-4xl font-bold" style={{ color: 'var(--primary)', fontFamily: 'var(--font-headline)' }}>KA</span>
                <div className="absolute inset-0 animate-pulse" style={{ background: 'radial-gradient(circle, rgba(233, 195, 73, 0.2) 0%, transparent 70%)' }}></div>
              </div>
            </div>
            
            <h2 className="headline-lg mb-4" style={{ fontFamily: 'var(--font-headline)' }}>
              The Curated Gallery<br/>for Precision Collectors
            </h2>
            
            <p className="body-lg mb-10 max-w-lg mx-auto" style={{ color: 'var(--on-surface-variant)' }}>
              Track spinners, sliders, and haptic coins with the reverence they deserve. 
              A premium stage for your mechanical masterpieces.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <SignInButton>
                <button className="btn btn-primary">
                  <span>Initialize Session</span>
                </button>
              </SignInButton>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="card">
                <p className="text-2xl font-bold mb-1" style={{ color: 'var(--primary)', fontFamily: 'var(--font-headline)' }}>01</p>
                <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--on-surface-variant)' }}>Catalog</p>
              </div>
              <div className="card">
                <p className="text-2xl font-bold mb-1" style={{ color: 'var(--primary)', fontFamily: 'var(--font-headline)' }}>02</p>
                <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--on-surface-variant)' }}>Organize</p>
              </div>
              <div className="card">
                <p className="text-2xl font-bold mb-1" style={{ color: 'var(--primary)', fontFamily: 'var(--font-headline)' }}>03</p>
                <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--on-surface-variant)' }}>Analyze</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-4 text-center ghost-border" style={{ borderTop: '1px solid rgba(68, 71, 72, 0.15)' }}>
        <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--on-surface-dim)' }}>
          THE KINETIC ATELIER — <span style={{ color: 'var(--primary)' }}>System Online</span>
        </p>
      </footer>
    </div>
  );
}
