import React from 'react';
import { Users, UserPlus, UserCheck, UserX, Search, Filter } from 'lucide-react';
import AnalyticsCard from '../../components/AnalyticsCard';

export default function UserStats() {
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Buyer', joined: '2026-03-20', orders: 5, spent: 1240.00 },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Buyer', joined: '2026-03-18', orders: 2, spent: 450.00 },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Admin', joined: '2026-01-10', orders: 0, spent: 0.00 },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Buyer', joined: '2026-03-15', orders: 12, spent: 3450.00 },
    { id: 5, name: 'Chris Brown', email: 'chris@example.com', role: 'Buyer', joined: '2026-03-12', orders: 1, spent: 110.00 },
  ];

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
        <AnalyticsCard title="Total Users" value="15,420" icon={Users} trend="+120" color="purple" />
        <AnalyticsCard title="New This Month" value="1,240" icon={UserPlus} trend="+15%" color="green" />
        <AnalyticsCard title="Active Users" value="8,500" icon={UserCheck} trend="+8%" color="pink" />
        <AnalyticsCard title="Churn Rate" value="2.4%" icon={UserX} trend="-0.5%" color="orange" />
      </div>

      {/* User Table */}
      <div className="bg-dark-card border border-dark-border rounded-3xl overflow-hidden" data-aos="fade-up">
        <div className="p-6 border-b border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search users..." 
              className="w-full bg-dark-bg border border-dark-border rounded-full py-2 pl-12 pr-6 text-xs focus:outline-none focus:border-neon-purple transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-dark-bg border border-dark-border hover:border-neon-purple transition-all"><Filter size={16} /></button>
            <select className="bg-dark-bg border border-dark-border rounded-lg py-2 px-4 text-[10px] font-black uppercase tracking-widest">
              <option>All Roles</option>
              <option>Buyer</option>
              <option>Admin</option>
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
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{user.name}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'Admin' ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' : 'bg-neon-purple/10 text-neon-purple border border-neon-purple/20'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-6">
                    <p className="text-xs font-bold text-gray-500">{user.joined}</p>
                  </td>
                  <td className="p-6">
                    <p className="text-sm font-bold">{user.orders}</p>
                  </td>
                  <td className="p-6 text-right">
                    <p className="text-sm font-black text-neon-green">${user.spent.toLocaleString()}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
