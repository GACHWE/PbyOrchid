// /analytics.js
import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "./constant";

// Admin only - get dashboard overview
export const getAdminOverview = async () => {
  const url = API_BASE_URL + API_URLS.ADMIN_OVERVIEW;
  try {
    const response = await axios.get(url, { headers: getHeaders() });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};