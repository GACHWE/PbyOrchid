import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Heart, 
  BarChart3, 
  Users, 
  Settings,
  ArrowLeft
} from 'lucide-react';

export default function AdminSidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: Heart, label: 'Wishlist Analytics', path: '/admin/wishlist' },
    { icon: BarChart3, label: 'Sales Analytics', path: '/admin/sales' },
    { icon: Users, label: 'User Stats', path: '/admin/users' },
  ];

  return (
    <aside className="w-64 bg-app-card border-r border-app-border h-screen sticky top-0 flex flex-col">
      <div className="p-6 border-b border-app-border">
        <NavLink to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-tertiary-accent rounded flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-300">
            <ArrowLeft size={16} className="text-black" />
          </div>
          <span className="text-lg font-black tracking-tighter italic">BACK TO STORE</span>
        </NavLink>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/admin'}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300
              ${isActive 
                ? 'bg-primary-accent/10 text-primary-accent border border-primary-accent/20 neon-glow' 
                : 'text-app-text-muted hover:bg-app-bg hover:text-app-text'
              }
            `}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto border-t border-app-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-app-text-muted hover:bg-app-bg hover:text-app-text transition-all">
          <Settings size={20} />
          Settings
        </button>
      </div>
    </aside>
  );
}
