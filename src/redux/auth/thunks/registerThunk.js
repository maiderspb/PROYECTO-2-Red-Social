import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../authService";

export const register = createAsyncThunk("auth/register", async (user, thunkAPI) => {
  try {
    return await authService.register(user);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Error de registro");
  }
});