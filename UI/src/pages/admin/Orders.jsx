// import React, { useState } from 'react';
// import { 
//   Search, 
//   Filter, 
//   ChevronLeft, 
//   ChevronRight,
//   Eye,
//   CheckCircle2,
//   Clock,
//   Truck,
//   XCircle
// } from 'lucide-react';
// import { motion } from 'motion/react';

// export default function Orders() {
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filterStatus, setFilterStatus] = useState('All');

//   const orders = [
//     { id: 'PLG-1245', customer: 'John Doe', date: '2026-03-24', total: 245.00, status: 'Pending', items: 2 },
//     { id: 'PLG-1244', customer: 'Jane Smith', date: '2026-03-24', total: 180.00, status: 'Shipped', items: 1 },
//     { id: 'PLG-1243', customer: 'Mike Johnson', date: '2026-03-23', total: 520.00, status: 'Delivered', items: 3 },
//     { id: 'PLG-1242', customer: 'Sarah Wilson', date: '2026-03-23', total: 110.00, status: 'Cancelled', items: 1 },
//     { id: 'PLG-1241', customer: 'Chris Brown', date: '2026-03-22', total: 340.00, status: 'Delivered', items: 2 },
//     { id: 'PLG-1240', customer: 'Emily Davis', date: '2026-03-22', total: 210.00, status: 'Shipped', items: 1 },
//   ];

//   const statusColors = {
//     Pending: 'text-neon-orange bg-neon-orange/10 border-neon-orange/20',
//     Shipped: 'text-neon-purple bg-neon-purple/10 border-neon-purple/20',
//     Delivered: 'text-neon-green bg-neon-green/10 border-neon-green/20',
//     Cancelled: 'text-neon-pink bg-neon-pink/10 border-neon-pink/20',
//   };

//   const statusIcons = {
//     Pending: Clock,
//     Shipped: Truck,
//     Delivered: CheckCircle2,
//     Cancelled: XCircle,
//   };

//   const filteredOrders = orders.filter(o => 
//     (filterStatus === 'All' || o.status === filterStatus) &&
//     (o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customer.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between" data-aos="fade-down">
//         <div>
//           <h1 className="text-4xl font-black tracking-tighter italic uppercase">Orders</h1>
//           <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Manage customer orders and fulfillment</p>
//         </div>
//         <div className="flex items-center gap-4">
//           <button className="btn-outline py-2 px-6 text-xs">EXPORT CSV</button>
//           <button className="btn-primary py-2 px-6 text-xs">NEW ORDER</button>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex flex-col sm:flex-row items-center justify-between gap-4" data-aos="fade-up">
//         <div className="relative w-full sm:w-96">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
//           <input 
//             type="text" 
//             placeholder="Search orders by ID or customer..." 
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full bg-dark-card border border-dark-border rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-neon-purple transition-all"
//           />
//         </div>
//         <div className="flex items-center gap-2">
//           {['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
//             <button
//               key={status}
//               onClick={() => setFilterStatus(status)}
//               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filterStatus === status ? 'bg-neon-purple text-white border-neon-purple' : 'bg-dark-card border-dark-border text-gray-500 hover:border-neon-purple'}`}
//             >
//               {status}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Table */}
//       <div className="bg-dark-card border border-dark-border rounded-3xl overflow-hidden" data-aos="fade-up">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-dark-bg border-b border-dark-border">
//                 <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Order ID</th>
//                 <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Customer</th>
//                 <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Date</th>
//                 <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Items</th>
//                 <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Total</th>
//                 <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
//                 <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-dark-border">
//               {filteredOrders.map((order) => {
//                 const Icon = statusIcons[order.status];
//                 return (
//                   <tr key={order.id} className="hover:bg-white/5 transition-colors group">
//                     <td className="p-6">
//                       <span className="text-sm font-black text-neon-purple">{order.id}</span>
//                     </td>
//                     <td className="p-6">
//                       <p className="text-sm font-bold">{order.customer}</p>
//                     </td>
//                     <td className="p-6">
//                       <p className="text-xs font-bold text-gray-500">{order.date}</p>
//                     </td>
//                     <td className="p-6">
//                       <p className="text-sm font-bold">{order.items} Items</p>
//                     </td>
//                     <td className="p-6">
//                       <span className="text-sm font-black text-neon-green">${order.total.toFixed(2)}</span>
//                     </td>
//                     <td className="p-6">
//                       <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusColors[order.status]}`}>
//                         <Icon size={12} />
//                         {order.status}
//                       </div>
//                     </td>
//                     <td className="p-6 text-right">
//                       <button className="p-2 rounded-lg hover:bg-neon-purple/10 hover:text-neon-purple transition-all">
//                         <Eye size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         <div className="p-6 border-t border-dark-border flex items-center justify-between">
//           <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Showing {filteredOrders.length} of {orders.length} entries</p>
//           <div className="flex items-center gap-2">
//             <button className="p-2 rounded-lg border border-dark-border text-gray-500 hover:text-white transition-all"><ChevronLeft size={18} /></button>
//             <button className="w-8 h-8 rounded-lg bg-neon-purple text-white font-black text-xs">1</button>
//             <button className="p-2 rounded-lg border border-dark-border text-gray-500 hover:text-white transition-all"><ChevronRight size={18} /></button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { getAllOrders, updateOrderStatus } from '../../api/orders'; // adjust path

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalElements: 0, totalPages: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [updatingId, setUpdatingId] = useState(null);

  const statusColors = {
    Pending: 'text-neon-orange bg-neon-orange/10 border-neon-orange/20',
    Shipped: 'text-neon-purple bg-neon-purple/10 border-neon-purple/20',
    Delivered: 'text-neon-green bg-neon-green/10 border-neon-green/20',
    Cancelled: 'text-neon-pink bg-neon-pink/10 border-neon-pink/20',
  };

  const statusIcons = {
    Pending: Clock,
    Shipped: Truck,
    Delivered: CheckCircle2,
    Cancelled: XCircle,
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        size: pagination.size,
        sort: 'createdAt,desc',
      };
      // If filterStatus is not 'All', we need to pass it as a param if backend supports filtering by status.
      // Assuming the backend accepts a 'status' query param. If not, we'll filter client-side.
      const data = await getAllOrders(params.page, params.size, params.sort);
      // data is a Page object with content, totalElements, totalPages, etc.
      setOrders(data.content || []);
      setPagination(prev => ({
        ...prev,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
      }));
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.page, pagination.size]); // refetch when page/size changes

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      // Refresh orders list to reflect new status
      await fetchOrders();
    } catch (err) {
      console.error('Failed to update status:', err);
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtering client-side (if backend doesn't support status filter)
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    const matchesSearch = order.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between" data-aos="fade-down">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase">Orders</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Manage customer orders and fulfillment</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="btn-outline py-2 px-6 text-xs">EXPORT CSV</button>
          <button className="btn-primary py-2 px-6 text-xs">NEW ORDER</button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4" data-aos="fade-up">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search orders by ID or customer..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-full py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-neon-purple transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${filterStatus === status ? 'bg-neon-purple text-white border-neon-purple' : 'bg-dark-card border-dark-border text-gray-500 hover:border-neon-purple'}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-dark-card border border-dark-border rounded-3xl overflow-hidden" data-aos="fade-up">
        {loading ? (
          <div className="p-12 text-center text-gray-500">Loading orders...</div>
        ) : error ? (
          <div className="p-12 text-center text-neon-pink">Error: {error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-dark-bg border-b border-dark-border">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Order ID</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Customer</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Date</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Items</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Total</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-border">
                {filteredOrders.map((order) => {
                  const Icon = statusIcons[order.status];
                  return (
                    <tr key={order.orderId} className="hover:bg-white/5 transition-colors group">
                      <td className="p-6">
                        <span className="text-sm font-black text-neon-purple">{order.orderId}</span>
                      </td>
                      <td className="p-6">
                        <p className="text-sm font-bold">{order.customerName}</p>
                      </td>
                      <td className="p-6">
                        <p className="text-xs font-bold text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="p-6">
                        <p className="text-sm font-bold">{order.items?.length || 0} Items</p>
                      </td>
                      <td className="p-6">
                        <span className="text-sm font-black text-neon-green">${order.totalAmount?.toFixed(2)}</span>
                      </td>
                      <td className="p-6">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                          disabled={updatingId === order.orderId}
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${statusColors[order.status]} bg-transparent cursor-pointer`}
                        >
                          {Object.keys(statusColors).map(status => (
                            <option key={status} value={status} className="bg-dark-card text-white">{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-6 text-right">
                        <button className="p-2 rounded-lg hover:bg-neon-purple/10 hover:text-neon-purple transition-all">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="p-6 border-t border-dark-border flex items-center justify-between">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
            Showing {filteredOrders.length} of {pagination.totalElements} entries
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="p-2 rounded-lg border border-dark-border text-gray-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
            {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i)}
                className={`w-8 h-8 rounded-lg font-black text-xs ${pagination.page === i ? 'bg-neon-purple text-white' : 'hover:bg-white/5 text-gray-500'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page + 1 >= pagination.totalPages}
              className="p-2 rounded-lg border border-dark-border text-gray-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}