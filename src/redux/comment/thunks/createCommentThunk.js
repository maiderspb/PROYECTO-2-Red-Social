import { createAsyncThunk } from "@reduxjs/toolkit";

export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ postId, commentText, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });
      if (!response.ok) throw new Error("Error al crear comentario");
      const data = await response.json();
      return data.comment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);