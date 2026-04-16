import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
  X,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  getAllProducts,
  deleteProduct,
  toggleNewArrival,
} from '../../api/products';
import jordanPlaceholder from '../../assets/images/download.webp';
import { getAllCategories } from '../../api/categories';
import ProductForm from './ProductForm';

// ============================================================================
// Toast Notification Component
// ============================================================================
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle size={18} />,
    error: <XCircle size={18} />,
    info: <AlertCircle size={18} />,
  };

  const colors = {
    success: 'bg-emerald-500 dark:bg-emerald-600',
    error: 'bg-red-500 dark:bg-red-600',
    info: 'bg-blue-500 dark:bg-blue-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`fixed top-20 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white ${colors[type]}`}
      role="alert"
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <X size={16} />
      </button>
    </motion.div>
  );
};

// ============================================================================
// Confirmation Modal Component
// ============================================================================
const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', variant = 'danger' }) => {
  if (!isOpen) return null;

  const variantClasses = {
    danger: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
    warning: 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-dark-card rounded-2xl shadow-xl max-w-md w-full border border-gray-200 dark:border-dark-border"
          >
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{message}</p>
              <div className="mt-6 flex gap-3 justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses[variant]}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// Loading Skeleton Component
// ============================================================================
const ProductRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="p-4 md:p-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-dark-border" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 dark:bg-dark-border rounded" />
          <div className="h-3 w-20 bg-gray-200 dark:bg-dark-border rounded" />
        </div>
      </div>
    </td>
    <td className="p-4 md:p-6"><div className="h-4 w-16 bg-gray-200 dark:bg-dark-border rounded" /></td>
    <td className="p-4 md:p-6"><div className="h-4 w-20 bg-gray-200 dark:bg-dark-border rounded" /></td>
    <td className="p-4 md:p-6"><div className="h-4 w-16 bg-gray-200 dark:bg-dark-border rounded" /></td>
    <td className="p-4 md:p-6"><div className="h-6 w-20 bg-gray-200 dark:bg-dark-border rounded-full" /></td>
    <td className="p-4 md:p-6"><div className="flex gap-2"><div className="h-8 w-8 bg-gray-200 dark:bg-dark-border rounded-lg" /></div></td>
  </tr>
);

// ============================================================================
// Memoized Product Row Component
// ============================================================================
const ProductRow = React.memo(({ product, onNewArrivalToggle, onEdit, onDelete, thumbnail }) => (
  <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
    <td className="p-4 md:p-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-dark-bg border border-gray-200 dark:border-dark-border flex-shrink-0">
          <img
            src={thumbnail}
            className="w-full h-full object-cover"
            alt={product.name}
            loading="lazy"
            onError={(e) => { e.target.src = jordanPlaceholder; }}
          />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
            {product.name}
          </p>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            {product.category?.name || 'Uncategorized'}
          </p>
        </div>
      </div>
    </td>
    <td className="p-4 md:p-6">
      <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest">
        {product.brand}
      </span>
    </td>
    <td className="p-4 md:p-6">
      <div className="flex flex-col">
        {product.originalPrice && product.originalPrice > product.price && (
          <span className="text-xs text-gray-400 line-through">
            ${product.originalPrice}
          </span>
        )}
        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
          ${product.price}
        </span>
      </div>
    </td>
    <td className="p-4 md:p-6">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {product.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) || 0} units
      </span>
    </td>
    <td className="p-4 md:p-6">
      <div className="flex gap-1 flex-wrap">
        {product.featured && (
          <span className="px-2 py-1 text-[10px] font-black bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 rounded-full">
            FEATURED
          </span>
        )}
        {product.newArrival && (
          <span className="px-2 py-1 text-[10px] font-black bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full">
            NEW
          </span>
        )}
      </div>
    </td>
    <td className="p-4 md:p-6">
      <div className="flex items-center gap-1">
        <button
          onClick={() => onNewArrivalToggle(product)}
          className={`p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
            product.newArrival
              ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'
              : 'hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400'
          }`}
          aria-label={product.newArrival ? 'Remove from new arrivals' : 'Mark as new arrival'}
        >
          <Sparkles size={16} />
        </button>
        <button
          onClick={() => onEdit(product)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Edit product"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(product)}
          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Delete product"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </td>
  </tr>
));

ProductRow.displayName = 'ProductRow';

// ============================================================================
// Main Products Component
// ============================================================================
const Products = () => {
  // Data state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
  });
  const [pageSize, setPageSize] = useState(10);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // UI state
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, product: null, action: null });

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPagination(prev => ({ ...prev, page: 0 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        page: pagination.page,
        size: pageSize,
        sort: 'createdAt,desc',
        search: debouncedSearch || undefined,
        categoryId: selectedCategoryId || undefined,
        brand: selectedBrand || undefined,
        gender: selectedGender || undefined,
      };
      const data = await getAllProducts(params);
      setProducts(data.content || []);
      setPagination({
        page: data.number,
        size: data.size,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
      });
    } catch (err) {
      setError(err.message || 'Failed to load products');
      showToast(err.message || 'Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pageSize, debouncedSearch, selectedCategoryId, selectedBrand, selectedGender]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Toast helper
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Action handlers
  const handleDelete = async (product) => {
    setConfirmDialog({
      isOpen: true,
      product,
      action: async () => {
        try {
          await deleteProduct(product.id);
          await fetchProducts();
          showToast(`"${product.name}" has been deleted successfully`, 'success');
        } catch (err) {
          showToast(err.message || 'Failed to delete product', 'error');
        }
      },
    });
  };

  const handleNewArrivalToggle = async (product) => {
    try {
      await toggleNewArrival(product.id, !product.newArrival);
      showToast(
        `"${product.name}" ${!product.newArrival ? 'marked as' : 'removed from'} new arrivals`,
        'success'
      );
      await fetchProducts();
    } catch (err) {
      showToast(err.message || 'Failed to update new arrival status', 'error');
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    fetchProducts();
    showToast(editingProduct ? 'Product updated successfully' : 'Product created successfully', 'success');
  };

  const handleFormError = (errorMsg) => {
    showToast(errorMsg, 'error');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedBrand('');
    setSelectedGender('');
    setSelectedCategoryId('');
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  // Pagination
  const goToPage = (newPage) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
    }
  };

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const getVisiblePages = () => {
    const total = pagination.totalPages;
    const current = pagination.page;
    const delta = 2;
    const range = [];
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
      range.push(i);
    }
    if (current - delta > 2) range.unshift('...');
    if (current + delta < total - 1) range.push('...');
    range.unshift(1);
    if (total > 1) range.push(total);
    return range;
  };

  // Memoized brand options
  const brandOptions = useMemo(() => {
    const brands = new Set(products.map(p => p.brand).filter(Boolean));
    return ['All Brands', ...Array.from(brands)];
  }, [products]);

  // Active filters count
  const activeFiltersCount = [selectedCategoryId, selectedBrand, selectedGender, searchQuery].filter(Boolean).length;

  // Loading skeletons
  const skeletons = useMemo(() => Array(pageSize).fill(null).map((_, i) => <ProductRowSkeleton key={`skeleton-${i}`} />), [pageSize]);

  return (
    <div className="space-y-6 md:space-y-8 p-4 md:p-6 max-w-[1600px] mx-auto">
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, product: null, action: null })}
        onConfirm={confirmDialog.action}
        title="Delete Product"
        message={`Are you sure you want to delete "${confirmDialog.product?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter italic uppercase bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Products
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
            Manage your inventory
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="btn-primary flex items-center justify-center gap-2 py-3 px-6 text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg"
        >
          <Plus size={18} /> Add New Product
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products by name, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            aria-label="Search products"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedCategoryId}
            onChange={(e) => {
              setSelectedCategoryId(e.target.value);
              setPagination(prev => ({ ...prev, page: 0 }));
            }}
            className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value === 'All Brands' ? '' : e.target.value);
              setPagination(prev => ({ ...prev, page: 0 }));
            }}
            className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
            aria-label="Filter by brand"
          >
            {brandOptions.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          <select
            value={selectedGender}
            onChange={(e) => {
              setSelectedGender(e.target.value);
              setPagination(prev => ({ ...prev, page: 0 }));
            }}
            className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
            aria-label="Filter by gender"
          >
            <option value="">All Genders</option>
            <option value="MEN">Men</option>
            <option value="WOMEN">Women</option>
            <option value="UNISEX">Unisex</option>
          </select>
          
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-sm font-medium"
              aria-label="Clear all filters"
            >
              <RotateCcw size={16} />
              Clear ({activeFiltersCount})
            </button>
          )}
          
          <button
            onClick={fetchProducts}
            className="p-3 rounded-xl bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border hover:border-purple-500 text-gray-500 hover:text-purple-600 dark:hover:text-purple-400 transition-all"
            aria-label="Refresh products"
            title="Refresh"
          >
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-700 dark:text-red-400 text-sm flex items-center gap-2"
          >
            <AlertCircle size={18} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Table */}
      <div className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border">
                <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Product</th>
                <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Brand</th>
                <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Price</th>
                <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Stock</th>
                <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
              {loading ? (
                skeletons
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-dark-border flex items-center justify-center">
                        <Search size={32} className="text-gray-400" />
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">No products found</p>
                      <p className="text-sm text-gray-400">Try adjusting your filters or add a new product</p>
                      <button
                        onClick={resetFilters}
                        className="mt-2 px-4 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors"
                      >
                        Clear all filters
                      </button>
                    </motion.div>
                  </td>
                </tr>
              ) : (
                products.map((product) => {
                  const thumbnail = product.resources?.find((r) => r.isPrimary)?.url ||
                    product.resources?.[0]?.url || jordanPlaceholder;
                  return (
                    <ProductRow
                      key={product.id}
                      product={product}
                      thumbnail={thumbnail}
                      onNewArrivalToggle={handleNewArrivalToggle}
                      onEdit={openEditModal}
                      onDelete={handleDelete}
                    />
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && products.length > 0 && (
          <div className="p-4 md:p-6 border-t border-gray-200 dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Showing {pagination.page * pageSize + 1}-
                {Math.min((pagination.page + 1) * pageSize, pagination.totalElements)} of {pagination.totalElements} entries
              </p>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Items per page"
              >
                {[10, 20, 50, 100].map(size => (
                  <option key={size} value={size}>{size} / page</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 0}
                className="p-2 rounded-lg border border-gray-200 dark:border-dark-border text-gray-500 hover:text-gray-700 dark:hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              {getVisiblePages().map((page, idx) =>
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-500">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => goToPage(page - 1)}
                    className={`w-8 h-8 rounded-lg font-black text-xs transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                      pagination.page === page - 1
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500'
                    }`}
                    aria-label={`Go to page ${page}`}
                    aria-current={pagination.page === page - 1 ? 'page' : undefined}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page + 1 >= pagination.totalPages}
                className="p-2 rounded-lg border border-gray-200 dark:border-dark-border text-gray-500 hover:text-gray-700 dark:hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-purple-500"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSuccess={handleFormSuccess}
        onError={handleFormError}
      />
    </div>
  );
};

export default Products;