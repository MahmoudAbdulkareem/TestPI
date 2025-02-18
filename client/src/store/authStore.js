import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  token: null,
  user: null,

  // Action to set authentication status
  setAuth: (token, user) => {
    set({
      isAuthenticated: true,
      token: token,
      user: user,
    });
    localStorage.setItem('token', token); // Store token in localStorage
  },

  // Action to clear authentication (logout)
  logout: () => {
    set({
      isAuthenticated: false,
      token: null,
      user: null,
    });
    localStorage.removeItem('token'); // Remove token from localStorage
  },

  // Action to check authentication based on token
  checkAuth: () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1])); // Decode JWT
        set({
          isAuthenticated: true,
          token: token,
          user: decoded, // Assuming the token contains user info like role, name, etc.
        });
      } catch (error) {
        set({ isAuthenticated: false, user: null });
        console.error("Invalid token:", error);
      }
    } else {
      set({ isAuthenticated: false, user: null });
    }
  },
}));
