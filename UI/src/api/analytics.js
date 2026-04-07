// services/analytics.js
import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "./constant";

// Public - log event (no auth required)
export const logAnalyticsEvent = async (eventData) => {
  const url = API_BASE_URL + API_URLS.ANALYTICS_EVENT;
  try {
    const response = await axios.post(url, eventData);
    return response?.data;
  } catch (err) {
    console.error("Analytics event failed:", err);
    // Don't throw – analytics failures should be silent
  }
};

// Admin only endpoints
export const getRevenueTrends = async (start, end) => {
  const url = API_BASE_URL + API_URLS.ADMIN_REVENUE_TRENDS;
  const params = new URLSearchParams();
  if (start) params.append("start", start);
  if (end) params.append("end", end);
  const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;
  try {
    const response = await axios.get(fullUrl, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const getTopWishlisted = async (limit = 10) => {
  const url = API_BASE_URL + API_URLS.ADMIN_TOP_WISHLISTED;
  const params = new URLSearchParams({ limit });
  try {
    const response = await axios.get(`${url}?${params.toString()}`, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const getVisitorStats = async (start, end) => {
  const url = API_BASE_URL + API_URLS.ADMIN_VISITOR_STATS;
  const params = new URLSearchParams();
  if (start) params.append("start", start);
  if (end) params.append("end", end);
  const fullUrl = params.toString() ? `${url}?${params.toString()}` : url;
  try {
    const response = await axios.get(fullUrl, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const getTopSellers = async (limit = 10) => {
  const url = API_BASE_URL + API_URLS.ADMIN_TOP_SELLERS;
  const params = new URLSearchParams({ limit });
  try {
    const response = await axios.get(`${url}?${params.toString()}`, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};