import api from "./api";

export const authService = {
  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post("/auth/register", userData);
    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
  },

  getCurrentUser() {
    const token = localStorage.getItem("token");
    if (token) {
      // TODO: Decode JWT token
      return { token };
    }
    return null;
  },
};
