import React, { useState, useEffect } from 'react';
import { Users, UserPlus, UserCheck, UserX, Search, Filter } from 'lucide-react';
import AnalyticsCard from '../../components/AnalyticsCard';
import { getAllUsers, getUserStats } from '../../api/users';

export default function UserStats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Fetch data when filters or page changes
  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, roleFilter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch stats and user list in parallel
      const [statsData, usersData] = await Promise.all([
        getUserStats(),
        getAllUsers(currentPage, pageSize, searchTerm, roleFilter),
      ]);
      setStats(statsData);
      setUsers(usersData.content);
      setTotalPages(usersData.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search input to avoid too many requests
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0); // reset to first page on new search
  };

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(0);
  };

  if (loading) return <div className="p-12 text-center">Loading user data...</div>;
  if (error) return <div className="p-12 text-center text-neon-pink">Error: {error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between" data-aos="fade-down">
        <div>
          <h1 className="text-4xl font-black tracking-tighter italic uppercase">User Statistics</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Manage your community</p>
        </div>
        <button className="btn-primary py-2 px-6 text-xs">ADD NEW USER</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard 
          title="Total Users" 
          value={stats.totalUsers.toLocaleString()} 
          icon={Users} 
          trend="+120" 
          color="purple" 
        />
        <AnalyticsCard 
          title="New This Month" 
          value={stats.newThisMonth.toLocaleString()} 
          icon={UserPlus} 
          trend="+15%" 
          color="green" 
        />
        <AnalyticsCard 
          title="Active Users (30d)" 
          value={stats.activeUsers.toLocaleString()} 
          icon={UserCheck} 
          trend="+8%" 
          color="pink" 
        />
        <AnalyticsCard 
          title="Churn Rate" 
          value={`${stats.churnRate}%`} 
          icon={UserX} 
          trend="-0.5%" 
          color="orange" 
        />
      </div>

      {/* User Table */}
      <div className="bg-dark-card border border-dark-border rounded-3xl overflow-hidden" data-aos="fade-up">
        <div className="p-6 border-b border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full bg-dark-bg border border-dark-border rounded-full py-2 pl-12 pr-6 text-xs focus:outline-none focus:border-neon-purple transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-dark-bg border border-dark-border hover:border-neon-purple transition-all">
              <Filter size={16} />
            </button>
            <select 
              className="bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-[10px] font-black uppercase tracking-widest"
              value={roleFilter}
              onChange={handleRoleChange}
            >
              <option value="">All Roles</option>
              <option value="BUYER">Buyer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-bg border-b border-dark-border">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">User</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Role</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Joined</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Orders</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Total Spent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-neon-purple/10 flex items-center justify-center text-neon-purple font-black">
                        {user.firstName?.charAt(0) || user.email.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{user.firstName} {user.lastName}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      user.role === 'ADMIN' 
                        ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' 
                        : 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6">
                    <p className="text-xs font-bold text-gray-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-bold">{user.orderCount || 0}</p>
                  </td>
                  <td className="p-6 text-right">
                    <p className="text-sm font-black text-neon-green">
                      Ksh {(user.totalSpent || 0).toLocaleString()}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-dark-border flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`w-8 h-8 rounded-lg text-xs font-black transition-all ${
                  currentPage === i 
                    ? 'bg-neon-purple text-white' 
                    : 'bg-dark-bg border border-dark-border hover:border-neon-purple'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}