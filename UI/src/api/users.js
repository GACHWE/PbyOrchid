// api/users.js
import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "./constant";

export const getAllUsers = async (page = 0, size = 20, search = "", role = "") => {
  const url = API_BASE_URL + API_URLS.ADMIN_USERS;
  const params = new URLSearchParams({
    page,
    size,
    ...(search && { search }),
    ...(role && { role }),
  });
  try {
    const response = await axios.get(`${url}?${params.toString()}`, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const getUserStats = async () => {
  const url = API_BASE_URL + API_URLS.ADMIN_USER_STATS;
  try {
    const response = await axios.get(url, { headers: getHeaders() });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};