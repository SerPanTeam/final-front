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
  return apiRequestJson("/users/login", "POST", { email, password });
}

/**
 * Функция для регистрации нового пользователя.
 * Отправляет имя, email и пароль на сервер и возвращает данные (токен и информацию о пользователе).
 */
// export async function registerUser(username: string, email: string, password: string) {
//   return apiRequestJson("/users", "POST", { username, email, password });
// }

export async function registerUser(name: string, email: string, password: string) {
  return apiRequestJson("/users", "POST", {
    user: {
      username: name, // ваш фронт "name" -> бэкенд "username"
      email,
      password,
      img: "", // если пока не используете
      bio: "", // если пока не используете
    },
  });
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
