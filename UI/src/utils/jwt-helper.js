// src/utils/jwt-helper.js

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getToken = getAccessToken; // alias

export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

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

export const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;
  const decoded = decodeToken(token);
  if (!decoded) return false;
  const currentTime = Date.now() / 1000;
  return decoded.exp > currentTime;
};

/**
 * Get user roles from token.
 * Supports both array (authorities/roles) and single string (role) claims.
 * @returns {string[]} Array of role names with 'ROLE_' prefix
 */
export const getUserRoles = () => {
  const token = getAccessToken();
  if (!token) return [];
  const decoded = decodeToken(token);
  if (!decoded) return [];

  // Case 1: authorities array (Spring Boot standard)
  if (decoded.authorities && Array.isArray(decoded.authorities)) {
    return decoded.authorities;
  }
  // Case 2: roles array
  if (decoded.roles && Array.isArray(decoded.roles)) {
    return decoded.roles;
  }
  // Case 3: single role claim (string)
  if (decoded.role && typeof decoded.role === 'string') {
    // Ensure it starts with ROLE_
    const role = decoded.role.startsWith('ROLE_') ? decoded.role : `ROLE_${decoded.role}`;
    return [role];
  }
  return [];
};

export const hasRole = (role) => {
  const roles = getUserRoles();
  const formattedRole = role.startsWith('ROLE_') ? role : `ROLE_${role}`;
  return roles.includes(formattedRole);
};

export const isAdmin = () => hasRole('ADMIN');

export const getUserId = () => {
  const token = getAccessToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded?.userId || decoded?.sub || null;
};

export const getTokenExpiration = () => {
  const token = getAccessToken();
  if (!token) return null;
  const decoded = decodeToken(token);
  return decoded?.exp || null;
};

export const isTokenExpiringSoon = (secondsThreshold = 60) => {
  const exp = getTokenExpiration();
  if (!exp) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return (exp - currentTime) <= secondsThreshold;
};