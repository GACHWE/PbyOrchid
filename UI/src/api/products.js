// services/products.js
import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "./constant";

// Get all products with filters, pagination, sorting
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
  const params = new URLSearchParams();

  if (categoryId) params.append("categoryId", categoryId);
  if (brand) params.append("brand", brand);
  if (gender) params.append("gender", gender);
  if (minPrice) params.append("minPrice", minPrice);
  if (maxPrice) params.append("maxPrice", maxPrice);
  if (featured !== undefined) params.append("featured", featured);
  if (newArrival !== undefined) params.append("newArrival", newArrival);
  if (search) params.append("search", search);
  params.append("page", page);
  params.append("size", size);
  params.append("sort", sort);

  const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;
  try {
    const response = await axios.get(fullUrl);
    return response?.data; // Page<ProductDto>
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

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
  const params = new URLSearchParams({ page, size });
  try {
    const response = await axios.get(`${url}?${params.toString()}`);
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
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