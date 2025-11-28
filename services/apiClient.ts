const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    avatar?: string;
    stats: any;
  };
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem("token");
  }

  setAuthToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Network error" }));
      throw new Error(error.error || "Щось пішло не так");
    }

    return response.json();
  }

  // Auth
  async register(
    email: string,
    password: string,
    username: string
  ): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, username }),
    });
    this.token = data.token;
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    this.token = data.token;
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  }

  logout() {
    this.token = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // User
  async getProfile() {
    return this.request("/auth/profile");
  }

  async getUser() {
    return this.request("/users/me");
  }

  async updateStats(stats: {
    xpDelta?: number;
    cardsLearned?: number;
    testsPassed?: number;
  }) {
    return this.request("/users/stats", {
      method: "PATCH",
      body: JSON.stringify(stats),
    });
  }

  async addAchievement(achievement: string) {
    return this.request("/users/achievements", {
      method: "POST",
      body: JSON.stringify({ achievement }),
    });
  }

  // Materials
  async getMaterials() {
    return this.request("/materials");
  }

  async getMaterial(id: string) {
    return this.request(`/materials/${id}`);
  }

  async createMaterial(materialData: any) {
    return this.request("/materials", {
      method: "POST",
      body: JSON.stringify(materialData),
    });
  }

  async updateMaterial(id: string, data: any) {
    return this.request(`/materials/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async updateFlashcard(
    materialId: string,
    cardId: string,
    status: string,
    nextReview?: number
  ) {
    return this.request(`/materials/${materialId}/flashcards/${cardId}`, {
      method: "PATCH",
      body: JSON.stringify({ status, nextReview }),
    });
  }

  async deleteMaterial(id: string) {
    return this.request(`/materials/${id}`, {
      method: "DELETE",
    });
  }

  // Chat
  async getChatHistory(materialId: string) {
    return this.request(`/chat/${materialId}`);
  }

  async addChatMessage(
    materialId: string,
    role: "user" | "model",
    text: string
  ) {
    return this.request(`/chat/${materialId}/messages`, {
      method: "POST",
      body: JSON.stringify({ role, text }),
    });
  }

  async clearChatHistory(materialId: string) {
    return this.request(`/chat/${materialId}`, {
      method: "DELETE",
    });
  }

  // Quiz
  async saveQuizResult(resultData: any) {
    return this.request("/quiz", {
      method: "POST",
      body: JSON.stringify(resultData),
    });
  }

  async getQuizResults(materialId: string) {
    return this.request(`/quiz/material/${materialId}`);
  }

  async getAllQuizResults() {
    return this.request("/quiz");
  }

  async getQuizStats() {
    return this.request("/quiz/stats");
  }
}

export const api = new ApiClient();
