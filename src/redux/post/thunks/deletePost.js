import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const deletePost = createAsyncThunk("posts/deletePost", async (postId, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return postId;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Error al eliminar el post");
  }
});