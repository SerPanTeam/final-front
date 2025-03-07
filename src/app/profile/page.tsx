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
