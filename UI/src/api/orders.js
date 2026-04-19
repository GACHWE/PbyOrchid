import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "./constant";

// Buyer endpoints
export const createOrder = async (orderRequest) => {
  const url = API_BASE_URL + API_URLS.CREATE_ORDER;
  const response = await axios.post(url, orderRequest, { headers: getHeaders() });
  return response?.data;
};

export const getUserOrders = async (page = 0, size = 10, sort = "createdAt,desc") => {
  const url = API_BASE_URL + API_URLS.GET_USER_ORDERS;
  const params = new URLSearchParams({ page, size, sort });
  const response = await axios.get(`${url}?${params.toString()}`, { headers: getHeaders() });
  return response?.data;
};

export const getOrderById = async (id) => {
  const url = API_BASE_URL + API_URLS.GET_ORDER_BY_ID(id);
  const response = await axios.get(url, { headers: getHeaders() });
  return response?.data;
};

export const cancelOrder = async (id) => {
  const url = API_BASE_URL + API_URLS.CANCEL_ORDER(id);
  const response = await axios.delete(url, { headers: getHeaders() });
  return response?.data;
};

// Admin only
export const getAllOrders = async (page = 0, size = 10, sort = "createdAt,desc") => {
  const url = API_BASE_URL + API_URLS.ADMIN_GET_ALL_ORDERS;
  const params = new URLSearchParams({ page, size, sort });
  const response = await axios.get(`${url}?${params.toString()}`, { headers: getHeaders() });
  return response?.data;
};

export const confirmOrder = async (id) => {
  const url = API_BASE_URL + API_URLS.ADMIN_CONFIRM_ORDER(id);
  const response = await axios.put(url, {}, { headers: getHeaders() });
  return response?.data;
};

export const deliverOrder = async (id) => {
  const url = API_BASE_URL + API_URLS.ADMIN_DELIVER_ORDER(id);
  const response = await axios.put(url, {}, { headers: getHeaders() });
  return response?.data;
};