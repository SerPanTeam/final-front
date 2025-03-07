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
