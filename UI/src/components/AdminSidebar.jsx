import React, { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Heart,
  BarChart3,
  Users,
  Settings,
  ArrowLeft,
  XIcon,
  User,
  UserSearch,
} from "lucide-react";

export default function AdminSidebar({ isSidebarOpen, setSidebarOpen }) {
  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/admin" },
    { icon: Package, label: "Products", path: "/admin/products" },
    { icon: ShoppingBag, label: "Orders", path: "/admin/orders" },
    { icon: Settings, label: "Categories", path: "/admin/categories" },
    { icon: Heart, label: "Wishlist Analytics", path: "/admin/wishlist" },
    { icon: BarChart3, label: "Sales Analytics", path: "/admin/sales" },
    { icon: Users, label: "Featured", path: "/admin/feature-product" },
    { icon: Users, label: "User Stats", path: "/admin/users" },
  ];

  // Shared navigation links component
  const SidebarNav = ({ onLinkClick }) => (
    <ul className="space-y-2">
      {navItems.map(({ icon: Icon, label, path }) => (
        <li key={path}>
          <NavLink
            to={path}
            onClick={onLinkClick}
            end={path === "/admin"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300
              ${
                isActive
                  ? "bg-primary-accent/10 text-primary-accent border border-primary-accent/20 neon-glow"
                  : "text-app-text-muted hover:bg-app-bg hover:text-app-text"
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );

  // Shared sidebar content (used for both desktop and mobile)
  const SidebarContent = ({ onLinkClick, showCloseButton = false, onClose }) => (
    <div className="flex flex-col h-full">
      {/* Header with store back link and optional close button */}
      <div className="p-6 border-b border-app-border flex items-center justify-between">
        <NavLink to="/" onClick={onLinkClick} className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-tertiary-accent rounded flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform duration-300">
            <ArrowLeft size={16} className="text-black" />
          </div>
          <span className="text-lg font-black tracking-tighter italic">
            BACK TO STORE
          </span>
        </NavLink>
        {showCloseButton && (
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors md:hidden"
            aria-label="Close sidebar"
          >
            <XIcon size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <SidebarNav onLinkClick={onLinkClick} />
      </nav>

      {/* Footer actions */}
      <div className="p-4 mt-auto border-t border-app-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-app-text-muted hover:bg-app-bg hover:text-app-text transition-all">
          <Settings size={20} />
          Settings
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-app-text-muted hover:bg-app-bg hover:text-app-text transition-all mt-2">
          <User size={20} />
          Profile
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Desktop Sidebar - always visible on medium screens and above */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-app-card border-r border-app-border h-screen sticky top-0 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar - slide-in drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-green-800 border-r border-app-border z-50 flex flex-col transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button>
        <SidebarContent
          showCloseButton={true}
          onClose={() => setSidebarOpen(false)}
          onLinkClick={() => setSidebarOpen(false)}
        /> 
        <UserSearch>
          </UserSearch></button>
      </aside>
    </>
  );
}