import { createAsyncThunk } from "@reduxjs/toolkit";

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async ({ commentId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al eliminar comentario");
      return commentId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
