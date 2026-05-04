const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

class ApiClient {
  private baseUrl: string;
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      headers: {
        contentType: "application/json",
        ...options.headers,
      },
      credentials: "include", // Include cookies for authentication
      ...options,
    };
    const response = await fetch(url, config);
    if (response.status === 401) {
      return null; // Not authenticated
    }
    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ error: "Network error" }));
      throw new Error(error.error || "Request Failed");
    }
  }

  //Auth Methods
  async register (userData: unknown) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login (email: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async logout () {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  async getCurrentUser () {
    return this.request("/auth/me");
  }

  // User Methods
  async getUsers () {
    return this.request("/users");
  }

  // Admin Methods

  async updateUserRole (userId: string, role: string) {

    return this.request(`/user/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  }

  async assignUserToTeam (userId: string, teamId: string | null) {
    return this.request(`/user/${userId}/team`, {
      method: "PATCH",
      body: JSON.stringify({ teamId }),
    });
  }

}

  export const apiClient = new ApiClient();
