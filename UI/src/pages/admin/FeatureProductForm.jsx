import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, X, Info, 
  AlertCircle, Calendar,
  Check, Trash2
} from 'lucide-react';
// import { ShoppingCart } from 'react-icons/fa';
import { featureProduct, unfeatureProduct } from '../../api/products';

const FeatureProductForm = ({
  productId,
  productName,
  currentPrice,
  isCurrentlyFeatured,
  currentFeaturedUntil,
  onSuccess,
  onCancel
}) => {
  // State for feature mode
  const [discountShoppingCart, setDiscountShoppingCart] = useState('10');
  const [duration, setDuration] = useState({
    months: 0,
    days: 7,
    hours: 0,
    minutes: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState([]);
  const [mode, setMode] = useState(isCurrentlyFeatured ? 'unfeature' : 'feature');

  // Update mode when isCurrentlyFeatured changes
  useEffect(() => {
    setMode(isCurrentlyFeatured ? 'unfeature' : 'feature');
  }, [isCurrentlyFeatured]);

  // Calculate derived values with useMemo
  const calculatedValues = useMemo(() => {
    if (mode === 'unfeature') {
      return {
        discount: 0,
        discountAmount: 0,
        newPrice: currentPrice,
        formattedDiscountAmount: '0',
        formattedNewPrice: currentPrice.toLocaleString()
      };
    }
    
    const discount = parseFloat(discountShoppingCart) || 0;
    const discountAmount = currentPrice * (discount / 100);
    const newPrice = currentPrice - discountAmount;
    
    return {
      discount,
      discountAmount,
      newPrice,
      formattedDiscountAmount: discountAmount.toLocaleString(),
      formattedNewPrice: newPrice.toLocaleString()
    };
  }, [discountShoppingCart, currentPrice, mode]);

  // Calculate expiration date
  const expirationDate = useMemo(() => {
    if (duration.months === 0 && duration.days === 0 && 
        duration.hours === 0 && duration.minutes === 0) {
      return null; // Permanent
    }
    
    const now = new Date();
    const expiration = new Date(now);
    
    if (duration.months) expiration.setMonth(expiration.getMonth() + duration.months);
    if (duration.days) expiration.setDate(expiration.getDate() + duration.days);
    if (duration.hours) expiration.setHours(expiration.getHours() + duration.hours);
    if (duration.minutes) expiration.setMinutes(expiration.getMinutes() + duration.minutes);
    
    return expiration;
  }, [duration]);

  // Validate inputs in real-time
  useEffect(() => {
    if (mode === 'unfeature') {
      setWarnings([]);
      return;
    }
    
    const warningsList = [];
    
    // Discount validation
    const discount = parseFloat(discountShoppingCart);
    if (isNaN(discount)) {
      warningsList.push('Discount must be a number');
    } else if (discount < 0.01) {
      warningsList.push('Discount must be at least 0.01%');
    } else if (discount > 99.99) {
      warningsList.push('Discount cannot exceed 99.99%');
    } else if (discount > 70) {
      warningsList.push('Warning: Discount above 70% might affect profitability');
    } else if (discount < 5) {
      warningsList.push('Small discounts (below 5%) might not attract customers');
    }
    
    // Duration validation
    const hasNegative = Object.values(duration).some(val => val < 0);
    if (hasNegative) {
      warningsList.push('Duration cannot be negative');
    }
    
    // Check for unreasonably long duration
    const totalDays = (duration.months * 30) + duration.days;
    if (totalDays > 365) {
      warningsList.push('Feature duration longer than 1 year is not recommended');
    }
    
    // Check for immediate expiration (less than 1 hour)
    const totalMinutes = (duration.days * 24 * 60) + (duration.hours * 60) + duration.minutes;
    if (totalMinutes > 0 && totalMinutes < 60) {
      warningsList.push('Feature duration less than 1 hour might not be effective');
    }
    
    setWarnings(warningsList);
  }, [discountShoppingCart, duration, mode]);

  // Format duration display
  const formatDuration = () => {
    const parts = [];
    if (duration.months) parts.push(`${duration.months} month${duration.months > 1 ? 's' : ''}`);
    if (duration.days) parts.push(`${duration.days} day${duration.days > 1 ? 's' : ''}`);
    if (duration.hours) parts.push(`${duration.hours} hour${duration.hours > 1 ? 's' : ''}`);
    if (duration.minutes) parts.push(`${duration.minutes} minute${duration.minutes > 1 ? 's' : ''}`);
    
    return parts.length > 0 ? parts.join(', ') : 'Permanent (no expiration)';
  };

  // Handle discount input with validation
  const handleDiscountChange = (value) => {
    if (mode === 'unfeature') return;
    
    const sanitizedValue = value.replace(/[^\d.]/g, '');
    const parts = sanitizedValue.split('.');
    if (parts.length > 2) return;
    
    if (parts[1] && parts[1].length > 2) return;
    
    setDiscountShoppingCart(sanitizedValue);
  };

  // Validate before submission for feature mode
  const validateFeatureSubmission = () => {
    const errors = [];
    
    // Required discount
    if (!discountShoppingCart || discountShoppingCart.trim() === '') {
      errors.push('Discount percentage is required');
      return { isValid: false, errors };
    }
    
    const discount = parseFloat(discountShoppingCart);
    if (isNaN(discount)) {
      errors.push('Discount must be a valid number');
      return { isValid: false, errors };
    }
    
    if (discount < 0.01 || discount > 99.99) {
      errors.push('Discount must be between 0.01 and 99.99');
      return { isValid: false, errors };
    }
    
    // Check for negative duration values
    const hasNegative = Object.values(duration).some(val => val < 0);
    if (hasNegative) {
      errors.push('Duration values cannot be negative');
      return { isValid: false, errors };
    }
    
    return { isValid: true, errors };
  };

  const handleFeatureProduct = async () => {
    if (mode === 'unfeature') {
      await handleUnfeatureProduct();
      return;
    }
    
    setError(null);
    
    const validation = validateFeatureSubmission();
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }
    
    // Confirm for permanent featuring
    if (duration.months === 0 && duration.days === 0 && 
        duration.hours === 0 && duration.minutes === 0) {
      const confirmed = window.confirm(
        "No duration specified. This will feature the product permanently until manually removed. Continue?"
      );
      if (!confirmed) return;
    }
    
    try {
      setIsLoading(true);
      
      const requestData = {
        discountShoppingCart: parseFloat(discountShoppingCart),
        months: duration.months || null,
        days: duration.days || null,
        hours: duration.hours || null,
        minutes: duration.minutes || null
      };
      
      await featureProduct(productId, requestData);
      
      if (onSuccess) {
        onSuccess(`✅ Product "${productName}" has been featured successfully!`);
      }
    } catch (err) {
      // Enhanced error handling
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid request parameters');
      } else if (err.response?.status === 404) {
        setError('Product not found. It may have been deleted.');
      } else if (err.response?.status === 409) {
        setError('Product is already featured. Please refresh the page.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
      } else if (err.message?.includes('Network Error')) {
        setError('Network error. Please check your connection.');
      } else {
        setError(err.response?.data?.message || 'Failed to feature product');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfeatureProduct = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to remove "${productName}" from featured products?`
    );
    
    if (!confirmed) return;
    
    try {
      setIsLoading(true);
      await unfeatureProduct(productId);
      
      if (onSuccess) {
        onSuccess(`🗑️ Product "${productName}" has been removed from featured products.`);
        // Switch to feature mode after successful unfeature
        setMode('feature');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unfeature product');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick duration presets
  const durationPresets = [
    { label: '24 Hours', value: { days: 1, hours: 0, minutes: 0, months: 0 } },
    { label: '3 Days', value: { days: 3, hours: 0, minutes: 0, months: 0 } },
    { label: '1 Week', value: { days: 7, hours: 0, minutes: 0, months: 0 } },
    { label: '1 Month', value: { months: 1, days: 0, hours: 0, minutes: 0 } },
    { label: 'Permanent', value: { months: 0, days: 0, hours: 0, minutes: 0 } },
  ];

  // If product is already featured, show unfeature UI
  if (mode === 'unfeature') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-lg mx-auto border border-gray-200 dark:border-gray-700">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-full shadow-lg">
              <Check className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg">Product is Featured</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
                {productName}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <ShoppingCart className="text-green-500 text-sm" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Current Price: Ksh {currentPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors"
              aria-label="Close"
            >
              <X className="text-xl" />
            </button>
          )}
        </div>

        {/* Featured Status Card */}
        <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ShoppingCart className="text-green-600 dark:text-green-400 text-2xl" />
            <h4 className="text-lg font-bold text-green-800 dark:text-green-300">
              Currently Featured
            </h4>
          </div>
          
          {currentFeaturedUntil ? (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Calendar className="text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-700 dark:text-green-400">
                  Featured Until
                </span>
              </div>
              <p className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                {new Date(currentFeaturedUntil).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(currentFeaturedUntil).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
              
              {/* Time remaining */}
              <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Time Remaining:</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {(() => {
                    const now = new Date();
                    const expiry = new Date(currentFeaturedUntil);
                    const diffMs = expiry - now;
                    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    
                    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ${diffHours} hour${diffHours > 1 ? 's' : ''}`;
                    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
                    return 'Less than 1 hour';
                  })()}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <ShoppingCart className="text-yellow-500 text-xl" />
                <span className="font-bold text-yellow-700 dark:text-yellow-400">
                  Permanent Feature
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                This product will remain featured until manually removed
              </p>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Price</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              Ksh {currentPrice.toLocaleString()}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
            <p className="text-sm text-blue-700 dark:text-blue-400 mb-1">Featured Status</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">Active</p>
          </div>
        </div>

        {/* Warning */}
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-700 dark:text-yellow-400">
              <p className="font-medium mb-1">Removing from featured products will:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Remove product from homepage featured section</li>
                <li>Remove any active discounts applied</li>
                <li>Restore original pricing if discount was applied</li>
                <li>Product can be re-featured anytime</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-pulse">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" />
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                {error}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setMode('feature')}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border-2 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all hover:shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ShoppingCart />
            Modify Feature
          </button>
          <button
            onClick={handleUnfeatureProduct}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Removing...
              </>
            ) : (
              <>
                <Trash2 />
                Remove Feature
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Product is NOT featured - show feature form
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-lg mx-auto border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-3 rounded-full shadow-lg">
            <ShoppingCart className="text-white text-xl" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">Feature Product</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-[200px]">
              {productName}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <ShoppingCart className="text-green-500 text-sm" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Ksh {currentPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="text-xl" />
          </button>
        )}
      </div>

      {/* Status Indicator */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="font-medium text-gray-700 dark:text-gray-300">Not Featured</span>
          </div>
          <button
            onClick={() => setMode('unfeature')}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            View featured products →
          </button>
        </div>
      </div>

      {/* Main Form for Feature Mode */}
      <div className="space-y-6">
        {/* Discount Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <ShoppingCart className="text-blue-500" />
              Discount ShoppingCartage
            </label>
            <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              0.01 - 99.99%
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={discountShoppingCart}
                onChange={(e) => handleDiscountChange(e.target.value)}
                onBlur={() => {
                  const num = parseFloat(discountShoppingCart);
                  if (!isNaN(num)) {
                    setDiscountShoppingCart(num.toxed(2));
                  }
                }}
                className="w-full border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded-lg px-4 py-3 text-lg font-bold text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 focus:outline-none transition-colors"
                placeholder="0.00"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">%</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 min-w-[60px] text-center">
                {calculatedValues.discount}%
              </div>
              <div className="text-xs text-gray-500 mt-1">Discount</div>
            </div>
          </div>
        </div>

        {/* Price Preview */}
        <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Price</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                Ksh {currentPrice.toLocaleString()}
              </p>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg shadow-sm border border-green-100 dark:border-green-800">
              <p className="text-sm text-green-700 dark:text-green-400 mb-1">Featured Price</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                Ksh {calculatedValues.formattedNewPrice}
              </p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Customer Savings</span>
              </div>
              <div className="text-lg font-bold text-green-600 dark:text-green-400">
                Ksh {calculatedValues.formattedDiscountAmount}
              </div>
            </div>
          </div>
        </div>

        {/* Duration Section */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <ShoppingCart className="text-purple-500" />
            Feature Duration
          </label>
          
          {/* Duration Presets */}
          <div className="flex flex-wrap gap-2 mb-4">
            {durationPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setDuration(preset.value)}
                className={`px-3 py-2 text-sm rounded-lg transition-all ${
                  JSON.stringify(duration) === JSON.stringify(preset.value)
                    ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-2 border-purple-300 dark:border-purple-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 border border-transparent'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-700 dark:text-yellow-400">
                <p className="font-medium mb-1">Recommendations:</p>
                <ul className="list-disc pl-4 space-y-1">
                  {warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-pulse">
            <div className="flex items-center gap-2">
              <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" />
              <span className="text-sm font-medium text-red-700 dark:text-red-400">
                {error}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3">
        {onCancel && (
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all hover:shadow-md disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleFeatureProduct}
          disabled={isLoading || warnings.length > 0}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-lg flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart />
              Feature Product
            </span>
          )}
        </button>
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div className="flex items-center justify-between">
            <span>Product will be featured with:</span>
            <span className="font-medium text-amber-600 dark:text-amber-400">
              {calculatedValues.discount}% discount
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Duration:</span>
            <span className="font-medium text-purple-600 dark:text-purple-400">
              {formatDuration()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureProductForm;