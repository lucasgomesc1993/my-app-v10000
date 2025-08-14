"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Credenciais de teste
const TEST_CREDENTIALS = {
  username: "teste",
  password: "teste",
  user: {
    id: "1",
    name: "Usuário Teste",
    email: "teste@exemplo.com",
    avatar: "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp3/user_itiiaq.png",
  }
};

// Rotas públicas que não precisam de autenticação
const PUBLIC_ROUTES = ["/login"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!user;

  // Verificar se há sessão salva no localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("auth_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("auth_user");
      }
    }
    setIsLoading(false);
  }, []);

  // Redirecionar para login se não autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username === TEST_CREDENTIALS.username && password === TEST_CREDENTIALS.password) {
      setUser(TEST_CREDENTIALS.user);
      localStorage.setItem("auth_user", JSON.stringify(TEST_CREDENTIALS.user));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
    router.push("/login");
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
