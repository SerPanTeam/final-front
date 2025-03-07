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
