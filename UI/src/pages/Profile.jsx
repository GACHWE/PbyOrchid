import React, { useState, useEffect } from 'react';
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
  Loader2,
  Calendar
} from 'lucide-react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { getUserOrders } from '../api/orders';
import { showToast } from '../utils/toast';

export default function Profile() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuthStore();
  const { totalItems: wishlistCount } = useWishlistStore();
  const navigate = useNavigate();

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  // Fetch user orders
  useEffect(() => {
    if (isAuthenticated) {
      const fetchOrders = async () => {
        setOrdersLoading(true);
        setOrdersError(null);
        try {
          const data = await getUserOrders(0, 5, 'createdAt,desc');
          setOrders(data.content || []);
        } catch (err) {
          setOrdersError(err.message);
          showToast('Failed to load orders', 'error');
        } finally {
          setOrdersLoading(false);
        }
      };
      fetchOrders();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get member since (from user.createdAt if available)
  const memberSince = user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024';

  // Show loading spinner while checking auth
  if (authLoading) {
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
              <p className="text-3xl font-black tracking-tighter">{orders.length}</p>
            </div>
            <div className="bg-app-card border border-app-border p-6 rounded-3xl">
              <p className="text-[10px] font-black text-app-text-muted uppercase tracking-widest mb-2">Wishlist Items</p>
              <p className="text-3xl font-black tracking-tighter">{wishlistCount || 0}</p>
            </div>
            <div className="bg-app-card border border-app-border p-6 rounded-3xl">
              <p className="text-[10px] font-black text-app-text-muted uppercase tracking-widest mb-2">Member Since</p>
              <p className="text-3xl font-black tracking-tighter">{memberSince}</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div data-aos="fade-up" data-aos-delay="100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black tracking-tighter italic uppercase">Recent Orders</h2>
              {orders.length > 0 && (
                <button className="text-primary-accent text-[10px] font-black uppercase tracking-widest hover:underline">
                  View All
                </button>
              )}
            </div>

            {ordersLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 size={32} className="animate-spin text-primary-accent" />
              </div>
            ) : ordersError ? (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
                <p className="text-red-500 text-sm">Failed to load orders: {ordersError}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn-outline mt-4 text-xs"
                >
                  Retry
                </button>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-app-card border border-app-border rounded-3xl p-12 text-center">
                <ShoppingBag size={48} className="mx-auto text-app-text-muted mb-4" />
                <p className="text-app-text-muted font-bold uppercase tracking-widest text-sm mb-4">
                  No orders yet
                </p>
                <Link to="/shop" className="btn-primary text-sm py-2 px-6">
                  START SHOPPING
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-app-card border border-app-border rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-xl bg-app-bg border border-app-border flex items-center justify-center text-primary-accent">
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <p className="font-black text-lg">Order #{order.id?.slice(0, 8)}...</p>
                        <p className="text-[10px] text-app-text-muted font-bold uppercase tracking-widest">
                          Placed on {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-center md:text-right">
                        <p className={`text-xs font-black uppercase tracking-widest mb-1 ${
                          order.status === 'DELIVERED' ? 'text-green-500' :
                          order.status === 'CANCELLED' ? 'text-red-500' :
                          order.status === 'CONFIRMED' ? 'text-blue-500' :
                          'text-yellow-500'
                        }`}>
                          {order.status}
                        </p>
                        <p className="text-xl font-black">${order.totalAmount?.toFixed(2) || '0.00'}</p>
                      </div>
                      <Link 
                        to={`/orders/${order.id}`}
                        className="btn-outline py-2 px-6 text-xs"
                      >
                        DETAILS
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                  <p className="text-sm font-bold">Password Protected</p>
                </div>
              </div>
              {user?.phoneNumber && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-app-bg border border-app-border flex items-center justify-center text-secondary-accent"><Calendar size={20} /></div>
                  <div>
                    <p className="text-[10px] font-black text-app-text-muted uppercase tracking-widest">Phone Number</p>
                    <p className="text-sm font-bold">{user.phoneNumber}</p>
                  </div>
                </div>
              )}
              {user?.createdAt && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-app-bg border border-app-border flex items-center justify-center text-quaternary-accent"><Calendar size={20} /></div>
                  <div>
                    <p className="text-[10px] font-black text-app-text-muted uppercase tracking-widest">Joined</p>
                    <p className="text-sm font-bold">{formatDate(user.createdAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}