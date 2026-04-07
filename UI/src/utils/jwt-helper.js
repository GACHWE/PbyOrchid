// src/utils/jwt-helper.js

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

/**
 * Store the access token in localStorage
 * @param {string} token - JWT access token
 */
export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

/**
 * Get the access token from localStorage
 * @returns {string|null}
 */
export const getAccessToken = () => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

// Alias for backward compatibility with your existing code
export const getToken = getAccessToken;

/**
 * Store the refresh token
 * @param {string} token - JWT refresh token
 */
export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

/**
 * Get the refresh token
 * @returns {string|null}
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Remove both tokens (logout)
 */
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Check if user is authenticated (has a non-expired token)
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;
  
  try {
    const decoded = decodeToken(token);
    // Check if token has expired
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

/**
 * Decode JWT token without verifying signature
 * @param {string} token - JWT token
 * @returns {object|null} Decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};

/**
 * Get user roles from token
 * @returns {string[]} Array of role names (e.g., ['ROLE_ADMIN', 'ROLE_USER'])
 */
export const getUserRoles = () => {
  const token = getAccessToken();
  if (!token) return [];
  
  const decoded = decodeToken(token);
  // Spring Boot often puts authorities in 'authorities' or 'roles' claim
  return decoded?.authorities || decoded?.roles || [];
};

/**
 * Check if user has a specific role
 * @param {string} role - Role to check (e.g., 'ADMIN', 'ROLE_ADMIN')
 * @returns {boolean}
 */
export const hasRole = (role) => {
  const roles = getUserRoles();
  const formattedRole = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
  return roles.includes(formattedRole);
};

/**
 * Check if user is admin
 * @returns {boolean}
 */
export const isAdmin = () => {
  return hasRole('ADMIN');
};

/**
 * Get user ID from token (if present in claims)
 * @returns {string|null}
 */
export const getUserId = () => {
  const token = getAccessToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded?.userId || decoded?.sub || null;
};

/**
 * Get token expiration timestamp (seconds since epoch)
 * @returns {number|null}
 */
export const getTokenExpiration = () => {
  const token = getAccessToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded?.exp || null;
};

/**
 * Check if token is about to expire (within given seconds)
 * @param {number} secondsThreshold - Default 60 seconds
 * @returns {boolean}
 */
export const isTokenExpiringSoon = (secondsThreshold = 60) => {
  const exp = getTokenExpiration();
  if (!exp) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return (exp - currentTime) <= secondsThreshold;
};