// services/wishlist.js
import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "./constant";

export const getWishlist = async (page = 0, size = 10) => {
  const url = API_BASE_URL + API_URLS.GET_WISHLIST;
  const params = new URLSearchParams({ page, size });
  try {
    const response = await axios.get(`${url}?${params.toString()}`, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const addToWishlist = async (productId) => {
  const url = API_BASE_URL + API_URLS.ADD_TO_WISHLIST(productId);
  try {
    const response = await axios.post(url, null, {
      headers: getHeaders(),
    });
    return response?.data; // empty (200 OK)
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const removeFromWishlist = async (productId) => {
  const url = API_BASE_URL + API_URLS.REMOVE_FROM_WISHLIST(productId);
  try {
    const response = await axios.delete(url, {
      headers: getHeaders(),
    });
    return response?.data; // null (204)
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};