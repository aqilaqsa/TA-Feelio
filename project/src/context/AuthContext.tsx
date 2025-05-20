import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { User, UserSegment, AuthFormData } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isImpersonating: boolean;
  impersonator: User | null;
  login: (data: AuthFormData) => Promise<void>;
  signup: (data: AuthFormData) => Promise<void>;
  impersonate: (child: User) => void;
  returnToPendamping: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API = import.meta.env.VITE_API_BASE;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [impersonator, setImpersonator] = useState<User | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("feelio-user");
    const storedImpersonator = localStorage.getItem("feelio-impersonator");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      if (storedImpersonator) {
        setImpersonator(JSON.parse(storedImpersonator));
        setIsImpersonating(true);
      }
    }

    setLoading(false);
  }, []);

  const login = async (data: AuthFormData) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/login`, {
        email: data.email,
        password: data.password,
      });

      const userFromServer: User = {
        id: String(response.data.user_id),
        name: response.data.name,
        email: data.email,
        segment: response.data.segment === 1 ? "7-9" : "10-12",
        role: response.data.role,
        totalScore: 0,
        createdAt: new Date().toISOString(),
      };

      setUser(userFromServer);
      localStorage.setItem("feelio-user", JSON.stringify(userFromServer));
      localStorage.removeItem("feelio-impersonator");
      setIsImpersonating(false);
      setImpersonator(null);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (data: AuthFormData) => {
    setLoading(true);
    try {
      const segmentNumber = data.segment === "7-9" ? 1 : 2;

      await axios.post(`${API}/signup`, {
        name: data.name,
        email: data.email,
        password: data.password,
        segment: segmentNumber,
        role: data.role || "kid", // fallback
      });
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const impersonate = (child: User) => {
    if (!user) return;
    localStorage.setItem("feelio-impersonator", JSON.stringify(user));
    localStorage.setItem("feelio-user", JSON.stringify(child));
    setImpersonator(user);
    setUser(child);
    setIsImpersonating(true);
  };

  const returnToPendamping = (
    navigate?: (path: string, options?: { replace?: boolean }) => void
  ) => {
    if (impersonator) {
      setUser(impersonator);
      localStorage.setItem("feelio-user", JSON.stringify(impersonator));
      setImpersonator(null);
      setIsImpersonating(false);

      if (navigate) {
        navigate("/pendamping", { replace: true }); 
      } else {
        window.location.href = "/pendamping";
      }
    }
  };

  const logout = () => {
    // Always fully reset everything and redirect
    setUser(null);
    setImpersonator(null);
    setIsImpersonating(false);
    localStorage.removeItem("feelio-user");
    localStorage.removeItem("feelio-impersonator");
    window.location.href = "/login"; // ✅ force logout UI + memory reset
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isImpersonating,
        impersonator,
        login,
        signup,
        impersonate,
        returnToPendamping,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
