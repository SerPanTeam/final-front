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
