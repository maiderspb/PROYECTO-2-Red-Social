import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const unlikePostAsync = createAsyncThunk(
  "posts/unlikePost",
  async (postId, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/posts/${postId}/unlike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return postId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Error al quitar like");
    }
  }
);