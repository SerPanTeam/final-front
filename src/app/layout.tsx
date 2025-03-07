"use client";

import "../app/globals.css";
import { AuthProvider } from "../context/AuthContext";
import { PostProvider } from "../context/PostContext";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {/* Оборачиваем приложение в провайдеры авторизации и постов */}
        <AuthProvider>
          <PostProvider>
            {/* Общий Header, который будет отображаться на каждой странице */}
            <Header />
            <div className="flex">
              {/* Боковое меню навигации */}
              <Sidebar />
              {/* Основное содержимое страницы */}
              <main className="flex-1 p-4">{children}</main>
            </div>
          </PostProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
