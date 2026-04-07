// src/utils/analytics.js
import { v4 as uuidv4 } from 'uuid';
import { logAnalyticsEvent } from '../api/analytics';
import { useAuthStore } from '../store/authStore';

// Generate or retrieve session ID
const SESSION_KEY = 'plugged_session_id';

export const getSessionId = () => {
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

// Track an event
export const trackEvent = async (eventType, data = {}) => {
  const { user, isAuthenticated } = useAuthStore.getState();
  const sessionId = getSessionId();

  const payload = {
    eventType,
    sessionId,
    ...(isAuthenticated && user?.id && { userId: user.id }),
    ...(data.productId && { productId: data.productId }),
    metadata: data.metadata || {},
  };

  try {
    await logAnalyticsEvent(payload);
  } catch (err) {
    // Silent fail – analytics should not block user experience
    console.debug('Analytics error:', err);
  }
};

// Helper to track page views
export const trackPageView = (path, metadata = {}) => {
  trackEvent('PAGE_VIEW', {
    metadata: { path, ...metadata },
  });
};

// Helper to track product views
export const trackProductView = (productId, metadata = {}) => {
  trackEvent('PRODUCT_VIEW', {
    productId,
    metadata: { ...metadata },
  });
};

// Helper to track add to cart
export const trackAddToCart = (productId, quantity, price, metadata = {}) => {
  trackEvent('ADD_TO_CART', {
    productId,
    metadata: { quantity, price, ...metadata },
  });
};

// Helper to track add to wishlist
export const trackAddToWishlist = (productId, metadata = {}) => {
  trackEvent('ADD_TO_WISHLIST', {
    productId,
    metadata,
  });
};

// Helper to track checkout start
export const trackCheckoutStart = (cartItems, total, metadata = {}) => {
  trackEvent('CHECKOUT_START', {
    metadata: { cartItems, total, ...metadata },
  });
};

// Helper to track purchase
export const trackPurchase = (orderId, total, items, metadata = {}) => {
  trackEvent('PURCHASE', {
    metadata: { orderId, total, items, ...metadata },
  });
};