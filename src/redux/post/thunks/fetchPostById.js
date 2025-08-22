import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPostById = createAsyncThunk(
  "posts/fetchById",
  async (postId) => {
    const res = await fetch(`http://localhost:5000/api/posts/${postId}`);
    const data = await res.json();
    return data;
  }
);