

const TOKEN_KEY = "auth_token";
const ACCOUNT_ID_KEY = "account_id";

interface TokenPayload {
  accountId: string;
  exp: number;
  iat?: number;
}



const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1])) as TokenPayload;
    if (!payload.exp) {
      return true;
    }
    const expirationTime = payload.exp * 1000;
    return Date.now() >= expirationTime;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true; 
  }
};

export const authUtils = {
  saveToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  saveAccountId: (accountId: string) => {
    localStorage.setItem(ACCOUNT_ID_KEY, accountId);
  },

  getToken: (): string | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    
    if (isTokenExpired(token)) {
      authUtils.clearToken();
      return null;
    }
    
    return token;
  },

  getAccountId: (): string | null => {
    return localStorage.getItem(ACCOUNT_ID_KEY);
  },

  getAccountIdFromToken: (): string | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1])) as TokenPayload;
      return payload.accountId || null;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return false;
    
    // Check if token is expired
    if (isTokenExpired(token)) {
      // Clear expired token
      authUtils.clearToken();
      return false;
    }
    
    return true;
  },

  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ACCOUNT_ID_KEY);
  },
};

