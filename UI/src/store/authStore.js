// // src/store/authStore.js
// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { loginAPI, registerAPI, refreshTokenAPI } from "../api/auth";
// import {
//   setAccessToken,
//   setRefreshToken,
//   clearTokens,
//   getAccessToken,
//   decodeToken,
//   isAuthenticated as checkTokenValidity,
// } from "../utils/jwt-helper";

// export const useAuthStore = create(
//   persist(
//     (set, get) => ({
//       user: null,
//       accessToken: null,
//       refreshToken: null,
//       isAuthenticated: false,
//       isLoading: false,
//       error: null,

//       login: async (credentials) => {
//         set({ isLoading: true, error: null });
//         try {
//           const response = await loginAPI(credentials);
//           const { accessToken, refreshToken } = response;
//           setAccessToken(accessToken);
//           setRefreshToken(refreshToken);

//           const decoded = decodeToken(accessToken);
//           // Extract role from authorities (e.g., ["ROLE_ADMIN"] -> "admin")
//           const role = decoded.role?.[0]?.replace("ROLE_", "") || "user";

//           const user = {
//             id: decoded.userId || decoded.sub,
//             email: decoded.email || credentials.email,
//             firstname: decoded.name || credentials.email.split("@")[0],
//             lastname: decoded.lastName || null,
//             role, // 👈 set the role
//           };

//           set({
//             user,
//             accessToken,
//             refreshToken,
//             isAuthenticated: true,
//             isLoading: false,
//           });
//           return { success: true, user };
//         } catch (error) {
//           set({ error: error.message, isLoading: false });
//           return { success: false, error: error.message };
//         }
//       },

//       // Register new user
//       register: async (userData) => {
//         set({ isLoading: true, error: null });
//         try {
//           const response = await registerAPI(userData);
//           // The backend returns JwtResponse with accessToken and refreshToken
//           const { accessToken, refreshToken } = response;

//           // Store tokens
//           setAccessToken(accessToken);
//           setRefreshToken(refreshToken);

//           // Decode token to get user info
//           const decoded = decodeToken(accessToken);
//           const user = {
//             id: decoded.userId || decoded.sub,
//             email: decoded.email || userData.email,
//             name:
//               decoded.name ||
//               `${userData.firstName} ${userData.lastName}`.trim(),
//             role: decoded.authorities?.[0]?.replace("ROLE_", "") || "user",
//           };

//           set({
//             user,
//             accessToken,
//             refreshToken,
//             isAuthenticated: true,
//             isLoading: false,
//           });

//           return { success: true, user };
//         } catch (error) {
//           set({ error: error.message, isLoading: false });
//           return { success: false, error: error.message };
//         }
//       },
//       // Logout
//       logout: () => {
//         clearTokens();
//         set({
//           user: null,
//           accessToken: null,
//           refreshToken: null,
//           isAuthenticated: false,
//           error: null,
//         });
//       },

//       // Check if token is still valid and optionally refresh
//       checkAuth: async () => {
//         const token = getAccessToken();
//         if (!token) {
//           set({ isAuthenticated: false });
//           return false;
//         }

//         if (checkTokenValidity()) {
//           // Token is valid, decode and set user
//           const decoded = decodeToken(token);
//           const user = {
//             id: decoded.userId || decoded.sub,
//             email: decoded.email,
//             firstName: decoded.name,
//             lastName: decoded.lastName || null,
//             role: decoded.authorities?.[0]?.replace("ROLE_", "") || "user",
//           };
//           set({ user, accessToken: token, isAuthenticated: true });
//           return true;
//         } else {
//           // Token expired, try refresh
//           const refresh = get().refreshToken;
//           if (refresh) {
//             try {
//               const response = await refreshTokenAPI(refresh);
//               const { accessToken: newToken, refreshToken: newRefresh } =
//                 response;
//               setAccessToken(newToken);
//               setRefreshToken(newRefresh);
//               const decoded = decodeToken(newToken);
//               const user = {
//                 id: decoded.userId || decoded.sub,
//                 email: decoded.email,
//                 firstName: decoded.name,
//                 lastName: decoded.lastName || null,
//                 role: decoded.authorities?.[0]?.replace("ROLE_", "") || "user",
//               };
//               set({
//                 user,
//                 accessToken: newToken,
//                 refreshToken: newRefresh,
//                 isAuthenticated: true,
//               });
//               return true;
//             } catch (error) {
//               get().logout();
//               return false;
//             }
//           } else {
//             get().logout();
//             return false;
//           }
//         }
//       },
//     }),
//     {
//       name: "plugged-auth",
//       partialize: (state) => ({
//         // Persist only user and refresh token? Actually we persist tokens via localStorage separately, so we might not need to persist in zustand.
//         // But we can still persist user info.
//         user: state.user,
//         refreshToken: state.refreshToken,
//       }),
//     },
//   ),
// );

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
      isLoading: true,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await loginAPI(credentials);
          const { accessToken, refreshToken, userId, firstName, email, role, phoneNumber } = response;

          // Store tokens in localStorage (via helpers)
          setAccessToken(accessToken);
          setRefreshToken(refreshToken);

          // Build user object from direct response fields
          const user = {
            id: userId,
            email: email,
            firstName: firstName,
            lastName: null, // backend doesn't provide lastName in login response
            name: firstName, // for display
            role: role.toLowerCase(), // "admin" or "user"
            phoneNumber: phoneNumber || null,
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

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await registerAPI(userData);
          // Assuming register returns same shape as login
          const { accessToken, refreshToken, userId, firstName, email, role, phoneNumber } = response;

          setAccessToken(accessToken);
          setRefreshToken(refreshToken);

          const user = {
            id: userId,
            email: email,
            firstName: firstName,
            lastName: null,
            name: firstName,
            role: role.toLowerCase(),
            phoneNumber: phoneNumber || null,
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

      logout: () => {
        clearTokens();
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Check if token is still valid and optionally refresh
      checkAuth: async () => {
        set({ isLoading: true });
        const token = getAccessToken();
        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return false;
        }

        if (checkTokenValidity()) {
          // Token is valid – decode it to get user info (fallback if user not persisted)
          const decoded = decodeToken(token);
          // Try to get stored user from state first (persisted), otherwise build from decoded
          const currentUser = get().user;
          if (currentUser && currentUser.id) {
            set({ isAuthenticated: true, isLoading: false });
            return true;
          }
          // Fallback: build user from decoded token (adjust claims as per your JWT structure)
          const user = {
            id: decoded.userId || decoded.sub,
            email: decoded.email,
            firstName: decoded.name || decoded.firstName,
            name: decoded.name || decoded.firstName,
            role: decoded.role?.toLowerCase?.() || decoded.authorities?.[0]?.replace("ROLE_", "")?.toLowerCase() || "user",
          };
          set({ user, accessToken: token, isAuthenticated: true, isLoading: false });
          return true;
        } else {
          // Token expired – try refresh
          const refresh = get().refreshToken;
          if (refresh) {
            try {
              const response = await refreshTokenAPI(refresh);
              const { accessToken: newToken, refreshToken: newRefresh, firstName, email, role, userId } = response;
              setAccessToken(newToken);
              setRefreshToken(newRefresh);
              const user = {
                id: userId,
                email: email,
                firstName: firstName,
                name: firstName,
                role: role.toLowerCase(),
              };
              set({
                user,
                accessToken: newToken,
                refreshToken: newRefresh,
                isAuthenticated: true,
                isLoading: false,
              });
              return true;
            } catch (error) {
              get().logout();
              set({ isLoading: false });
              return false;
            }
          } else {
            get().logout();
            set({ isLoading: false });
            return false;
          }
        }
      },
    }),
    {
      name: "plugged-auth",
      partialize: (state) => ({
        user: state.user,
        refreshToken: state.refreshToken,
      }),
    }
  )
);