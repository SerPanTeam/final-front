# Структура проекта

```plaintext
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── app
│   │   ├── chat
│   │   │   └── page.tsx
│   │   ├── create-post
│   │   │   └── page.tsx
│   │   ├── login
│   │   │   └── page.tsx
│   │   ├── profile
│   │   │   └── page.tsx
│   │   ├── register
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components
│   │   ├── ChatWindow.tsx
│   │   ├── Comment.tsx
│   │   ├── Header.tsx
│   │   ├── Post.tsx
│   │   └── Sidebar.tsx
│   ├── config
│   │   └── api.ts
│   ├── context
│   │   ├── AuthContext.tsx
│   │   └── PostContext.tsx
│   └── utils
│       ├── auth.ts
│       └── fetch.ts
├── .gitignore
├── codewr.js
├── combined-files.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json

```

# Файлы .ts, .tsx, .css

## next-env.d.ts

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/app/api-reference/config/typescript for more information.

```

## next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;

```

## src\app\chat\page.tsx

```typescript
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
  }, [loading, isAuthenticated, router]);

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

```

## src\app\create-post\page.tsx

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { usePost } from "../../context/PostContext";

const CreatePostPage = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const { createPost } = usePost();

  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  // Если пользователь не авторизован, после завершения загрузки перенаправляем на страницу входа
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated]);

  if (!isAuthenticated) return null;

  // Обработчик отправки формы создания поста
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await createPost(content);
      // После успешного создания поста переходим на главную страницу (лента постов)
      router.push("/");
    } catch (err: any) {
      setError("Ошибка при создании поста");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Создать пост</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <textarea
            className="border w-full p-2"
            rows={4}
            placeholder="Напишите что-нибудь..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Опубликовать
        </button>
      </form>
    </div>
  );
};

export default CreatePostPage;

```

## src\app\globals.css

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

```

## src\app\layout.tsx

```typescript
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

```

## src\app\login\page.tsx

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Если пользователь уже авторизован, перенаправляем на главную страницу
  if (isAuthenticated) {
    router.replace("/");
    return null;
  }

  // Обработчик отправки формы входа
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Ошибка входа");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Вход</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            className="border w-full p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Пароль:</label>
          <input
            type="password"
            className="border w-full p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-600 mb-3">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Войти
        </button>
      </form>
      <p className="mt-3 text-center">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;

```

## src\app\page.tsx

```typescript
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}

```

## src\app\profile\page.tsx

```typescript
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

const ProfilePage = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading, updateProfile } = useAuth();

  // Локальное состояние для редактируемых полей профиля
  const [name, setName] = useState(user?.name || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Если пользователь не авторизован (после завершения загрузки), перенаправляем на страницу входа
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated]);

  if (!isAuthenticated) return null;

  // Обработчик изменения файла для аватара
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  // Обработчик отправки формы обновления профиля
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await updateProfile(name, avatarFile || undefined);
      setMessage("Профиль обновлён успешно");
      setAvatarFile(null);
    } catch (err: any) {
      setError("Ошибка обновления профиля");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4">
      <h2 className="text-2xl font-bold mb-4">Профиль</h2>
      {/* Отображаем аватар пользователя или заглушку */}
      <div className="mb-4">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-300 flex items-center justify-center rounded-full">
            Нет аватара
          </div>
        )}
      </div>
      {/* Форма редактирования профиля */}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Имя:</label>
          <input
            type="text"
            className="border w-full p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1 font-medium">Аватар:</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        {error && <p className="text-red-600 mb-2 text-sm">{error}</p>}
        {message && <p className="text-green-600 mb-2 text-sm">{message}</p>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Сохранить
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;

```

## src\app\register\page.tsx

```typescript
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

const RegisterPage = () => {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Если пользователь уже авторизован, перенаправляем на главную страницу
  if (isAuthenticated) {
    router.replace("/");
    return null;
  }

  // Обработчик отправки формы регистрации
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await register(name, email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Ошибка регистрации");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Регистрация</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="block mb-1">Имя:</label>
          <input
            type="text"
            className="border w-full p-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Email:</label>
          <input
            type="email"
            className="border w-full p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Пароль:</label>
          <input
            type="password"
            className="border w-full p-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-600 mb-3">{error}</p>}
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Зарегистрироваться
        </button>
      </form>
      <p className="mt-3 text-center">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Войти
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;

```

## src\components\ChatWindow.tsx

```typescript
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

```

## src\components\Comment.tsx

```typescript
"use client";

import { CommentType } from "../context/PostContext";

interface CommentProps {
  comment: CommentType;
}

// Компонент Comment отображает один комментарий,
// показывая имя автора, текст комментария и дату создания.
const Comment = ({ comment }: CommentProps) => {
  return (
    <div className="mb-1">
      <span className="text-sm font-semibold">{comment.authorName}:</span>{" "}
      <span className="text-sm">{comment.text}</span>
      <div className="text-xs text-gray-500">
        {new Date(comment.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default Comment;

```

## src\components\Header.tsx

```typescript
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

```

## src\components\Post.tsx

```typescript
"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { usePost, PostType } from "../context/PostContext";
import Comment from "./Comment";

interface PostProps {
  post: PostType;
}

// Компонент Post отображает один пост, включая информацию об авторе,
// дату создания, контент, лайки и список комментариев. 
// Также позволяет пользователю ставить лайк, добавлять комментарии и удалять пост (если он автор поста).
const Post = ({ post }: PostProps) => {
  const { user, isAuthenticated } = useAuth();
  const { likePost, deletePost, addComment } = usePost();
  const [commentText, setCommentText] = useState("");

  // Проверка: если текущий пользователь является автором поста, он сможет удалить его.
  const canDelete = user && post.authorId === user.id;

  // Обработчик для лайка поста.
  const handleLike = () => {
    if (!isAuthenticated) return;
    likePost(post.id);
  };

  // Обработчик для добавления нового комментария.
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await addComment(post.id, commentText);
    setCommentText(""); // очищаем поле после отправки
  };

  // Обработчик для удаления поста.
  const handleDelete = async () => {
    if (confirm("Удалить этот пост?")) {
      await deletePost(post.id);
    }
  };

  return (
    <div className="bg-white shadow rounded p-4 mb-4">
      <div className="mb-2">
        <span className="font-semibold">{post.authorName}</span>{" "}
        <span className="text-gray-500 text-sm">
          {new Date(post.createdAt).toLocaleString()}
        </span>
      </div>
      <p className="mb-2">{post.content}</p>
      <div className="flex items-center space-x-4 mb-2">
        <button onClick={handleLike} className="text-blue-600 hover:underline">
          ❤ {post.likes}
        </button>
        {canDelete && (
          <button onClick={handleDelete} className="text-red-600 hover:underline">
            Удалить
          </button>
        )}
      </div>
      {/* Секция комментариев */}
      <div className="ml-4">
        {post.comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
        {isAuthenticated && (
          <form onSubmit={handleAddComment} className="mt-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="border p-1 mr-2 text-sm"
              placeholder="Ваш комментарий..."
            />
            <button type="submit" className="text-sm bg-blue-500 text-white px-2 py-1 rounded">
              Отправить
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Post;

```

## src\components\Sidebar.tsx

```typescript
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

```

## src\config\api.ts

```typescript
// src/config/api.ts

// Базовый URL вашего backend-сервера (NestJS API)
// Измените адрес и порт в зависимости от настроек вашего сервера
// export const API_BASE_URL = "http://localhost:3001/api";
export const API_BASE_URL = "https://api.panchenko.work";

// URL для подключения к Socket.io серверу (если он на том же сервере, что и API)
export const SOCKET_URL = "http://localhost:3001";

```

## src\context\AuthContext.tsx

```typescript
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

```

## src\context\PostContext.tsx

```typescript
"use client";

import { createContext, useState, useContext, ReactNode } from "react";
import { apiRequestJson } from "../utils/fetch";
import { useAuth } from "./AuthContext";

// Тип комментария
export interface CommentType {
  id: number;
  postId: number;
  authorName: string;
  text: string;
  createdAt: string;
}

// Тип поста
export interface PostType {
  id: number;
  authorId: number;
  authorName: string;
  content: string;
  likes: number;
  comments: CommentType[];
  createdAt: string;
}

// Интерфейс контекста для постов
interface PostContextType {
  posts: PostType[];
  fetchPosts: () => Promise<void>;
  createPost: (content: string) => Promise<void>;
  likePost: (postId: number) => Promise<void>;
  deletePost: (postId: number) => Promise<void>;
  addComment: (postId: number, text: string) => Promise<void>;
}

// Создаем контекст постов (начальное значение undefined)
const PostContext = createContext<PostContextType | undefined>(undefined);

// Кастомный хук для удобного доступа к контексту постов
export const usePost = () => {
  const context = useContext(PostContext);
  if (context === undefined) {
    throw new Error("usePost должен использоваться внутри PostProvider");
  }
  return context;
};

// Провайдер постов, управляющий состоянием списка постов и операциями над ними
export const PostProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<PostType[]>([]);

  // Функция для получения всех постов с сервера
  const fetchPosts = async () => {
    const data = await apiRequestJson("/posts", "GET");
    setPosts(data.posts || []);
  };

  // Функция для создания нового поста
  const createPost = async (content: string) => {
    const data = await apiRequestJson("/posts", "POST", { content });
    const newPost: PostType = data.post;
    if (newPost) {
      // Добавляем новый пост в начало списка постов
      setPosts([newPost, ...posts]);
    }
  };

  // Функция для отправки лайка на сервер и обновления состояния
  const likePost = async (postId: number) => {
    try {
      await apiRequestJson(`/posts/${postId}/like`, "POST");
      setPosts(posts.map((p) =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ));
    } catch (error) {
      console.error("Ошибка при лайке поста:", error);
    }
  };

  // Функция для удаления поста
  const deletePost = async (postId: number) => {
    try {
      await apiRequestJson(`/posts/${postId}`, "DELETE");
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (error) {
      console.error("Ошибка при удалении поста:", error);
    }
  };

  // Функция для добавления комментария к посту
  const addComment = async (postId: number, text: string) => {
    try {
      const data = await apiRequestJson(`/posts/${postId}/comments`, "POST", { text });
      // Предполагается, что сервер возвращает новый комментарий
      const newComment: CommentType = data.comment;
      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, comments: [...p.comments, newComment] } : p
        )
      );
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
    }
  };

  return (
    <PostContext.Provider
      value={{ posts, fetchPosts, createPost, likePost, deletePost, addComment }}
    >
      {children}
    </PostContext.Provider>
  );
};

```

## src\utils\auth.ts

```typescript
// src/utils/auth.ts
import { apiRequestJson, apiRequest } from "./fetch";

/** Функция для сохранения JWT токена в localStorage */
export function saveToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

/** Функция для удаления JWT токена из localStorage */
export function removeToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

/**
 * Функция для входа пользователя.
 * Отправляет email и пароль на сервер и возвращает данные (токен и информацию о пользователе).
 */
export async function loginUser(email: string, password: string) {
  return apiRequestJson("/auth/login", "POST", { email, password });
}

/**
 * Функция для регистрации нового пользователя.
 * Отправляет имя, email и пароль на сервер и возвращает данные (токен и информацию о пользователе).
 */
export async function registerUser(name: string, email: string, password: string) {
  return apiRequestJson("/users", "POST", { name, email, password });
}

/**
 * Функция для получения профиля текущего пользователя.
 * Использует сохранённый токен для запроса данных профиля.
 */
export async function fetchProfile() {
  return apiRequestJson("/users/profile", "GET");
}

/**
 * Функция для обновления профиля пользователя.
 * Если передан avatarFile, используется FormData для отправки файла.
 */
export async function updateProfileApi(name: string, avatarFile?: File) {
  if (avatarFile) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("avatar", avatarFile);
    const response = await apiRequest("/users/profile", "PUT", formData);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "Ошибка обновления профиля");
    }
    return result;
  } else {
    return apiRequestJson("/users/profile", "PUT", { name });
  }
}

```

## src\utils\fetch.ts

```typescript
// src/utils/fetch.ts
import { API_BASE_URL } from "../config/api";

/**
 * Выполняет HTTP-запрос с использованием fetch.
 * Автоматически добавляет заголовок Authorization (если JWT токен сохранён в localStorage)
 * и обрабатывает тело запроса для FormData или JSON.
 *
 * @param url Путь запроса (например, "/auth/login")
 * @param method HTTP-метод (GET, POST, PUT, DELETE и т.д.)
 * @param data Данные для отправки (либо объект, либо FormData)
 * @returns Объект Response от fetch
 */
export async function apiRequest(url: string, method: string = "GET", data?: any): Promise<Response> {
  const headers: Record<string, string> = {};

  // Если есть токен, добавляем его в заголовок Authorization
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  let body;
  if (data) {
    if (data instanceof FormData) {
      // Для FormData заголовок Content-Type не нужен
      body = data;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(data);
    }
  }

  // Выполняем запрос по базовому URL, указанному в конфигурационном файле
  const response = await fetch(`${API_BASE_URL}${url}`, {
    method,
    headers,
    body,
  });

  return response;
}

/**
 * Выполняет HTTP-запрос и сразу возвращает распарсенный JSON.
 * Если запрос завершился ошибкой (response.ok === false), выбрасывает исключение с сообщением.
 *
 * @param url Путь запроса
 * @param method HTTP-метод
 * @param data Данные для отправки
 * @returns Распарсенный JSON-объект
 */
export async function apiRequestJson(url: string, method: string = "GET", data?: any): Promise<any> {
  const response = await apiRequest(url, method, data);
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = result.message || `Ошибка ${response.status}`;
    throw new Error(message);
  }
  return result;
}

```

# Дополнительные файлы

⚠️ Файл **index.html** не найден и пропущен.

