// // services/products.js
// import axios from "axios";
// import { API_BASE_URL, API_URLS, getHeaders } from "./constant";

// // Get all products with filters, pagination, sorting
// export const getAllProducts = async ({
//   categoryId,
//   brand,
//   gender,
//   minPrice,
//   maxPrice,
//   featured,
//   newArrival,
//   search,
//   page = 0,
//   size = 20,
//   sort = "createdAt,desc",
// } = {}) => {
//   const url = API_BASE_URL + API_URLS.GET_PRODUCTS_V2;
//   const params = new URLSearchParams();

//   if (categoryId) params.append("categoryId", categoryId);
//   if (brand) params.append("brand", brand);
//   if (gender) params.append("gender", gender);
//   if (minPrice) params.append("minPrice", minPrice);
//   if (maxPrice) params.append("maxPrice", maxPrice);
//   if (featured !== undefined) params.append("featured", featured);
//   if (newArrival !== undefined) params.append("newArrival", newArrival);
//   if (search) params.append("search", search);
//   params.append("page", page);
//   params.append("size", size);
//   params.append("sort", sort);

//   const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;
//   try {
//     const response = await axios.get(fullUrl);
//     return response?.data; // Page<ProductDto>
//   } catch (err) {
//     throw new Error(err.response?.data?.message || err.message);
//   }
// };

// export const getProductById = async (id) => {
//   const url = API_BASE_URL + API_URLS.GET_PRODUCT_BY_ID_V2(id);
//   try {
//     const response = await axios.get(url);
//     return response?.data;
//   } catch (err) {
//     throw new Error(err.response?.data?.message || err.message);
//   }
// };

// export const getProductBySlug = async (slug) => {
//   const url = API_BASE_URL + API_URLS.GET_PRODUCT_BY_SLUG_V2(slug);
//   try {
//     const response = await axios.get(url);
//     return response?.data;
//   } catch (err) {
//     throw new Error(err.response?.data?.message || err.message);
//   }
// };

// export const getFeaturedProducts = async (page = 0, size = 20) => {
//   const url = API_BASE_URL + API_URLS.GET_FEATURED_PRODUCTS;
//   const params = new URLSearchParams({ page, size });
//   try {
//     const response = await axios.get(`${url}?${params.toString()}`);
//     return response?.data;
//   } catch (err) {
//     throw new Error(err.response?.data?.message || err.message);
//   }
// };

// // Get product count for pagination
// export const getProductCount = async ({ categoryId, typeId, search } = {}) => {
//     let url = API_BASE_URL + API_URLS.GET_PRODUCTS + "/count";
//     const params = new URLSearchParams();

//     if (categoryId) params.append("categoryId", categoryId);
//     if (typeId) params.append("typeId", typeId);
//     if (search) params.append("search", search);

//     if (params.toString()) {
//         url = url + `?` + params.toString();
//     }

//     try {
//         const config = createAuthHeaders();
//         const result = await axios.get(url, config);
//         return result?.data?.count || 0;
//     } catch (err) {
//         console.error("Error fetching product count:", err);
//         return 0;
//     }
// };

// // Admin only
// export const createProduct = async (productData) => {
//   const url = API_BASE_URL + API_URLS.CREATE_PRODUCT_V2;
//   try {
//     const response = await axios.post(url, productData, {
//       headers: getHeaders(),
//     });
//     return response?.data;
//   } catch (err) {
//     throw new Error(err.response?.data?.message || err.message);
//   }
// };

// export const updateProduct = async (id, productData) => {
//   const url = API_BASE_URL + API_URLS.UPDATE_PRODUCT_V2(id);
//   try {
//     const response = await axios.put(url, productData, {
//       headers: getHeaders(),
//     });
//     return response?.data;
//   } catch (err) {
//     throw new Error(err.response?.data?.message || err.message);
//   }
// };

// export const deleteProduct = async (id) => {
//   const url = API_BASE_URL + API_URLS.DELETE_PRODUCT_V2(id);
//   try {
//     const response = await axios.delete(url, {
//       headers: getHeaders(),
//     });
//     return response?.data;
//   } catch (err) {
//     throw new Error(err.response?.data?.message || err.message);
//   }
// };

// export const featureProduct = async (id, featureData) => {
//   const url = API_BASE_URL + API_URLS.FEATURE_PRODUCT_V2(id);
//   try {
//     const response = await axios.put(url, featureData, {
//       headers: getHeaders(),
//     });
//     return response?.data;
//   } catch (err) {
//     throw new Error(err.response?.data?.message || err.message);
//   }
// };

// export const unfeatureProduct = async (id) => {
//   const url = API_BASE_URL + API_URLS.UNFEATURE_PRODUCT_V2(id);
//   try {
//     const response = await axios.put(url, {}, { headers: getHeaders() });
//     return response?.data;
//   } catch (err) {
//     throw new Error(err.response?.data?.message || err.message);
//   }
// };

// export const toggleNewArrival = async (id, newArrival) => {
//   const url = API_BASE_URL + API_URLS.TOGGLE_NEW_ARRIVAL(id, newArrival);
//   try {
//     const response = await axios.put(url, {}, { headers: getHeaders() });
//     return response?.data;
//   } catch (err) {
//     throw new Error(err.response?.data?.message || err.message);
//   }
// };

import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "./constant";

/**
 * Get all products with filtering, pagination, and sorting
 * @param {Object} params - Query parameters
 * @param {string} params.categoryId - UUID of category
 * @param {string} params.brand - Brand name
 * @param {string} params.gender - 'Men' or 'Women'
 * @param {number} params.minPrice - Minimum price
 * @param {number} params.maxPrice - Maximum price
 * @param {boolean} params.featured - Filter featured products
 * @param {boolean} params.newArrival - Filter new arrivals
 * @param {string} params.search - Search term (name or description)
 * @param {number} params.page - Page number (0-indexed)
 * @param {number} params.size - Items per page (default 20)
 * @param {string} params.sort - Sort field and direction, e.g., "price,asc" or "createdAt,desc"
 * @returns {Promise<Page<ProductDto>>}
 */
export const getAllProducts = async ({
  categoryId,
  brand,
  gender,
  minPrice,
  maxPrice,
  featured,
  newArrival,
  search,
  page = 0,
  size = 20,
  sort = "createdAt,desc",
} = {}) => {
  const url = API_BASE_URL + API_URLS.GET_PRODUCTS_V2;
  const paramsObj = {};

  // Add only defined values
  if (categoryId) paramsObj.categoryId = categoryId;
  if (brand && brand !== 'All') paramsObj.brand = brand;
  if (gender && gender !== 'All') paramsObj.gender = gender;
  if (minPrice !== undefined && minPrice !== null) paramsObj.minPrice = minPrice;
  if (maxPrice !== undefined && maxPrice !== null) paramsObj.maxPrice = maxPrice;
  if (featured !== undefined && featured !== null) paramsObj.featured = featured;
  if (newArrival !== undefined && newArrival !== null) paramsObj.newArrival = newArrival;
  if (search) paramsObj.search = search;
  
  // Pagination
  paramsObj.page = page;
  paramsObj.size = size;
  paramsObj.sort = sort;

  try {
    const response = await axios.get(url, { params: paramsObj });
    return response.data; // Page<ProductDto>
  } catch (err) {
    console.error("Error fetching products:", err);
    throw new Error(err.response?.data?.message || err.message || "Failed to fetch products");
  }
};

// Keep existing functions unchanged...
export const getProductById = async (id) => {
  const url = API_BASE_URL + API_URLS.GET_PRODUCT_BY_ID_V2(id);
  try {
    const response = await axios.get(url);
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const getProductBySlug = async (slug) => {
  const url = API_BASE_URL + API_URLS.GET_PRODUCT_BY_SLUG_V2(slug);
  try {
    const response = await axios.get(url);
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const getFeaturedProducts = async (page = 0, size = 20) => {
  const url = API_BASE_URL + API_URLS.GET_FEATURED_PRODUCTS;
  try {
    const response = await axios.get(url, { params: { page, size } });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

// Get product count for pagination (if endpoint exists)
export const getProductCount = async ({ categoryId, typeId, search } = {}) => {
  let url = API_BASE_URL + API_URLS.GET_PRODUCTS + "/count";
  const params = new URLSearchParams();
  if (categoryId) params.append("categoryId", categoryId);
  if (typeId) params.append("typeId", typeId);
  if (search) params.append("search", search);
  if (params.toString()) url = url + `?${params.toString()}`;
  try {
    const config = getHeaders(); // assuming getHeaders returns axios config with auth
    const result = await axios.get(url, config);
    return result?.data?.count || 0;
  } catch (err) {
    console.error("Error fetching product count:", err);
    return 0;
  }
};

// Admin only
export const createProduct = async (productData) => {
  const url = API_BASE_URL + API_URLS.CREATE_PRODUCT_V2;
  try {
    const response = await axios.post(url, productData, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const updateProduct = async (id, productData) => {
  const url = API_BASE_URL + API_URLS.UPDATE_PRODUCT_V2(id);
  try {
    const response = await axios.put(url, productData, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const deleteProduct = async (id) => {
  const url = API_BASE_URL + API_URLS.DELETE_PRODUCT_V2(id);
  try {
    const response = await axios.delete(url, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const featureProduct = async (id, featureData) => {
  const url = API_BASE_URL + API_URLS.FEATURE_PRODUCT_V2(id);
  try {
    const response = await axios.put(url, featureData, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const unfeatureProduct = async (id) => {
  const url = API_BASE_URL + API_URLS.UNFEATURE_PRODUCT_V2(id);
  try {
    const response = await axios.put(url, {}, { headers: getHeaders() });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const toggleNewArrival = async (id, newArrival) => {
  const url = API_BASE_URL + API_URLS.TOGGLE_NEW_ARRIVAL(id, newArrival);
  try {
    const response = await axios.put(url, {}, { headers: getHeaders() });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};