'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useAuth, SignInButton, UserButton } from '@clerk/nextjs';
import ItemCard from '@/components/ItemCard';
import { Plus, Package, DollarSign, Grid3X3, ChevronRight, Terminal, Sparkles } from 'lucide-react';

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

function TypingText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);
  
  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);
  
  useEffect(() => {
    if (!started) return;
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    
    return () => clearInterval(interval);
  }, [text, started]);
  
  return (
    <span>
      {displayed}
      <span className="animate-pulse" style={{ color: 'var(--accent)' }}>_</span>
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image skeleton mb-4"></div>
      <div className="skeleton-text skeleton"></div>
      <div className="skeleton-text skeleton skeleton-text-sm"></div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="skeleton-text skeleton skeleton-text-lg"></div>
        <div className="skeleton skeleton" style={{ width: '60px', height: '20px' }}></div>
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
    if (!isSignedIn) {
      return;
    }
    
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
    if (!confirm('DELETE: Confirm removal from collection?')) return;
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    setItems(items.filter(i => i.id !== id));
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <Terminal className="h-8 w-8 mx-auto mb-4 animate-pulse" style={{ color: 'var(--accent)' }} />
            <div className="absolute inset-0 blur-lg animate-pulse" style={{ background: 'rgba(0, 229, 204, 0.3)' }}></div>
          </div>
          <p className="text-sm uppercase tracking-widest" style={{ color: 'var(--foreground-muted)' }}>INITIALIZING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="animated-bg"></div>
      <div className="grid-overlay"></div>
      
      <header className="header-enhanced">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="header-logo-animated w-8 h-8 flex items-center justify-center border animate-flicker" style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                <span className="text-sm font-bold">FT</span>
              </div>
              <div>
                <h1 className="header-title gradient-text">FIDGET://TRACKER</h1>
                <p className="header-subtitle">Collection Management System v2.0</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {!isSignedIn ? (
              <SignInButton>
                <button className="btn btn-primary btn-glow btn-magnetic">
                  <ChevronRight className="h-4 w-4" />
                  ACCESS
                </button>
              </SignInButton>
            ) : (
              <>
                <Link href="/add" className="btn btn-primary btn-glow btn-magnetic">
                  <Plus className="h-4 w-4 icon-hover-rotate" />
                  NEW_ENTRY
                </Link>
                <div className="glass" style={{ padding: '2px' }}>
                  <UserButton />
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {isSignedIn ? (
        <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          <div ref={statsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="stat-card-enhanced">
              <div className="stat-icon icon-hover-rotate">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="stat-value count-up">{animatedItems}</p>
                <p className="stat-label">Total Items</p>
              </div>
            </div>
            <div className="stat-card-enhanced card-accent">
              <div className="stat-icon icon-pulse" style={{ borderColor: 'var(--status-owned)', color: 'var(--status-owned)' }}>
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="stat-value count-up">${animatedTotal.toLocaleString()}.00</p>
                <p className="stat-label">Collection Value</p>
              </div>
            </div>
            <div className="stat-card-enhanced">
              <div className="stat-icon icon-hover-rotate">
                <Grid3X3 className="h-5 w-5" />
              </div>
              <div>
                <p className="stat-value count-up">{animatedOwned}</p>
                <p className="stat-label">Owned</p>
              </div>
            </div>
            <div className="stat-card-enhanced">
              <div className="stat-icon" style={{ borderColor: 'var(--status-wishlist)', color: 'var(--status-wishlist)' }}>
                <Sparkles className="h-5 w-5 icon-pulse" />
              </div>
              <div>
                <p className="stat-value count-up">{animatedWishlist}</p>
                <p className="stat-label">Wishlist</p>
              </div>
            </div>
          </div>

          <div className="filter-bar glass" style={{ padding: '16px', marginBottom: '24px' }}>
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
                className="btn btn-secondary btn-magnetic"
              >
                RESET
              </button>
            )}
          </div>

          {loading ? (
            <div className="item-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-stagger" style={{ animationDelay: `${i * 0.1}s` }}>
                  <SkeletonCard />
                </div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state glass" style={{ background: 'rgba(24, 24, 28, 0.8)' }}>
              <Package className="h-16 w-16 mx-auto mb-4 icon-pulse" style={{ color: 'var(--foreground-dim)' }} />
              <h3 className="empty-state-title gradient-text">
                {items.length === 0 ? 'COLLECTION_EMPTY' : 'NO_MATCHING_ITEMS'}
              </h3>
              <p className="empty-state-text">
                {items.length === 0
                  ? 'Initialize your collection by adding your first fidget item.'
                  : 'Adjust search parameters or reset filters.'}
              </p>
              {items.length === 0 && (
                <Link href="/add" className="btn btn-primary btn-glow btn-magnetic">
                  <Plus className="h-4 w-4" />
                  ADD_FIRST_ITEM
                </Link>
              )}
            </div>
          ) : (
            <div className="item-grid">
              {filteredItems.map((item, index) => (
                <div key={item.id} className="card-stagger" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ItemCard item={item} onDelete={deleteItem} />
                </div>
              ))}
            </div>
          )}
        </main>
      ) : (
        <div className="max-w-2xl mx-auto text-center py-24 px-4 relative z-10">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 border-2 mb-6 animate-flicker relative" style={{ borderColor: 'var(--accent)' }}>
              <span className="text-3xl font-bold gradient-text">FT</span>
              <div className="absolute inset-0 animate-pulse" style={{ background: 'radial-gradient(circle, rgba(0, 229, 204, 0.2) 0%, transparent 70%)' }}></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4 gradient-text" style={{ fontSize: '1.75rem' }}>
            <TypingText text="TERMINAL-GRADE COLLECTION MANAGEMENT" delay={300} />
          </h2>
          <p className="mb-8 text-base" style={{ color: 'var(--foreground-muted)' }}>
            Professional tracking for fidget enthusiasts. Monitor spinners, sliders, clickers, and more with precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <SignInButton>
              <button className="btn btn-primary btn-glow btn-magnetic">
                <ChevronRight className="h-4 w-4" />
                INITIALIZE_SESSION
              </button>
            </SignInButton>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-4 text-center">
            <div className="card-enhanced card-holographic">
              <p className="text-2xl font-bold mb-1 gradient-text">01</p>
              <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>Track</p>
            </div>
            <div className="card-enhanced card-holographic">
              <p className="text-2xl font-bold mb-1 gradient-text">02</p>
              <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>Organize</p>
            </div>
            <div className="card-enhanced card-holographic">
              <p className="text-2xl font-bold mb-1 gradient-text">03</p>
              <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>Analyze</p>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t mt-auto py-4 text-center relative z-10 glass" style={{ borderColor: 'var(--border)', background: 'rgba(13, 13, 15, 0.8)' }}>
        <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--foreground-dim)' }}>
          FIDGET://TRACKER — <span style={{ color: 'var(--accent)' }}>System Online</span>
        </p>
      </footer>
    </div>
  );
}
