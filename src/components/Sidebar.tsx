"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";

// Компонент Sidebar отображает боковую панель навигации.
// Если пользователь авторизован, показываются ссылки на основные разделы приложения,
// такие как Главная, Создать пост, Чат и Профиль.
// Если нет – выводятся ссылки для входа и регистрации.
const Sidebar = () => {
  const { isAuthenticated } = useAuth();

  return (
    <aside className="bg-gray-100 p-4 w-60">
      {isAuthenticated ? (
        <nav className="flex flex-col space-y-2">
          <Link href="/" className="text-blue-600 hover:underline">
            Главная (Лента)
          </Link>
          <Link href="/create-post" className="text-blue-600 hover:underline">
            Создать пост
          </Link>
          <Link href="/chat" className="text-blue-600 hover:underline">
            Чат
          </Link>
          <Link href="/profile" className="text-blue-600 hover:underline">
            Профиль
          </Link>
        </nav>
      ) : (
        <nav className="flex flex-col space-y-2">
          <Link href="/login" className="text-blue-600 hover:underline">
            Вход
          </Link>
          <Link href="/register" className="text-blue-600 hover:underline">
            Регистрация
          </Link>
        </nav>
      )}
    </aside>
  );
};

export default Sidebar;
