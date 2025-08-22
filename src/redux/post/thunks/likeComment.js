import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const likeComment = createAsyncThunk(
  "posts/likeComment",
  async ({ postId, commentId }, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No hay token de autenticación");

      const response = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comments/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedComment = response.data;

      if (!updatedComment || typeof updatedComment.likes === "undefined") {
        throw new Error("Respuesta del servidor inválida");
      }

      return { postId, commentId, updatedComment };
    } catch (error) {
      console.error("Error en likeComment thunk:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message || "Error desconocido"
      );
    }
  }
);