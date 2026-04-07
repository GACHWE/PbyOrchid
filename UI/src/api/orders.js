// services/orders.js
import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "./constant";

// Buyer endpoints
export const createOrder = async (orderRequest) => {
  const url = API_BASE_URL + API_URLS.CREATE_ORDER;
  try {
    const response = await axios.post(url, orderRequest, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const getUserOrders = async (page = 0, size = 10, sort = "createdAt,desc") => {
  const url = API_BASE_URL + API_URLS.GET_USER_ORDERS;
  const params = new URLSearchParams({ page, size, sort });
  try {
    const response = await axios.get(`${url}?${params.toString()}`, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const getOrderById = async (id) => {
  const url = API_BASE_URL + API_URLS.GET_ORDER_BY_ID(id);
  try {
    const response = await axios.get(url, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

// Admin only
export const getAllOrders = async (page = 0, size = 10, sort = "createdAt,desc") => {
  const url = API_BASE_URL + API_URLS.ADMIN_GET_ALL_ORDERS;
  const params = new URLSearchParams({ page, size, sort });
  try {
    const response = await axios.get(`${url}?${params.toString()}`, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const updateOrderStatus = async (id, status) => {
  const url = API_BASE_URL + API_URLS.ADMIN_UPDATE_ORDER_STATUS(id, status);
  try {
    const response = await axios.put(url, {}, { headers: getHeaders() });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};