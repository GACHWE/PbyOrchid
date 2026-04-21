// api/auth.js
import axios from "axios";
import { API_BASE_URL, API_URLS } from "./constant";

export const registerAPI = async (body) => {
  const url = API_BASE_URL + API_URLS.REGISTER;
  try {
    const response = await axios({
      method: "POST",
      url,
      data: body,
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const loginAPI = async (body) => {
  const url = API_BASE_URL + API_URLS.LOGIN;
  try {
    const response = await axios({
      method: "POST",
      url,
      data: body,
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};

export const refreshTokenAPI = async (refreshToken) => {
  const url = API_BASE_URL + API_URLS.REFRESH_TOKEN;
  try {
    const response = await axios({
      method: "POST",
      url,
      data: { refreshToken },
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message);
  }
};