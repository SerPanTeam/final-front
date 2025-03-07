"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import ChatWindow from "../../components/ChatWindow";

const ChatPage = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  // Если пользователь не авторизован, после завершения загрузки перенаправляем его на страницу входа
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <div className="h-full mt-4">
      <h2 className="text-2xl font-bold mb-4">Чат</h2>
      {/* Компонент ChatWindow реализует чат в реальном времени через Socket.io */}
      <ChatWindow />
    </div>
  );
};

export default ChatPage;
