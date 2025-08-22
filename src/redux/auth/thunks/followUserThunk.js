import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "../utils/fetchWrapper";

export const followUserAsync = createAsyncThunk(
  "user/followUser",
  async (userIdToFollow, { rejectWithValue }) => {
    try {
      return await fetchWithAuth(`/api/users/${userIdToFollow}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);