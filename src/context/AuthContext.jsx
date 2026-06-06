import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

const AUTH_STORAGE_KEYS = [
  "user",
  "token",
  "authToken",
  "accessToken",
  "refreshToken",
  "session",
  "solarvista-user",
  "solarvista-token",
  "solarvista-auth",
];

function clearAuthStorage() {
  AUTH_STORAGE_KEYS.forEach((key) => {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  });

  [localStorage, sessionStorage].forEach((storage) => {
    Object.keys(storage).forEach((key) => {
      if (/(auth|token|session|user)/i.test(key)) {
        storage.removeItem(key);
      }
    });
  });
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    clearAuthStorage();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
