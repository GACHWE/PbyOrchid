// import React from 'react';
// import { Heart, TrendingUp, BarChart3, ArrowUpRight, Zap } from 'lucide-react';
// import { MOCK_ANALYTICS } from '../../data/mockAnalytics';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// export default function WishlistAnalytics() {
//   const COLORS = ['#A855F7', '#EC4899', '#84CC16', '#F97316', '#3B82F6'];

//   return (
//     <div className="space-y-10">
//       <div className="flex items-center justify-between" data-aos="fade-down">
//         <div>
//           <h1 className="text-4xl font-black tracking-tighter italic uppercase">Wishlist Analytics</h1>
//           <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Understanding customer desire</p>
//         </div>
//         <div className="flex items-center gap-2 bg-neon-pink/10 border border-neon-pink/20 px-4 py-2 rounded-full text-neon-pink">
//           <Heart size={16} fill="currentColor" />
//           <span className="text-xs font-black uppercase tracking-widest">High Intent Tracking</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         {/* Most Wishlisted Chart */}
//         <div className="bg-dark-card border border-dark-border p-8 rounded-3xl" data-aos="fade-up">
//           <h3 className="text-xl font-black tracking-tighter italic uppercase mb-8">Most Wishlisted Products</h3>
//           <div className="h-[400px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={MOCK_ANALYTICS.topWishlisted} layout="vertical">
//                 <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
//                 <XAxis type="number" stroke="#525252" fontSize={12} fontWeight="bold" axisLine={false} tickLine={false} />
//                 <YAxis dataKey="name" type="category" stroke="#525252" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} width={150} />
//                 <Tooltip 
//                   contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
//                   itemStyle={{ color: '#EC4899', fontWeight: 'bold' }}
//                 />
//                 <Bar dataKey="count" radius={[0, 10, 10, 0]}>
//                   {MOCK_ANALYTICS.topWishlisted.map((entry, index) => (
//                     <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                   ))}
//                 </Bar>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>

//         {/* Wishlist Trends */}
//         <div className="bg-dark-card border border-dark-border p-8 rounded-3xl" data-aos="fade-up" data-aos-delay="100">
//           <h3 className="text-xl font-black tracking-tighter italic uppercase mb-8">Wishlist Growth</h3>
//           <div className="h-[400px] w-full">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={MOCK_ANALYTICS.wishlistTrends}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
//                 <XAxis dataKey="week" stroke="#525252" fontSize={12} fontWeight="bold" axisLine={false} tickLine={false} />
//                 <YAxis stroke="#525252" fontSize={12} fontWeight="bold" axisLine={false} tickLine={false} />
//                 <Tooltip 
//                   contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
//                   itemStyle={{ color: '#84CC16', fontWeight: 'bold' }}
//                 />
//                 <Bar dataKey="count" fill="#84CC16" radius={[10, 10, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </div>
//       </div>

//       {/* Conversion Insights */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//         <div className="bg-dark-card border border-dark-border p-8 rounded-3xl" data-aos="fade-up">
//           <div className="w-12 h-12 rounded-2xl bg-neon-purple/10 text-neon-purple flex items-center justify-center mb-6">
//             <TrendingUp size={24} />
//           </div>
//           <h4 className="text-lg font-black tracking-tighter italic uppercase mb-2">Conversion Rate</h4>
//           <p className="text-3xl font-black text-neon-purple mb-4">24.5%</p>
//           <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Wishlist to cart conversion is up by 5% this month.</p>
//         </div>
        
//         <div className="bg-dark-card border border-dark-border p-8 rounded-3xl" data-aos="fade-up" data-aos-delay="100">
//           <div className="w-12 h-12 rounded-2xl bg-neon-green/10 text-neon-green flex items-center justify-center mb-6">
//             <Zap size={24} />
//           </div>
//           <h4 className="text-lg font-black tracking-tighter italic uppercase mb-2">Hot Item</h4>
//           <p className="text-3xl font-black text-neon-green mb-4">Jordan 1 OG</p>
//           <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Most wishlisted item in the last 24 hours.</p>
//         </div>

//         <div className="bg-dark-card border border-dark-border p-8 rounded-3xl" data-aos="fade-up" data-aos-delay="200">
//           <div className="w-12 h-12 rounded-2xl bg-neon-pink/10 text-neon-pink flex items-center justify-center mb-6">
//             <BarChart3 size={24} />
//           </div>
//           <h4 className="text-lg font-black tracking-tighter italic uppercase mb-2">Total Saves</h4>
//           <p className="text-3xl font-black text-neon-pink mb-4">12,450</p>
//           <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Cumulative wishlist saves across all products.</p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { Heart, TrendingUp, BarChart3, ArrowUpRight, Zap } from 'lucide-react';
import { getAdminOverview } from '../../api/analytics'; // changed import
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function WishlistAnalytics() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [topWishlisted, setTopWishlisted] = useState([]);
  const [wishlistTrends, setWishlistTrends] = useState([]);
  const COLORS = ['#A855F7', '#EC4899', '#84CC16', '#F97316', '#3B82F6'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Single API call to get all admin overview data
        const data = await getAdminOverview();
        // Extract topWishlisted from the response
        // The backend returns List<WishlistCount> with fields: productId, productName, count
        const wishlistData = data.topWishlisted || [];
        // Map to the format expected by the chart (name, count)
        const formattedWishlist = wishlistData.map(item => ({
          name: item.productName,
          count: item.count
        }));
        setTopWishlisted(formattedWishlist);
        
        // For trends, we still use mock data (or you can implement a separate endpoint later)
        setWishlistTrends([
          { week: 'Week 1', count: 120 },
          { week: 'Week 2', count: 150 },
          { week: 'Week 3', count: 200 },
          { week: 'Week 4', count: 180 },
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-12 text-center">Loading wishlist data...</div>;
  if (error) return <div className="p-12 text-center text-neon-pink">Error: {error}</div>;

  // Calculate total saves (sum of counts)
  const totalSaves = topWishlisted.reduce((sum, p) => sum + (p.count || 0), 0);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between" data-aos="fade-down">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase">Wishlist Analytics</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Understanding customer desire</p>
        </div>
        <div className="flex items-center gap-2 bg-neon-pink/10 border border-neon-pink/20 px-4 py-2 rounded-full text-neon-pink">
          <Heart size={16} fill="currentColor" />
          <span className="text-xs font-black uppercase tracking-widest">High Intent Tracking</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Wishlisted Chart */}
        <div className="bg-dark-card border border-dark-border p-8 rounded-3xl" data-aos="fade-up">
          <h3 className="text-xl font-black tracking-tighter italic uppercase mb-8">Most Wishlisted Products</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topWishlisted} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" horizontal={false} />
                <XAxis type="number" stroke="#525252" fontSize={12} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#525252" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} width={150} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
                  itemStyle={{ color: '#EC4899', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" radius={[0, 10, 10, 0]}>
                  {topWishlisted.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wishlist Trends (mock for now) */}
        <div className="bg-dark-card border border-dark-border p-8 rounded-3xl" data-aos="fade-up" data-aos-delay="100">
          <h3 className="text-xl font-black tracking-tighter italic uppercase mb-8">Wishlist Growth</h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={wishlistTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" vertical={false} />
                <XAxis dataKey="week" stroke="#525252" fontSize={12} fontWeight="bold" axisLine={false} tickLine={false} />
                <YAxis stroke="#525252" fontSize={12} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '12px' }}
                  itemStyle={{ color: '#84CC16', fontWeight: 'bold' }}
                />
                <Bar dataKey="count" fill="#84CC16" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Conversion Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-dark-card border border-dark-border p-8 rounded-3xl" data-aos="fade-up">
          <div className="w-12 h-12 rounded-2xl bg-neon-purple/10 text-neon-purple flex items-center justify-center mb-6">
            <TrendingUp size={24} />
          </div>
          <h4 className="text-lg font-black tracking-tighter italic uppercase mb-2">Conversion Rate</h4>
          <p className="text-3xl font-black text-neon-purple mb-4">24.5%</p>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Wishlist to cart conversion is up by 5% this month.</p>
        </div>
        
        <div className="bg-dark-card border border-dark-border p-8 rounded-3xl" data-aos="fade-up" data-aos-delay="100">
          <div className="w-12 h-12 rounded-2xl bg-neon-green/10 text-neon-green flex items-center justify-center mb-6">
            <Zap size={24} />
          </div>
          <h4 className="text-lg font-black tracking-tighter italic uppercase mb-2">Hot Item</h4>
          <p className="text-3xl font-black text-neon-green mb-4">{topWishlisted[0]?.name || 'N/A'}</p>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Most wishlisted item in the last 24 hours.</p>
        </div>

        <div className="bg-dark-card border border-dark-border p-8 rounded-3xl" data-aos="fade-up" data-aos-delay="200">
          <div className="w-12 h-12 rounded-2xl bg-neon-pink/10 text-neon-pink flex items-center justify-center mb-6">
            <BarChart3 size={24} />
          </div>
          <h4 className="text-lg font-black tracking-tighter italic uppercase mb-2">Total Saves</h4>
          <p className="text-3xl font-black text-neon-pink mb-4">{totalSaves.toLocaleString()}</p>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-relaxed">Cumulative wishlist saves across all products.</p>
        </div>
      </div>
    </div>
  );
}