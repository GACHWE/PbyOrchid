// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginAPI, registerAPI, refreshTokenAPI } from "../api/auth";
import {
  setAccessToken,
  setRefreshToken,
  clearTokens,
  getAccessToken,
  decodeToken,
  isAuthenticated as checkTokenValidity,
} from "../utils/jwt-helper";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginAPI(credentials);
          const { accessToken, refreshToken } = response;
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);

          const decoded = decodeToken(accessToken);
          // Extract role from authorities (e.g., ["ROLE_ADMIN"] -> "admin")
          const role = decoded.role?.[0]?.replace("ROLE_", "") || "user";

          const user = {
            id: decoded.userId || decoded.sub,
            email: decoded.email || credentials.email,
            name: decoded.name || credentials.email.split("@")[0],
            role, // 👈 set the role
          };

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
          return { success: true, user };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },

      // Register new user
      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await registerAPI(userData);
          // The backend returns JwtResponse with accessToken and refreshToken
          const { accessToken, refreshToken } = response;

          // Store tokens
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);

          // Decode token to get user info
          const decoded = decodeToken(accessToken);
          const user = {
            id: decoded.userId || decoded.sub,
            email: decoded.email || userData.email,
            name:
              decoded.name ||
              `${userData.firstName} ${userData.lastName}`.trim(),
            role: decoded.authorities?.[0]?.replace("ROLE_", "") || "user",
          };

          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true, user };
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return { success: false, error: error.message };
        }
      },
      // Logout
      logout: () => {
        clearTokens();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Check if token is still valid and optionally refresh
      checkAuth: async () => {
        const token = getAccessToken();
        if (!token) {
          set({ isAuthenticated: false });
          return false;
        }

        if (checkTokenValidity()) {
          // Token is valid, decode and set user
          const decoded = decodeToken(token);
          const user = {
            id: decoded.userId || decoded.sub,
            email: decoded.email,
            name: decoded.name,
            role: decoded.authorities?.[0]?.replace("ROLE_", "") || "user",
          };
          set({ user, accessToken: token, isAuthenticated: true });
          return true;
        } else {
          // Token expired, try refresh
          const refresh = get().refreshToken;
          if (refresh) {
            try {
              const response = await refreshTokenAPI(refresh);
              const { accessToken: newToken, refreshToken: newRefresh } =
                response;
              setAccessToken(newToken);
              setRefreshToken(newRefresh);
              const decoded = decodeToken(newToken);
              const user = {
                id: decoded.userId || decoded.sub,
                email: decoded.email,
                name: decoded.name,
                role: decoded.authorities?.[0]?.replace("ROLE_", "") || "user",
              };
              set({
                user,
                accessToken: newToken,
                refreshToken: newRefresh,
                isAuthenticated: true,
              });
              return true;
            } catch (error) {
              get().logout();
              return false;
            }
          } else {
            get().logout();
            return false;
          }
        }
      },
    }),
    {
      name: "plugged-auth",
      partialize: (state) => ({
        // Persist only user and refresh token? Actually we persist tokens via localStorage separately, so we might not need to persist in zustand.
        // But we can still persist user info.
        user: state.user,
        refreshToken: state.refreshToken,
      }),
    },
  ),
);
