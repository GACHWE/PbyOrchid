// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import {
//   ShoppingCart,
//   Heart,
//   User,
//   Search,
//   Menu,
//   X,
//   LogOut,
//   LayoutDashboard,
//   Sun,
//   Moon,
// } from "lucide-react";
// import { useAuthStore } from "../store/authStore";
// import { useCartStore } from "../store/cartStore";
// import { useWishlistStore } from "../store/wishlistStore";
// import { useThemeStore } from "../store/themeStore";
// import { motion, AnimatePresence } from "motion/react";

// export default function Navbar() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const { user, logout, isAuthenticated } = useAuthStore();
//   const { items: cartItems } = useCartStore();
//   const { items: wishlistItems } = useWishlistStore();
//   const { theme, toggleTheme } = useThemeStore();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

//   return (
//     <nav
//       className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-app-bg/80 backdrop-blur-lg border-b border-app-border py-3" : "bg-transparent py-5"}`}
//     >
//       <div className="container mx-auto px-4 flex items-center justify-between">
//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-2 group">
//           {/* <div className="w-10 h-10 bg-primary-accent rounded-lg flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-300 neon-glow">
//             <span className="font-black text-xl text-white italic">P</span>
//           </div> */}
//           <span className="text-xl font-black tracking-tighter italic">
//             PLUGGED
//           </span>
//         </Link>

//         {/* Desktop Nav */}
//         <div className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-widest">
//           <Link
//             to="/shop"
//             className="hover:text-primary-accent transition-colors"
//           >
//             Shop
//           </Link>
//           <Link
//             to="/shop?gender=Men"
//             className="hover:text-primary-accent transition-colors"
//           >
//             Men
//           </Link>
//           <Link
//             to="/shop?gender=Women"
//             className="hover:text-primary-accent transition-colors"
//           >
//             Women
//           </Link>

//           <Link
//             to="/admin"
//             className="text-tertiary-accent flex items-center gap-1 hover:brightness-110 transition-all"
//           >
//             <LayoutDashboard size={16} /> Admin
//           </Link>
//         </div>

//         {/* Actions */}
//         <div className="flex items-center gap-4 md:gap-6">
//           {/* Theme Toggle */}
//           <button
//             onClick={toggleTheme}
//             className="w-10 h-10 rounded-full bg-app-card border border-app-border flex items-center justify-center hover:text-primary-accent transition-all duration-300"
//           >
//             {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
//           </button>

//           <button className="hover:text-primary-accent transition-colors hidden sm:block">
//             <Search size={22} />
//           </button>

//           <Link
//             to="/wishlist"
//             className="relative hover:text-primary-accent transition-colors"
//           >
//             <Heart size={22} />
//             {wishlistItems.length > 0 && (
//               <span className="absolute -top-2 -right-2 bg-secondary-accent text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold text-white">
//                 {wishlistItems.length}
//               </span>
//             )}
//           </Link>

//           <Link
//             to="/cart"
//             className="relative hover:text-primary-accent transition-colors"
//           >
//             <ShoppingCart size={22} />
//             {cartCount > 0 && (
//               <span className="absolute -top-2 -right-2 bg-primary-accent text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold text-white neon-glow">
//                 {cartCount}
//               </span>
//             )}
//           </Link>

//           {isAuthenticated ? (
//             <div className="flex items-center gap-4">
//               <Link
//                 to="/profile"
//                 className="hidden sm:flex items-center gap-2 hover:text-primary-accent transition-colors"
//               >
//                 <div className="w-8 h-8 rounded-full bg-app-card border border-app-border flex items-center justify-center">
//                   <User size={16} />
//                 </div>
//                 <span className="text-xs font-bold">{user.name}</span>
//               </Link>
//               <button
//                 onClick={logout}
//                 className="hover:text-secondary-accent transition-colors"
//               >
//                 <LogOut size={22} />
//               </button>
//             </div>
//           ) : (
//             <Link to="/profile" className="btn-primary py-2 px-4 text-xs">
//               Login
//             </Link>
//           )}

//           {/* Mobile Menu Toggle */}
//           <button
//             className="md:hidden hover:text-primary-accent transition-colors"
//             onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//           >
//             {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       <AnimatePresence>
//         {isMobileMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             className="absolute top-full left-0 w-full bg-app-bg border-b border-app-border py-8 px-4 md:hidden flex flex-col gap-6 text-center font-black text-2xl"
//           >
//             <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>
//               SHOP
//             </Link>
//             <Link
//               to="/shop?gender=Men"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               MEN
//             </Link>
//             <Link
//               to="/shop?gender=Women"
//               onClick={() => setIsMobileMenuOpen(false)}
//             >
//               WOMEN
//             </Link>
//             {user?.role === "admin" && (
//               <Link
//                 to="/admin"
//                 className="text-tertiary-accent"
//                 onClick={() => setIsMobileMenuOpen(false)}
//               >
//                 ADMIN PANEL
//               </Link>
//             )}
//             <div className="h-px bg-app-border w-full my-2" />
//             <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
//               PROFILE
//             </Link>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </nav>
//   );
// }

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Sun,
  Moon,
  UserCircle,
  Settings,
  Package,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useThemeStore } from "../store/themeStore";
import { motion, AnimatePresence } from "motion/react";
import SearchComponent from "./SearchComponent";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const { user, logout, isAuthenticated } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { totalItems: wishlistCount, fetchWishlistCount } = useWishlistStore();
  const { theme, toggleTheme } = useThemeStore();

  const navigate = useNavigate();
  const location = useLocation();

  // Scroll effect with smoother transition
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch wishlist count
  useEffect(() => {
    if (isAuthenticated) fetchWishlistCount();
  }, [isAuthenticated, fetchWishlistCount]);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsUserDropdownOpen(false);
  }, [location.pathname]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Smart active nav logic
  const params = new URLSearchParams(location.search);
  const currentGender = params.get("gender");

  const navItems = [
    { path: "/", label: "Home", gender: null },
    { path: "/shop", label: "Shop", gender: null },
    { path: "/shop?gender=Men", label: "Men", gender: "Men" },
    { path: "/shop?gender=Women", label: "Women", gender: "Women" },
  ];

  const isNavActive = (item) => {
    if (location.pathname !== "/") return false;
    if (item.gender === null) return !currentGender;
    return currentGender === item.gender;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserDropdownOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-app-bg/90 backdrop-blur-2xl border-b border-app-border/50 shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo with enhanced animation */}
        <Link
          to="/"
          className="flex items-center gap-2 group relative z-10"
          aria-label="Home"
        >
          <motion.span
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="text-2xl md:text-3xl font-black tracking-tighter italic bg-gradient-to-r from-primary-accent via-secondary-accent to-tertiary-accent bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient"
          >
            PLUGGED
          </motion.span>
        </Link>

        {/* Desktop Navigation Links - refined with spring animations */}
        <div className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-widest">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`relative transition-colors duration-300 hover:text-primary-accent ${
                isNavActive(item) ? "text-primary-accent" : "text-app-text-muted"
              }`}
            >
              {item.label}
              {isNavActive(item) && (
                <motion.span
                  layoutId="activeNav"
                  className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-primary-accent to-secondary-accent rounded-full"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          ))}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`flex items-center gap-1 transition-colors duration-300 ${
                location.pathname === "/admin"
                  ? "text-tertiary-accent"
                  : "text-app-text-muted hover:text-tertiary-accent"
              }`}
            >
              <LayoutDashboard size={16} /> Admin
            </Link>
          )}
        </div>

        {/* Desktop Search Component */}
        <SearchComponent
          placeholder="Search premium tech gear..."
          className="hidden md:flex flex-1 max-w-md mx-6"
        />

        {/* Action Icons with micro-interactions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Theme Toggle with rotation animation */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-app-card/80 backdrop-blur-sm border border-app-border flex items-center justify-center hover:text-primary-accent transition-colors duration-300"
            aria-label="Toggle theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          {/* Wishlist with bounce animation on count change (optional) */}
          <Link
            to="/wishlist"
            className="relative group"
            aria-label="Wishlist"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-primary-accent/10 transition-colors duration-300"
            >
              <Heart size={22} className="group-hover:text-primary-accent transition-colors" />
            </motion.div>
            {wishlistCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-secondary-accent text-[10px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center font-bold text-white shadow-lg"
              >
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </motion.span>
            )}
          </Link>

          {/* Cart with similar enhancements */}
          <Link
            to="/cart"
            className="relative group"
            aria-label="Cart"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full hover:bg-primary-accent/10 transition-colors duration-300"
            >
              <ShoppingCart size={22} className="group-hover:text-primary-accent transition-colors" />
            </motion.div>
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-primary-accent text-[10px] min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center font-bold text-white shadow-lg neon-glow"
              >
                {cartCount > 9 ? "9+" : cartCount}
              </motion.span>
            )}
          </Link>

          {/* User Area */}
          {isAuthenticated ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 group"
                aria-label="User menu"
                aria-expanded={isUserDropdownOpen}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-accent to-secondary-accent flex items-center justify-center shadow-md ring-2 ring-transparent group-hover:ring-primary-accent/50 transition-all duration-300">
                  <User size={18} className="text-white" />
                </div>
                <span className="hidden lg:inline text-sm font-bold max-w-[100px] truncate group-hover:text-primary-accent transition-colors">
                  {user?.name || user?.email?.split("@")[0]}
                </span>
              </motion.button>

              <AnimatePresence>
                {isUserDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="absolute right-0 mt-3 w-56 rounded-2xl bg-app-card/95 backdrop-blur-xl border border-app-border shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-app-border bg-gradient-to-r from-primary-accent/5 to-secondary-accent/5">
                      <p className="font-bold text-sm">{user?.name}</p>
                      <p className="text-xs text-app-text-muted truncate">
                        {user?.email}
                      </p>
                    </div>
                    <div className="py-2">
                      <DropdownLink to="/profile" icon={<UserCircle size={18} />} onClick={() => setIsUserDropdownOpen(false)}>
                        Profile
                      </DropdownLink>
                      <DropdownLink to="/profile/orders" icon={<Package size={18} />} onClick={() => setIsUserDropdownOpen(false)}>
                        Orders
                      </DropdownLink>
                      <DropdownLink to="/profile/settings" icon={<Settings size={18} />} onClick={() => setIsUserDropdownOpen(false)}>
                        Settings
                      </DropdownLink>
                      <hr className="my-1 border-app-border" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm w-full text-left hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300"
                      >
                        <LogOut size={18} /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/login"
                className="btn-primary py-2 px-5 text-sm font-bold tracking-wider rounded-full shadow-lg hover:shadow-primary-accent/25 transition-shadow"
              >
                Login
              </Link>
            </motion.div>
          )}

          {/* Mobile Menu Toggle with hamburger animation */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 rounded-full hover:bg-app-card/50 transition-colors duration-300 relative z-20"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isMobileMenuOpen ? "close" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu with enhanced animation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full bg-app-bg/95 backdrop-blur-2xl border-b border-app-border md:hidden overflow-hidden z-10"
          >
            <div className="flex flex-col py-6 px-4 gap-5 text-center">
              {/* Mobile Search */}
              <SearchComponent placeholder="Search products..." className="w-full" />

              {/* Mobile Nav Links with staggered animation */}
              <div className="flex flex-col gap-5 font-bold text-lg uppercase tracking-wider">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block py-2 hover:text-primary-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                {user?.role === "admin" && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.05 }}
                  >
                    <Link
                      to="/admin"
                      className="block py-2 text-tertiary-accent hover:brightness-110 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  </motion.div>
                )}
              </div>

              <div className="h-px bg-app-border w-full my-2" />

              {/* User section in mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-4"
              >
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-accent to-secondary-accent flex items-center justify-center shadow-lg">
                        <User size={24} className="text-white" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold">{user?.name}</p>
                        <p className="text-xs text-app-text-muted">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    className="btn-primary py-3 px-6 text-sm font-bold tracking-wider inline-block text-center rounded-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login / Register
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// Helper component for dropdown links with hover effect
const DropdownLink = ({ to, icon, children, onClick }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary-accent/10 transition-colors duration-200 group"
    onClick={onClick}
  >
    <span className="text-app-text-muted group-hover:text-primary-accent transition-colors">
      {icon}
    </span>
    <span className="group-hover:translate-x-1 transition-transform duration-200">
      {children}
    </span>
  </Link>
);