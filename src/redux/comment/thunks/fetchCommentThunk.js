import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/comments`);
      if (!response.ok) throw new Error("Error al obtener comentarios");
      const data = await response.json();
      return data.comments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);  