// constant.js
import { getToken } from "../utils/jwt-helper";

export const API_BASE_URL = "http://localhost:8080";

export const API_URLS = {
  // Existing (keep yours)
  GET_PRODUCTS: "/api/v1/products",
  GET_PRODUCT: (id) => `/api/v1/product/${id}`,
  GET_CATEGORIES: "/api/v1/categories",
  GET_CATEGORY: (id) => `/api/v1/category/${id}`,
  GET_ORDERS: "/api/v1/admin/orders",
  CANCEL_ORDER: (id) => `/api/v1/admin/orders/${id}/cancel`,

  // NEW AUTH ENDPOINTS
  REGISTER: "/api/v1/auth/register",
  LOGIN: "/api/v1/auth/login",
  REFRESH_TOKEN: "/api/v1/auth/refresh",

  // NEW ANALYTICS ENDPOINT

  ADMIN_OVERVIEW: "/api/v1/analytics/admin/overview",
  ADMIN_USERS: "/api/v1/users/admin/users",
  ADMIN_USER_STATS: "/api/v1/users/admin/users/stats",
  
  // NEW CATEGORIES (Admin)
  CREATE_CATEGORY: "/api/v1/categories",
  UPDATE_CATEGORY: (id) => `/api/v1/categories/${id}`,
  DELETE_CATEGORY: (id) => `/api/v1/categories/${id}`,

  // NEW FILE UPLOAD
  UPLOAD_FILE: "/api/v1/files/upload",
  UPLOAD_MULTIPLE: "/api/v1/files/upload-multiple",
  DELETE_FILE: (publicId) =>
    `/api/v1/files/delete?publicId=${encodeURIComponent(publicId)}`,
  DELETE_FILE_BY_URL: (imageUrl) =>
    `/api/v1/files/delete-by-url?imageUrl=${encodeURIComponent(imageUrl)}`,
  EXTRACT_PUBLIC_ID: (url) =>
    `/api/v1/files/extract-public-id?url=${encodeURIComponent(url)}`,
  FILE_HEALTH: "/api/v1/files/health",

  // NEW ORDERS (Buyer + Admin)
  CREATE_ORDER: "/api/v1/orders",
  GET_USER_ORDERS: "/api/v1/orders",
  GET_ORDER_BY_ID: (id) => `/api/v1/orders/${id}`,
  CANCEL_ORDER: (id) => `/api/v1/orders/${id}`,
  ADMIN_GET_ALL_ORDERS: "/api/v1/orders/admin",
  ADMIN_CONFIRM_ORDER: (id) => `/api/v1/orders/admin/${id}/confirm`,
  ADMIN_DELIVER_ORDER: (id) => `/api/v1/orders/admin/${id}/deliver`,

  // NEW PRODUCTS (enhanced)
  GET_PRODUCTS_V2: "/api/v1/products", // with filters, pagination
  GET_PRODUCT_BY_ID_V2: (id) => `/api/v1/products/${id}`,
  GET_PRODUCT_BY_SLUG_V2: (slug) => `/api/v1/products/slug/${slug}`,
  GET_FEATURED_PRODUCTS: "/api/v1/products/featured",
  CREATE_PRODUCT_V2: "/api/v1/products",
  UPDATE_PRODUCT_V2: (id) => `/api/v1/products/${id}`,
  DELETE_PRODUCT_V2: (id) => `/api/v1/products/${id}`,
  FEATURE_PRODUCT_V2: (id) => `/api/v1/products/${id}/feature`,
  UNFEATURE_PRODUCT_V2: (id) => `/api/v1/products/${id}/unfeature`,
  TOGGLE_NEW_ARRIVAL: (id, newArrival) =>
    `/api/v1/products/${id}/new-arrival?newArrival=${newArrival}`,

  // NEW WISHLIST
  GET_WISHLIST: "/api/v1/wishlist",
  ADD_TO_WISHLIST: (productId) => `/api/v1/wishlist/${productId}`,
  REMOVE_FROM_WISHLIST: (productId) => `/api/v1/wishlist/${productId}`,
};

// export const getHeaders = () => {
//   const token = getToken(); // from your jwt-helper
//   return {
//     Authorization: `Bearer ${token}`,
//   };
// constant.js  ← replace the getHeaders function
export const getHeaders = () => {
  const token = getToken();
  // Only add Authorization header when we actually have a real token
  if (!token) {
    return {}; // no auth header → public endpoints still work
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};
