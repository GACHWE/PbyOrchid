// services/categories.js
import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "./constant";

// Public
export const getAllCategories = async () => {
  const url = API_BASE_URL + API_URLS.GET_CATEGORIES;
  try {
    const response = await axios.get(url);
    return response?.data;
  } catch (err) {
    console.error("Error fetching categories:", err);
    throw new Error(err.response?.data?.message || err.message);
  }
};

// Admin only
export const createCategory = async (categoryData) => {
  const url = API_BASE_URL + API_URLS.CREATE_CATEGORY;
  try {
    const response = await axios.post(url, categoryData, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const updateCategory = async (id, categoryData) => {
  const url = API_BASE_URL + API_URLS.UPDATE_CATEGORY(id);
  try {
    const response = await axios.put(url, categoryData, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const deleteCategory = async (id) => {
  const url = API_BASE_URL + API_URLS.DELETE_CATEGORY(id);
  try {
    const response = await axios.delete(url, {
      headers: getHeaders(),
    });
    return response?.data; // should be null (204)
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};