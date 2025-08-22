import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateUserAsync = createAsyncThunk(
  "auth/updateUser",
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return thunkAPI.rejectWithValue("Token no encontrado");

      const response = await axios.put(
        "http://localhost:5000/api/users/update",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Error actualizando usuario");
    }
  }
);