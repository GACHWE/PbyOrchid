// import React, { useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Layout from './components/Layout';
// import Home from './pages/Home';
// import Shop from './pages/Shop';
// import Product from './pages/ProductDetails';
// import Wishlist from './pages/Wishlist';
// import Cart from './pages/Cart';
// import Checkout from './pages/Checkout';
// import Profile from './pages/Profile';
// import AdminDashboard from './pages/AdminLayout';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import NotFound from './pages/NotFound';
// import { useAuthStore } from './store/authStore';
// import { Toaster } from 'react-hot-toast';

// export default function App() {
//   const { checkAuth } = useAuthStore();

//   useEffect(() => {
//     checkAuth(); // Restore session on app load
//   }, [checkAuth]);

//   return (
//     <>
//     <Toaster />
//     <Router>
//       <Routes>
//         {/* Public auth pages (no layout) */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Main app with layout */}
//         <Route path="/" element={<Layout />}>
//           <Route index element={<Home />} />
//           <Route path="shop" element={<Shop />} />
//           <Route path="product/:id" element={<Product />} />
//           <Route path="wishlist" element={<Wishlist />} />
//           <Route path="cart" element={<Cart />} />
//           <Route path="checkout" element={<Checkout />} />
//           <Route path="profile" element={<Profile />} />
//           <Route path="admin/*" element={<AdminDashboard />} />
//           <Route path="*" element={<NotFound />} />
//         </Route>
//       </Routes>
//     </Router>
//     </>
//   );
// }

import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts & Guards
import Layout from './components/layouts/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import AdminLayout from './components/layouts/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/ProductDetails';   // Updated to use slug
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

// Protected User Pages
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';

// Admin Pages
import Overview from './pages/admin/Overview';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Categories from './pages/admin/Category';
import WishlistAnalytics from './pages/admin/WishlistAnalytics';
import SalesAnalytics from './pages/admin/SalesAnalytics';
import UserStats from './pages/admin/UserStats';
import FeatureProductForm from './pages/admin/FeatureProductPage';

// Auth Store
import { useAuthStore } from './store/authStore';

export default function App() {
  const { checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []); // run once

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Router>
        <Routes>
          {/* Public auth routes – no layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main app with shared layout */}
          <Route path="/" element={<Layout />}>
            {/* Public routes */}
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            {/* ✅ Product route now uses :slug instead of :id */}
            <Route path="product/:slug" element={<Product />} />

            {/* Protected user routes */}
            <Route
              path="wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Admin area – uses AdminLayout */}
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<Overview />} />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="categories" element={<Categories />} />
              <Route path="wishlist" element={<WishlistAnalytics />} />
              <Route path="sales" element={<SalesAnalytics />} />
              <Route path="users" element={<UserStats />} />
              <Route path="feature-product" element={<FeatureProductForm />} />
            </Route>

            {/* 404 – must be last */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}