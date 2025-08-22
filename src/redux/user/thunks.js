import { createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api/users";

export const fetchUserFollowers = createAsyncThunk(
  "user/fetchFollowers",
  async (userId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("No hay token, usuario no autenticado");
    try {
      const res = await fetch(`${API_URL}/${userId}/followers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener seguidores");
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const followUserAsync = createAsyncThunk(
  "user/followUser",
  async (userIdToFollow, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("No hay token, usuario no autenticado");
    try {
      const res = await fetch(`${API_URL}/${userIdToFollow}/follow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const err = await res.json();
        return rejectWithValue(err.message || "Error al seguir usuario");
      }
      return (await res.json()).user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const unfollowUserAsync = createAsyncThunk(
  "user/unfollowUser",
  async (userIdToUnfollow, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("No hay token, usuario no autenticado");
    try {
      const res = await fetch(`${API_URL}/${userIdToUnfollow}/unfollow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al dejar de seguir usuario");
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchUsersAsync = createAsyncThunk(
  "user/search",
  async (term, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/search?username=${term}`);
      if (!res.ok) throw new Error("Error buscando usuarios");
      return await res.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);