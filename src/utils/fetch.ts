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
