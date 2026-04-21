// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import AdminSidebar from "../components/AdminSidebar";
// import Overview from "./admin/Overview";
// import Products from "./admin/Products";
// import Orders from "./admin/Orders";
// import WishlistAnalytics from "./admin/WishlistAnalytics";
// import SalesAnalytics from "./admin/SalesAnalytics";
// import UserStats from "./admin/UserStats";
// import { useAuthStore } from "../store/authStore";
// import Categories from "./admin/Category";
// import FeatureProductForm from "./admin/FeatureProductPage";

// export default function AdminDashboard() {
//   const { user } = useAuthStore();

  

//   return (
//     <div className="flex min-h-screen bg-yellow-500 text-app-text">
//       <AdminSidebar />
//       <main className="flex-1 p-8 overflow-y-auto">
//         <Routes>
//           <Route index element={<Overview />} />
//           <Route path="products" element={<Products />} />
//           <Route path="orders" element={<Orders />} />
//           <Route path="categories" element={<Categories />} />
//           <Route path="wishlist" element={<WishlistAnalytics />} />
//           <Route path="sales" element={<SalesAnalytics />} />
//           <Route path="users" element={<UserStats />} />
//           <Route path="feature-product" element={<FeatureProductForm />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }
// AdminLayout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import AdminSidebar from '../AdminSidebar';

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen text-app-text">
      <AdminSidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      <main className="flex-1 overflow-y-auto">
        {/* Mobile header with hamburger button */}
        <div className="sticky top-0 z-30 flex items-center p-4 bg-app-card border-b border-app-border md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-app-bg transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
          <h1 className="ml-4 text-xl font-bold">Admin</h1>
        </div>

        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}