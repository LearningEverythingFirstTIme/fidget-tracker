'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Sparkles, Settings, HelpCircle } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + '/');
  };

  return (
    <aside className="sidebar hidden md:flex">
      <div className="sidebar-logo">
        <h1>THE VAULT</h1>
        <p>Precision Curator</p>
      </div>
      
      <nav className="sidebar-nav">
        <Link 
          href="/" 
          className={`sidebar-nav-item ${isActive('/') && !isActive('/add') && !isActive('/item') ? 'sidebar-nav-item-active' : ''}`}
        >
          <LayoutGrid className="h-5 w-5" />
          <span>Collection</span>
        </Link>
        <Link 
          href="/?status=wishlist" 
          className="sidebar-nav-item"
        >
          <Sparkles className="h-5 w-5" />
          <span>Wishlist</span>
        </Link>
      </nav>
      
      <div className="sidebar-footer">
        <Link href="#" className="sidebar-footer-item">
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
        <Link href="#" className="sidebar-footer-item">
          <HelpCircle className="h-5 w-5" />
          <span>Support</span>
        </Link>
      </div>
    </aside>
  );
}
