import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ commentId, commentText, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });
      if (!response.ok) throw new Error("Error al actualizar comentario");
      const data = await response.json();
      return data.comment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);