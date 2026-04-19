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
import { Link, useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useCartStore } from "../store/cartStore";
import { useWishlistStore } from "../store/wishlistStore";
import { useThemeStore } from "../store/themeStore";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { totalItems: wishlistCount, fetchWishlistCount } = useWishlistStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch wishlist count when user is authenticated (on mount and when auth changes)
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlistCount();
    }
  }, [isAuthenticated, fetchWishlistCount]);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-app-bg/80 backdrop-blur-lg border-b border-app-border py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-xl font-black tracking-tighter italic">
            PLUGGED
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8 font-bold text-sm uppercase tracking-widest">
          <Link
            to="/shop"
            className="hover:text-primary-accent transition-colors"
          >
            Shop
          </Link>
          <Link
            to="/shop?gender=Men"
            className="hover:text-primary-accent transition-colors"
          >
            Men
          </Link>
          <Link
            to="/shop?gender=Women"
            className="hover:text-primary-accent transition-colors"
          >
            Women
          </Link>
          <Link
            to="/admin"
            className="text-tertiary-accent flex items-center gap-1 hover:brightness-110 transition-all"
          >
            <LayoutDashboard size={16} /> Admin
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-app-card border border-app-border flex items-center justify-center hover:text-primary-accent transition-all duration-300"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button className="hover:text-primary-accent transition-colors hidden sm:block">
            <Search size={22} />
          </button>

          <Link
            to="/wishlist"
            className="relative hover:text-primary-accent transition-colors"
          >
            <Heart size={22} />
            {wishlistCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary-accent text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link
            to="/cart"
            className="relative hover:text-primary-accent transition-colors"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary-accent text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold text-white neon-glow">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 hover:text-primary-accent transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-app-card border border-app-border flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="text-xs font-bold">{user?.name}</span>
              </Link>
              <button
                onClick={logout}
                className="hover:text-secondary-accent transition-colors"
              >
                <LogOut size={22} />
              </button>
            </div>
          ) : (
            <Link to="/profile" className="btn-primary py-2 px-4 text-xs">
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden hover:text-primary-accent transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-app-bg border-b border-app-border py-8 px-4 md:hidden flex flex-col gap-6 text-center font-black text-2xl"
          >
            <Link to="/shop" onClick={() => setIsMobileMenuOpen(false)}>
              SHOP
            </Link>
            <Link
              to="/shop?gender=Men"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              MEN
            </Link>
            <Link
              to="/shop?gender=Women"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              WOMEN
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-tertiary-accent"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ADMIN PANEL
              </Link>
            )}
            <div className="h-px bg-app-border w-full my-2" />
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
              PROFILE
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}