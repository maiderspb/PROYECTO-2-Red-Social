import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../authService";

export const login = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
  try {
    const response = await authService.login(credentials);
    const { user, token } = response;
    if (!user || !token) throw new Error("No user o token recibido");
    return { user, token };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || error.message || "Error de inicio de sesión"
    );
  }
});