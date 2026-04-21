// import React from 'react';
// import { 
//   DollarSign, 
//   ShoppingBag, 
//   Package, 
//   Users, 
//   TrendingUp, 
//   Zap,
//   ArrowUpRight,
//   ArrowDownRight
// } from 'lucide-react';
// import AnalyticsCard from '../../components/AnalyticsCard';
// import { MOCK_ANALYTICS } from '../../data/mockAnalytics';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// export default function Overview() {
//   return (
//     <div className="space-y-10">
//       <div className="flex items-center justify-between" data-aos="fade-down">
//         <div>
//           <h1 className="text-4xl font-black tracking-tighter italic uppercase">Admin Overview</h1>
//           <p className="text-app-text-muted text-xs font-bold uppercase tracking-widest mt-1">Real-time performance tracking</p>
//         </div>
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2 bg-app-card border border-app-border px-4 py-2 rounded-full">
//             <div className="w-2 h-2 bg-tertiary-accent rounded-full animate-ping" />
//             <span className="text-xs font-black uppercase tracking-widest">{MOCK_ANALYTICS.activeVisitors} Active Now</span>
//           </div>
//           <button className="btn-primary py-2 px-6 text-xs">EXPORT REPORT</button>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//         <AnalyticsCard 
//           title="Total Revenue" 
//           value={`$${MOCK_ANALYTICS.totalRevenue.toLocaleString()}`} 
//           icon={DollarSign} 
//           trend="+12.5%" 
//           color="purple"
//         />
//         <AnalyticsCard 
//           title="Total Orders" 
//           value={MOCK_ANALYTICS.totalOrders} 
//           icon={ShoppingBag} 
//           trend="+8.2%" 
//           color="pink"
//         />
//         <AnalyticsCard 
//           title="Total Products" 
//           value={MOCK_ANALYTICS.totalProducts} 
//           icon={Package} 
//           trend="+2" 
//           color="green"
//         />
//         <AnalyticsCard 
//           title="New Users" 
//           value="1,240" 
//           icon={Users} 
//           trend="+15.4%" 
//           color="orange"
//         />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Revenue Chart */}
//         <div className="lg:col-span-2 bg-app-card border border-app-border p-8 rounded-3xl" data-aos="fade-up">
//           <div className="flex items-center justify-between mb-8">
//             <h3 className="text-xl font-black tracking-tighter italic uppercase">Revenue Trends</h3>
//             <select className="bg-app-bg border border-app-border rounded-lg py-1 px-3 text-[10px] font-black uppercase tracking-widest">
//               <option>Last 7 Days</option>
//               <option>Last 30 Days</option>
//             </select>
//           </div>
//           <div className="h-[300px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <AreaChart data={MOCK_ANALYTICS.revenueData}>
//                 <defs>
//                   <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="5%" stopColor="var(--color-primary-accent)" stopOpacity={0.3}/>
//                     <stop offset="95%" stopColor="var(--color-primary-accent)" stopOpacity={0}/>
//                   </linearGradient>
//                 </defs>
//                 <CartesianGrid strokeDasharray="3 3" stroke="var(--color-app-border)" vertical={false} />
//                 <XAxis dataKey="day" stroke="var(--color-app-text-muted)" fontSize={12} fontWeight="bold" axisLine={false} tickLine={false} />
//                 <YAxis stroke="var(--color-app-text-muted)" fontSize={12} fontWeight="bold" axisLine={false} tickLine={false} />
//                 <Tooltip 
//                   contentStyle={{ backgroundColor: 'var(--color-app-card)', border: '1px solid var(--color-app-border)', borderRadius: '12px' }}
//                   itemStyle={{ color: 'var(--color-primary-accent)', fontWeight: 'bold' }}
//                 />
//                 <Area type="monotone" dataKey="revenue" stroke="var(--color-primary-accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
//               </AreaChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="bg-app-card border border-app-border p-8 rounded-3xl" data-aos="fade-up" data-aos-delay="100">
//           <h3 className="text-xl font-black tracking-tighter italic uppercase mb-8">Recent Activity</h3>
//           <div className="space-y-6">
//             {[1, 2, 3, 4, 5].map(i => (
//               <div key={i} className="flex items-center gap-4">
//                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${i % 2 === 0 ? 'bg-tertiary-accent/10 text-tertiary-accent' : 'bg-primary-accent/10 text-primary-accent'}`}>
//                   {i % 2 === 0 ? <ShoppingBag size={18} /> : <Zap size={18} />}
//                 </div>
//                 <div>
//                   <p className="text-xs font-bold">New order #PLG-{1000 + i}</p>
//                   <p className="text-[10px] text-app-text-muted font-bold uppercase tracking-widest">{i * 5} mins ago</p>
//                 </div>
//                 <div className="ml-auto">
//                   <p className="text-xs font-black">${(Math.random() * 200 + 100).toFixed(2)}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button className="w-full mt-8 py-3 rounded-xl border border-app-border text-[10px] font-black uppercase tracking-widest hover:bg-app-bg transition-all">
//             VIEW ALL ACTIVITY
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  ShoppingCart,
  Clock
} from 'lucide-react';
import AnalyticsCard from '../../components/AnalyticsCard';
import { getAdminOverview } from '../../api/analytics';

export default function Overview() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAdminOverview();
        setOverview(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-12 text-center">Loading analytics...</div>;
  if (error) return <div className="p-12 text-center text-neon-pink">Error: {error}</div>;
  if (!overview) return null;

  // Format currency
  const formatMoney = (amount) => `Ksh ${amount?.toLocaleString() ?? 0}`;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between" data-aos="fade-down">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase">Admin Overview</h1>
          <p className="text-app-text-muted text-xs font-bold uppercase tracking-widest mt-1">Real-time performance tracking</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-app-card border border-app-border px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-tertiary-accent rounded-full animate-ping" />
            <span className="text-xs font-black uppercase tracking-widest">{overview.activeVisitors} Active Now</span>
          </div>
          <button className="btn-primary py-2 px-6 text-xs">EXPORT REPORT</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard 
          title="Total Revenue (All)" 
          value={formatMoney(overview.totalRevenueAll)} 
          icon={DollarSign} 
          trend="+12.5%" 
          color="purple"
        />
        <AnalyticsCard 
          title="Total Orders" 
          value={overview.totalOrders} 
          icon={ShoppingBag} 
          trend="+8.2%" 
          color="pink"
        />
        <AnalyticsCard 
          title="Active Products" 
          value={overview.totalProducts} 
          icon={Package} 
          trend="+2" 
          color="green"
        />
        <AnalyticsCard 
          title="Total Users" 
          value={overview.totalUsers || 'N/A'} 
          icon={Users} 
          trend="+15.4%" 
          color="orange"
        />
      </div>

      {/* Optional: quick status breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-app-card border border-app-border p-6 rounded-3xl">
          <h3 className="text-lg font-black tracking-tighter italic uppercase mb-4">Orders by Status</h3>
          <div className="space-y-2">
            {Object.entries(overview.ordersCountByStatus || {}).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center border-b border-app-border py-2">
                <span className="text-sm font-bold">{status}</span>
                <span className="text-lg font-black">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-app-card border border-app-border p-6 rounded-3xl">
          <h3 className="text-lg font-black tracking-tighter italic uppercase mb-4">Revenue by Status</h3>
          <div className="space-y-2">
            {Object.entries(overview.revenueByStatus || {}).map(([status, amount]) => (
              <div key={status} className="flex justify-between items-center border-b border-app-border py-2">
                <span className="text-sm font-bold">{status}</span>
                <span className="text-lg font-black">{formatMoney(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity / Orders */}
      <div className="bg-app-card border border-app-border p-8 rounded-3xl">
        <h3 className="text-xl font-black tracking-tighter italic uppercase mb-8">Recent Orders</h3>
        <div className="space-y-6">
          {overview.recentOrders?.length === 0 ? (
            <p className="text-gray-500 text-center">No recent orders</p>
          ) : (
            overview.recentOrders?.map((order) => (
              <div key={order.orderId} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-accent/10 text-primary-accent">
                  <ShoppingCart size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold">{order.customerName} – {order.status}</p>
                  <p className="text-[10px] text-app-text-muted font-bold uppercase tracking-widest">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black">{formatMoney(order.amount)}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <button className="w-full mt-8 py-3 rounded-xl border border-app-border text-[10px] font-black uppercase tracking-widest hover:bg-app-bg transition-all">
          VIEW ALL ORDERS
        </button>
      </div>
    </div>
  );
}