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
