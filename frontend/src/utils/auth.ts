

const TOKEN_KEY = "auth_token";
const USER_ID_KEY = "user_id";

export const authUtils = {
  saveToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  saveUserId: (userId: string) => {
    localStorage.setItem(USER_ID_KEY, userId);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUserId: (): string | null => {
    return localStorage.getItem(USER_ID_KEY);
  },

  getUserIdFromToken: (): string | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(TOKEN_KEY);
  },

  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  },
};

