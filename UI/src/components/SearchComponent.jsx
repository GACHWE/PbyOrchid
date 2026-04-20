// components/Search/SearchComponent.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, Loader2 } from "lucide-react";
import { getAllProducts } from "../api/products";
const SearchComponent = ({
  placeholder = "Search premium tech gear...",
  className = "",
  onProductSelect, // optional callback if you want custom behavior
  dropdownClassName = "",
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Actual search call
  const performSearch = useCallback(async (searchTerm) => {
    if (!searchTerm?.trim() || searchTerm.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getAllProducts({
        search: searchTerm,
        page: 0,
        size: 8, // perfect for dropdown
        sort: "createdAt,desc",
      });

      // Handle both Page<T> and legacy response formats
      const products = data?.content || data?.products || data?.search || [];
      setResults(Array.isArray(products) ? products : []);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timeout = setTimeout(() => {
      performSearch(query);
      if (query.length >= 2) setIsDropdownOpen(true);
    }, 250);

    return () => clearTimeout(timeout);
  }, [query, performSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setQuery("");
      setIsDropdownOpen(false);
      setResults([]);
    }
  };

  const handleResultClick = (product) => {
    if (onProductSelect) {
      onProductSelect(product);
    } else if (product.slug) {
      navigate(`/product/${product.slug}`);
    } else if (product.id) {
      navigate(`/product/${product.id}`);
    }

    // Reset
    setQuery("");
    setIsDropdownOpen(false);
    setResults([]);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsDropdownOpen(false);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsDropdownOpen(true)}
          placeholder={placeholder}
          className="w-full px-5 py-3 rounded-3xl bg-app-card border border-app-border 
                     focus:border-primary-accent focus:ring-1 focus:ring-primary-accent 
                     text-sm placeholder:text-gray-400 transition-all duration-300"
        />

        {/* Clear button */}
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}

        {/* Search icon */}
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-accent transition-colors"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
      </form>

      {/* Search Dropdown */}
      {isDropdownOpen && (
        <div
          className={`absolute left-0 right-0 md:right-auto mt-2 w-full md:w-96 
                      bg-app-card border border-app-border rounded-3xl shadow-2xl 
                      z-50 max-h-[420px] overflow-hidden ${dropdownClassName}`}
        >
          <div className="max-h-96 overflow-y-auto py-2">
            {isLoading ? (
              <div className="px-6 py-10 flex items-center justify-center gap-3 text-gray-400">
                <Loader2 className="animate-spin" size={20} />
                <span className="text-sm">Searching...</span>
              </div>
            ) : results.length > 0 ? (
              results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleResultClick(product)}
                  className="mx-2 px-4 py-3 flex gap-4 rounded-2xl hover:bg-app-bg cursor-pointer transition-colors group"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    {product.thumbnail ? (
                      <img
                        src={product.thumbnail}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate text-foreground">
                      {product.name}
                    </p>
                    <p className="text-primary-accent font-medium">
                      Ksh {product.price?.toLocaleString() || "0"}
                    </p>
                    <div className="flex gap-2 text-xs text-gray-400 mt-1">
                      {product.brand && <span>{product.brand}</span>}
                      {product.categoryName && (
                        <span>• {product.categoryName}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-12 text-center">
                <Search size={32} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-400">No products found</p>
                <p className="text-xs text-gray-500 mt-1">
                  Try different keywords
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;