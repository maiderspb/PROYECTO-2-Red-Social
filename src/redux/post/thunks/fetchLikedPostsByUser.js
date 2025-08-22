import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api";

export const fetchLikedPostsByUser = createAsyncThunk(
  "posts/fetchLikedPostsByUser",
  async (userId, { getState }) => {
    const token = getState().auth?.token;
    if (!token) throw new Error("No hay token de autenticación");

    const res = await fetch(`${API_URL}/users/${userId}/liked-posts`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Error al obtener posts con like: ${errText}`);
    }

    const likedPostsData = await res.json();
    return likedPostsData;
  }
);
