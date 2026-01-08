

const TOKEN_KEY = "auth_token";
const ACCOUNT_ID_KEY = "account_id";

export const authUtils = {
  saveToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  saveAccountId: (accountId: string) => {
    localStorage.setItem(ACCOUNT_ID_KEY, accountId);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  getAccountId: (): string | null => {
    return localStorage.getItem(ACCOUNT_ID_KEY);
  },

  getAccountIdFromToken: (): string | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.accountId || null;
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
    localStorage.removeItem(ACCOUNT_ID_KEY);
  },
};

