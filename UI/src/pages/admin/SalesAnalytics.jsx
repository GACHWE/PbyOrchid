// import React from 'react';
// import { DollarSign, PieChart as PieChartIcon, TrendingUp, ArrowUpRight, ShoppingBag } from 'lucide-react';
// import { MOCK_ANALYTICS } from '../../data/mockAnalytics';
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// export default function SalesAnalytics() {
//   const COLORS = ['#A855F7', '#EC4899', '#84CC16', '#F97316'];

//   return (
//     <div className="space-y-10">
//       <div className="flex items-center justify-between" data-aos="fade-down">
//         <div>
//           <h1 className="text-4xl font-black tracking-tighter italic uppercase">Sales Analytics</h1>
//           <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Deep dive into your revenue</p>
//         </div>
//         <div className="flex items-center gap-4">
//           <select className="bg-dark-card border border-dark-border rounded-full py-2 px-6 text-[10px] font-black uppercase tracking-widest">
//             <option>Last 30 Days</option>
//             <option>Last 90 Days</option>
//             <option>This Year</option>
//           </select>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Sales by Category */}
//         <div className="bg-dark-card border border-dark-border p-8 rounded-3xl" data-aos="fade-up">
//           <h3 className="text-xl font-black tracking-tighter italic uppercase mb-8">Sales by Category</h3>
//           <div className="h-[300px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <PieChart>
//                 <Pie
//                   data={MOCK_ANALYTICS.salesByCategory}
//                   cx="50%"
//                   cy="50%"
//                   innerRadius={60}
//                   outerRadius={100}
//                   paddingAngle={5}
//                   dataKey="value"
//                 >
//                   {MOCK_ANALYTICS.salesByCategory.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Pie>
//                 <Tooltip 
//                   contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
//                   itemStyle={{ color: '#fff', fontWeight: 'bold' }}
//                 />
//                 <Legend verticalAlign="bottom" height={36} />
//               </PieChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Top Selling Sneakers */}
//         <div className="lg:col-span-2 bg-dark-card border border-dark-border p-8 rounded-3xl" data-aos="fade-up" data-aos-delay="100">
//           <h3 className="text-xl font-black tracking-tighter italic uppercase mb-8">Top Selling Sneakers</h3>
//           <div className="space-y-6">
//             {[1, 2, 3, 4].map(i => (
//               <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-dark-bg border border-dark-border hover:border-neon-purple transition-all group">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-neon-purple font-black">
//                     #{i}
//                   </div>
//                   <div>
//                     <p className="font-black text-sm">Air Jordan {i} Retro</p>
//                     <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{120 - i * 10} Sales</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-sm font-black text-neon-green">${(20000 - i * 2000).toLocaleString()}</p>
//                   <div className="flex items-center gap-1 text-neon-green text-[10px] font-black uppercase">
//                     <ArrowUpRight size={12} /> {15 - i}%
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Monthly Performance */}
//       <div className="bg-dark-card border border-dark-border p-8 rounded-3xl" data-aos="fade-up">
//         <h3 className="text-xl font-black tracking-tighter italic uppercase mb-8">Monthly Revenue Performance</h3>
//         <div className="h-[350px] w-full">
//           <ResponsiveContainer width="100%" height="100%">
//             <BarChart data={MOCK_ANALYTICS.revenueData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
//               <XAxis dataKey="day" stroke="#525252" fontSize={12} fontWeight="bold" axisLine={false} tickLine={false} />
//               <YAxis stroke="#525252" fontSize={12} fontWeight="bold" axisLine={false} tickLine={false} />
//               <Tooltip 
//                 contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
//                 cursor={{ fill: '#262626' }}
//               />
//               <Bar dataKey="revenue" fill="#A855F7" radius={[10, 10, 0, 0]} />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { DollarSign, PieChart as PieChartIcon, TrendingUp, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { getRevenueTrends, getTopSellers, getVisitorStats } from '../../api/analytics';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function SalesAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revenueData, setRevenueData] = useState([]);
  const [salesByCategory, setSalesByCategory] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const COLORS = ['#A855F7', '#EC4899', '#84CC16', '#F97316'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Get revenue trends for last 30 days
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        const revenue = await getRevenueTrends(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
        setRevenueData(revenue || []);
        
        // Get top sellers
        const top = await getTopSellers(10);
        setTopSellers(top || []);
        
        // For sales by category, we might need a separate endpoint; for now, use mock or derive from product data.
        // Placeholder:
        setSalesByCategory([
          { name: 'Lifestyle', value: 35 },
          { name: 'Basketball', value: 45 },
          { name: 'Running', value: 20 },
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-12 text-center">Loading analytics...</div>;
  if (error) return <div className="p-12 text-center text-neon-pink">Error: {error}</div>;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between" data-aos="fade-down">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase">Sales Analytics</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Deep dive into your revenue</p>
        </div>
        <div className="flex items-center gap-4">
          <select className="bg-dark-card border border-dark-border rounded-full py-2 px-6 text-[10px] font-black uppercase tracking-widest">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
            <option>This Year</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales by Category */}
        <div className="bg-dark-card border border-dark-border p-8 rounded-3xl" data-aos="fade-up">
          <h3 className="text-xl font-black tracking-tighter italic uppercase mb-8">Sales by Category</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {salesByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Sneakers */}
        <div className="lg:col-span-2 bg-dark-card border border-dark-border p-8 rounded-3xl" data-aos="fade-up" data-aos-delay="100">
          <h3 className="text-xl font-black tracking-tighter italic uppercase mb-8">Top Selling Sneakers</h3>
          <div className="space-y-6">
            {topSellers.map((product, idx) => (
              <div key={product.id} className="flex items-center justify-between p-4 rounded-2xl bg-dark-bg border border-dark-border hover:border-neon-purple transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-dark-card border border-dark-border flex items-center justify-center text-neon-purple font-black">
                    #{idx + 1}
                  </div>
                  <div>
                    <p className="font-black text-sm">{product.name}</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{product.salesCount} Sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-neon-green">${product.totalRevenue?.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-neon-green text-[10px] font-black uppercase">
                    <ArrowUpRight size={12} /> {product.trend || '12%'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="bg-dark-card border border-dark-border p-8 rounded-3xl" data-aos="fade-up">
        <h3 className="text-xl font-black tracking-tighter italic uppercase mb-8">Monthly Revenue Performance</h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
              <XAxis dataKey="day" stroke="#525252" fontSize={12} fontWeight="bold" axisLine={false} tickLine={false} />
              <YAxis stroke="#525252" fontSize={12} fontWeight="bold" axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
                cursor={{ fill: '#262626' }}
              />
              <Bar dataKey="revenue" fill="#A855F7" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}