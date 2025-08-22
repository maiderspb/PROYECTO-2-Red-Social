import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPosts = createAsyncThunk("posts/fetchAll", async () => {
  const res = await axios.get("http://localhost:5000/api/posts");
  return res.data;
});