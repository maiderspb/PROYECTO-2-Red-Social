import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addPost = createAsyncThunk("posts/addPost", async (postData, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post("http://localhost:5000/api/posts", postData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Error al crear post");
  }
});