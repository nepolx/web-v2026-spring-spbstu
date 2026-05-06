import { useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user"));
  });
  const [sessionId, setSessionId] = useState(() => {
    return localStorage.getItem("sessionId");
  });

  const login = (userData, sessionIdValue) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("sessionId", sessionIdValue);
    setUser(userData);
    setSessionId(sessionIdValue);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("sessionId");
    setUser(null);
    setSessionId(null);
  };

  return {
    user,
    sessionId,
    isAuth: !!user && !!sessionId,
    login,
    logout,
  };
};