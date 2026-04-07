import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { 
  User, 
  Package, 
  Heart, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ShoppingBag,
  Mail,
  Shield,
  MapPin,
  Loader2
} from 'lucide-react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Profile() {
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Loader2 size={48} className="animate-spin text-primary-accent" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6" data-aos="fade-right">
          <div className="bg-app-card border border-app-border rounded-3xl p-8 text-center">
            <div className="w-24 h-24 rounded-full bg-primary-accent/20 border-2 border-primary-accent flex items-center justify-center mx-auto mb-6 neon-glow">
              <User size={48} className="text-primary-accent" />
            </div>
            <h3 className="text-2xl font-black tracking-tighter italic uppercase">
              {user?.name || user?.email?.split('@')[0] || 'User'}
            </h3>
            <p className="text-app-text-muted text-xs font-bold uppercase tracking-widest mb-6 capitalize">
              {user?.role || 'buyer'}
            </p>
            <button onClick={handleLogout} className="text-secondary-accent font-black text-[10px] uppercase tracking-widest flex items-center gap-2 mx-auto hover:brightness-110">
              <LogOut size={14} /> Log Out
            </button>
          </div>

          <nav className="bg-app-card border border-app-border rounded-3xl p-4 flex flex-col gap-2">
            <button className="flex items-center justify-between p-4 rounded-xl bg-primary-accent/10 text-primary-accent font-black text-sm uppercase tracking-widest border border-primary-accent/20">
              <div className="flex items-center gap-3"><Package size={18} /> Orders</div>
              <ChevronRight size={16} />
            </button>
            <Link to="/wishlist" className="flex items-center justify-between p-4 rounded-xl hover:bg-app-bg text-app-text-muted hover:text-app-text font-black text-sm uppercase tracking-widest transition-all">
              <div className="flex items-center gap-3"><Heart size={18} /> Wishlist</div>
              <ChevronRight size={16} />
            </Link>
            <button className="flex items-center justify-between p-4 rounded-xl hover:bg-app-bg text-app-text-muted hover:text-app-text font-black text-sm uppercase tracking-widest transition-all">
              <div className="flex items-center gap-3"><MapPin size={18} /> Addresses</div>
              <ChevronRight size={16} />
            </button>
            <button className="flex items-center justify-between p-4 rounded-xl hover:bg-app-bg text-app-text-muted hover:text-app-text font-black text-sm uppercase tracking-widest transition-all">
              <div className="flex items-center gap-3"><Settings size={18} /> Settings</div>
              <ChevronRight size={16} />
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-12">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" data-aos="fade-up">
            <div className="bg-app-card border border-app-border p-6 rounded-3xl">
              <p className="text-[10px] font-black text-app-text-muted uppercase tracking-widest mb-2">Total Orders</p>
              <p className="text-3xl font-black tracking-tighter">12</p> {/* TODO: fetch real order count */}
            </div>
            <div className="bg-app-card border border-app-border p-6 rounded-3xl">
              <p className="text-[10px] font-black text-app-text-muted uppercase tracking-widest mb-2">Wishlist Items</p>
              <p className="text-3xl font-black tracking-tighter">{wishlistItems.length}</p>
            </div>
            <div className="bg-app-card border border-app-border p-6 rounded-3xl">
              <p className="text-[10px] font-black text-app-text-muted uppercase tracking-widest mb-2">Member Since</p>
              <p className="text-3xl font-black tracking-tighter">2024</p> {/* TODO: fetch from API */}
            </div>
          </div>

          {/* Recent Orders */}
          <div data-aos="fade-up" data-aos-delay="100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black tracking-tighter italic uppercase">Recent Orders</h2>
              <button className="text-primary-accent text-[10px] font-black uppercase tracking-widest hover:underline">View All</button>
            </div>

            <div className="space-y-4">
              {[1, 2].map(order => (
                <div key={order} className="bg-app-card border border-app-border rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-xl bg-app-bg border border-app-border flex items-center justify-center text-primary-accent">
                      <ShoppingBag size={24} />
                    </div>
                    <div>
                      <p className="font-black text-lg">Order #PLG-{1000 + order}</p>
                      <p className="text-[10px] text-app-text-muted font-bold uppercase tracking-widest">Placed on March {20 - order}, 2026</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-8">
                    <div className="text-center md:text-right">
                      <p className="text-xs font-black text-tertiary-accent uppercase tracking-widest mb-1">Delivered</p>
                      <p className="text-xl font-black">$245.00</p>
                    </div>
                    <button className="btn-outline py-2 px-6 text-xs">DETAILS</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-app-card border border-app-border rounded-3xl p-8" data-aos="fade-up" data-aos-delay="200">
            <h2 className="text-3xl font-black tracking-tighter italic uppercase mb-8">Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-app-bg border border-app-border flex items-center justify-center text-primary-accent"><Mail size={20} /></div>
                <div>
                  <p className="text-[10px] font-black text-app-text-muted uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-app-bg border border-app-border flex items-center justify-center text-tertiary-accent"><Shield size={20} /></div>
                <div>
                  <p className="text-[10px] font-black text-app-text-muted uppercase tracking-widest">Security Status</p>
                  <p className="text-sm font-bold">Two-Factor Enabled</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}