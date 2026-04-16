import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import Overview from "./admin/Overview";
import Products from "./admin/Products";
import Orders from "./admin/Orders";
import WishlistAnalytics from "./admin/WishlistAnalytics";
import SalesAnalytics from "./admin/SalesAnalytics";
import UserStats from "./admin/UserStats";
import { useAuthStore } from "../store/authStore";
import Categories from "./admin/Category";
import FeatureProductForm from "./admin/FeatureProductPage";

export default function AdminDashboard() {
  const { user } = useAuthStore();

  // if (user?.role !== 'admin') {
  //   return <Navigate to="/profile" replace />;
  // }

  return (
    <div className="flex min-h-screen bg-yellow-500 text-app-text">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="categories" element={<Categories />} />
          <Route path="wishlist" element={<WishlistAnalytics />} />
          <Route path="sales" element={<SalesAnalytics />} />
          <Route path="users" element={<UserStats />} />
          <Route path="feature-product" element={<FeatureProductForm />} />
        </Routes>
      </main>
    </div>
  );
}
