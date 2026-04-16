import React, { useState, useEffect } from "react";
import {
  Star,
  Search,
  Filter,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Clock,
  Check,
  X,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
// import { Star } from 'react-icons/fa';
import FeatureProductForm from "./FeatureProductForm";
import {
  getAllProducts,
  unfeatureProduct,
  getProductCount,
  getFeaturedProducts,
} from "../../api/products";

const FeatureProductPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'featured', 'non-featured'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showFeatureForm, setShowFeatureForm] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    featuredProducts: 0,
    totalDiscountValue: 0,
    averageDiscount: 0,
  });
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    pageSize: 20,
  });
  const [searchMode, setSearchMode] = useState(false);

  useEffect(() => {
    loadProducts();
    loadStats();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, filter]);

  const loadProducts = async (page = 0, search = "") => {
    try {
      setLoading(true);
      const params = {
        page,
        size: pagination.pageSize,
        ...(search && { search }), // Add search param if provided
      };

      const response = await getAllProducts(params);

      // Your API returns { products: [], currentPage, totalItems, totalPages }
      setProducts(response.products || response.search || []);

      setPagination({
        currentPage: response.currentPage || 0,
        totalPages: response.totalPages || 1,
        totalItems: response.totalItems || response.products?.length || 0,
        pageSize: response.pageSize || pagination.pageSize,
      });

      updateStats(response.products || response.search || []);
      setSearchMode(!!search);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Load total count
      const countResponse = await getProductCount();
      if (countResponse && countResponse.count !== undefined) {
        setStats((prev) => ({ ...prev, totalProducts: countResponse.count }));
      }

      // Load featured products count
      const featuredResponse = await getFeaturedProducts(0, 1);
      if (featuredResponse && featuredResponse.totalItems !== undefined) {
        setStats((prev) => ({
          ...prev,
          featuredProducts: featuredResponse.totalItems,
        }));
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const updateStats = (productsList) => {
    const featured = productsList.filter((product) => product.featured);
    const totalDiscount = featured.reduce((sum, product) => {
      const originalPrice = product.originalPrice || product.price;
      const discountedPrice = product.discountedPrice || product.price;
      return sum + (originalPrice - discountedPrice);
    }, 0);

    const averageDiscount =
      featured.length > 0
        ? featured.reduce(
            (sum, product) => sum + (product.discountPercent || 0),
            0,
          ) / featured.length
        : 0;

    setStats((prev) => ({
      ...prev,
      totalDiscountValue: totalDiscount,
      averageDiscount: Math.round(averageDiscount * 10) / 10,
    }));
  };

  const filterProducts = () => {
    let filtered = [...products];

    // Apply status filter
    if (filter === "featured") {
      filtered = filtered.filter((product) => product.featured);
    } else if (filter === "non-featured") {
      filtered = filtered.filter((product) => !product.featured);
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setSearchMode(false);
      await loadProducts();
      return;
    }

    await loadProducts(0, searchInput);
  };

  const handleFeatureProduct = async (product) => {
    setSelectedProduct(product);
    setShowFeatureForm(true);
  };

  const handleUnfeatureProduct = async (productId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this product from featured items?",
      )
    ) {
      try {
        await unfeatureProduct(productId);
        await loadProducts(
          pagination.currentPage,
          searchMode ? searchInput : "",
        );
        await loadStats(); // Refresh stats
      } catch (error) {
        console.error("Error unfeaturing product:", error);
      }
    }
  };

  const handleFeatureSuccess = async () => {
    setShowFeatureForm(false);
    setSelectedProduct(null);
    await loadProducts(pagination.currentPage, searchMode ? searchInput : "");
    await loadStats(); // Refresh stats
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      loadProducts(newPage, searchMode ? searchInput : "");
    }
  };

  const formatTimeRemaining = (featuredUntil) => {
    if (!featuredUntil) return "";

    const now = new Date();
    const endDate = new Date(featuredUntil);
    const diffMs = endDate - now;

    if (diffMs <= 0) return "Expired";

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(
      (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    let result = "";
    if (diffDays > 0) result += `${diffDays}d `;
    if (diffHours > 0) result += `${diffHours}h `;
    if (diffMinutes > 0 || (diffDays === 0 && diffHours === 0))
      result += `${diffMinutes}m`;

    return result + " remaining";
  };

  const getOriginalPrice = (product) => {
    return product.originalPrice || product.price || 0;
  };

  const getDiscountedPrice = (product) => {
    return product.price || 0;
  };

  const getDiscountPercent = (product) => {
    if (product.discountPercent !== undefined) return product.discountPercent;

    const original = getOriginalPrice(product);
    const discounted = getDiscountedPrice(product);

    if (original > 0 && original > discounted) {
      return Math.round(((original - discounted) / original) * 100);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Feature Products Management
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Products
              </p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalProducts.toLocaleString()}
              </p>
            </div>
            <div className="p-2 md:p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
              <ShoppingBag className="text-blue-600 dark:text-blue-400 text-lg md:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Featured Products
              </p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {stats.featuredProducts.toLocaleString()}
              </p>
            </div>
            <div className="p-2 md:p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
              <Star className="text-yellow-600 dark:text-yellow-400 text-lg md:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total Discount Value
              </p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Ksh {stats.totalDiscountValue.toLocaleString()}
              </p>
            </div>
            <div className="p-2 md:p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <Star className="text-green-600 dark:text-green-400 text-lg md:text-xl" />
            </div>
          </div>
        </div>

        {/* <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Avg. Discount
              </p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                {stats.averageDiscount}%
              </p>
            </div>
            <div className="p-2 md:p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
              <FiTrendingUp className="text-purple-600 dark:text-purple-400 text-lg md:text-xl" />
            </div>
          </div>
        </div> */}
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 md:p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products by name or description..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchMode && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    setSearchMode(false);
                    loadProducts();
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X />
                </button>
              )}
            </div>
            {searchMode && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Showing search results for: "{searchInput}"
              </p>
            )}
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-2 md:px-4 md:py-3 rounded-lg font-medium flex items-center gap-2 ${
                filter === "all"
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <Filter className="text-sm" />
              <span className="hidden sm:inline">All Products</span>
              <span className="sm:hidden">All</span>
            </button>
            <button
              onClick={() => setFilter("featured")}
              className={`px-3 py-2 md:px-4 md:py-3 rounded-lg font-medium flex items-center gap-2 ${
                filter === "featured"
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <Star className="text-sm" />
              <span className="hidden sm:inline">Featured</span>
              <span className="sm:hidden">Featured</span>
            </button>
            <button
              onClick={() => setFilter("non-featured")}
              className={`px-3 py-2 md:px-4 md:py-3 rounded-lg font-medium flex items-center gap-2 ${
                filter === "non-featured"
                  ? "bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              <span className="hidden sm:inline">Non-Featured</span>
              <span className="sm:hidden">Regular</span>
            </button>
            <button
              onClick={() => {
                setSearchInput("");
                setSearchMode(false);
                loadProducts();
              }}
              disabled={loading}
              className="px-3 py-2 md:px-4 md:py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center p-8 md:p-12">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
              <AlertCircle className="text-xl md:text-2xl text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchMode
                ? "No matching products found"
                : "No products available"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchMode
                ? "Try a different search term"
                : "Add some products to get started"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Time Remaining
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  >
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
                          <img
                            className="h-8 w-8 md:h-10 md:w-10 rounded-lg object-cover"
                            src={product.image || ""}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-3 md:ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px] md:max-w-xs">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {product.category || "Uncategorized"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <div className="text-sm">
                        {product.isFeatured && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 line-through">
                            Ksh {getOriginalPrice(product).toLocaleString()}
                          </div>
                        )}
                        <div
                          className={`font-bold ${product.isFeatured ? "text-green-600 dark:text-green-400" : "text-gray-900 dark:text-white"}`}
                        >
                          Ksh {getDiscountedPrice(product).toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      {product.isFeatured ? (
                        <span className="inline-flex items-center px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300">
                          <Star className="mr-1" />
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                          Regular
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      {product.isFeatured ? (
                        <span className="text-sm md:text-lg font-bold text-red-600 dark:text-red-400">
                          -{getDiscountPercent(product)}%
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      {product.isFeatured ? (
                        <div className="flex items-center">
                          <Clock className="mr-1 md:mr-2 text-gray-400 text-sm" />
                          <span className="text-xs md:text-sm">
                            {formatTimeRemaining(product.featuredUntil)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      {product.isFeatured ? (
                        <button
                          onClick={() => handleUnfeatureProduct(product.id)}
                          className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg font-medium text-xs md:text-sm transition-colors"
                        >
                          <X className="mr-1 md:mr-2" />
                          <span className="hidden sm:inline">
                            Remove Feature
                          </span>
                          <span className="sm:hidden">Remove</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFeatureProduct(product)}
                          className="inline-flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg font-medium text-xs md:text-sm shadow-sm hover:shadow transition-all"
                        >
                          <Star className="mr-1 md:mr-2" />
                          <span className="hidden sm:inline">
                            Feature Product
                          </span>
                          <span className="sm:hidden">Feature</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && pagination.totalPages > 1 && (
          <div className="px-4 md:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700 dark:text-gray-400">
                Showing{" "}
                <span className="font-medium">
                  {pagination.currentPage * pagination.pageSize + 1}-
                  {Math.min(
                    (pagination.currentPage + 1) * pagination.pageSize,
                    pagination.totalItems,
                  )}
                </span>{" "}
                of <span className="font-medium">{pagination.totalItems}</span>{" "}
                products
                {searchMode && searchInput && (
                  <span className="ml-2 text-blue-600 dark:text-blue-400">
                    (search results)
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 0}
                  className="px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300 px-2">
                    Page {pagination.currentPage + 1} of {pagination.totalPages}
                  </span>
                </div>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage >= pagination.totalPages - 1}
                  className="px-3 md:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feature Product Modal */}
      {showFeatureForm && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="relative max-w-md w-full max-h-[90vh] overflow-y-auto">
            <FeatureProductForm
              productId={selectedProduct.id}
              productName={selectedProduct.name}
              currentPrice={getOriginalPrice(selectedProduct)}
              isCurrentlyFeatured={selectedProduct.isFeatured}
              currentFeaturedUntil={selectedProduct.featuredUntil}
              onSuccess={handleFeatureSuccess}
              onCancel={() => {
                setShowFeatureForm(false);
                setSelectedProduct(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureProductPage;