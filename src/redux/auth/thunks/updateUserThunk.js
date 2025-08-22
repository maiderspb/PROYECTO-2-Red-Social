import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchWithAuth } from "../utils/fetchWrapper";

export const updateUserAsync = createAsyncThunk(
  "auth/updateUser",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      return await fetchWithAuth(`/api/users/${userId}`, {
        method: "PUT",
        body: formData,
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);