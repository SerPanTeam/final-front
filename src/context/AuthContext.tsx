"use client";

import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  loginUser,
  registerUser,
  fetchProfile,
  updateProfileApi,
  saveToken,
  removeToken,
} from "../utils/auth";

// Тип пользователя
interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

// Интерфейс контекста авторизации
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name: string, avatarFile?: File) => Promise<void>;
  isAuthenticated: boolean;
}

// Создаем контекст (начальное значение undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Кастомный хук для удобного доступа к AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth должен использоваться внутри AuthProvider");
  }
  return context;
};

// Провайдер авторизации, оборачивающий приложение и предоставляющий AuthContext
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // При монтировании проверяем, есть ли сохраненный токен, и пытаемся получить профиль пользователя
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const initializeAuth = async () => {
      try {
        const data = await fetchProfile();
        setUser(data.user);
      } catch (error) {
        // Если токен недействительный, удаляем его
        removeToken();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      initializeAuth();
    } else {
      setLoading(false);
    }
  }, []);

  // Функция для входа пользователя
  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    saveToken(data.token);
    setUser(data.user);
  };

  // Функция для регистрации нового пользователя
  const register = async (name: string, email: string, password: string) => {
    const data = await registerUser(name, email, password);
    saveToken(data.token);
    setUser(data.user);
  };

  // Функция выхода: удаляет токен и сбрасывает состояние пользователя
  const logout = () => {
    removeToken();
    setUser(null);
    router.push("/login");
  };

  // Функция обновления профиля
  const updateProfile = async (name: string, avatarFile?: File) => {
    const data = await updateProfileApi(name, avatarFile);
    setUser(data.user);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateProfile, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};
