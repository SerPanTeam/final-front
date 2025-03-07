"use client";

import { useState, useEffect } from "react";
import { SOCKET_URL } from "../config/api";
import { io, Socket } from "socket.io-client";

// Интерфейс для сообщения чата
interface ChatMessage {
  user: string;
  text: string;
}

const ChatWindow = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Устанавливаем подключение к Socket.io серверу по URL из конфигурационного файла
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    // Подписываемся на событие получения нового сообщения от сервера
    newSocket.on("chatMessage", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    // При размонтировании компонента отключаем соединение, чтобы избежать утечек памяти
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Обработчик отправки сообщения
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;
    // Отправляем событие "chatMessage" на сервер
    socket.emit("chatMessage", {
      user: "Пользователь", // Здесь можно подставить реальное имя пользователя из контекста
      text: message,
    });
    setMessage(""); // Очищаем поле ввода после отправки
  };

  return (
    <div className="border rounded p-4 flex flex-col h-full">
      {/* Область сообщений с вертикальной прокруткой */}
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, index) => (
          <p key={index}>
            <span className="font-semibold">{msg.user}:</span> {msg.text}
          </p>
        ))}
      </div>
      {/* Форма ввода нового сообщения */}
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          className="border flex-1 p-2 text-sm"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Введите сообщение..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 ml-2 rounded">
          Отправить
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
