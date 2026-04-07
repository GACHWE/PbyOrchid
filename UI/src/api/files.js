// services/files.js
import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "./constant";

// Single file upload (multipart/form-data)
export const uploadFile = async (formData) => {
  const url = API_BASE_URL + API_URLS.UPLOAD_FILE;
  try {
    const response = await axios.post(url, formData, {
      headers: {
        ...getHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message);
  }
};

// Multiple files upload
export const uploadMultipleFiles = async (formData) => {
  const url = API_BASE_URL + API_URLS.UPLOAD_MULTIPLE;
  try {
    const response = await axios.post(url, formData, {
      headers: {
        ...getHeaders(),
        "Content-Type": "multipart/form-data",
      },
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message);
  }
};

export const deleteFileByPublicId = async (publicId) => {
  const url = API_BASE_URL + API_URLS.DELETE_FILE(publicId);
  try {
    const response = await axios.delete(url, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message);
  }
};

export const deleteFileByUrl = async (imageUrl) => {
  const url = API_BASE_URL + API_URLS.DELETE_FILE_BY_URL(imageUrl);
  try {
    const response = await axios.delete(url, {
      headers: getHeaders(),
    });
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message);
  }
};

export const extractPublicId = async (url) => {
  const apiUrl = API_BASE_URL + API_URLS.EXTRACT_PUBLIC_ID(url);
  try {
    const response = await axios.get(apiUrl);
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message);
  }
};

export const fileHealthCheck = async () => {
  const url = API_BASE_URL + API_URLS.FILE_HEALTH;
  try {
    const response = await axios.get(url);
    return response?.data;
  } catch (err) {
    throw new Error(err.response?.data?.error || err.message);
  }
};