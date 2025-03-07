"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

// Компонент Header отображает шапку сайта с названием и навигацией,
// а также кнопку для выхода (если пользователь авторизован) или ссылки для входа/регистрации.
const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      {/* Название или логотип сайта */}
      <h1 className="text-xl font-bold">
        <Link href="/">MyApp</Link>
      </h1>
      {/* Навигация/авторизация */}
      <div>
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span>Привет, {user?.name}</span>
            <button
              onClick={logout}
              className="bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
            >
              Выйти
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link href="/login" className="hover:underline">
              Вход
            </Link>
            <Link href="/register" className="hover:underline">
              Регистрация
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
