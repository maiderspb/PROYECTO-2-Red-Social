import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService.js";
import * as jwt_decode from "jwt-decode";

const getSafeJSON = (key) => {
  const item = localStorage.getItem(key);
  if (!item || item === "undefined") return null;
  try {
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage`, e);
    return null;
  }
};

const userStorage = getSafeJSON("user");

const initialState = {
  user: userStorage || null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const response = await authService.login(credentials);
      const { user, token } = response;

      if (!user || !token) throw new Error("No user o token recibido");

      return { user, token };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Error de inicio de sesión"
      );
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (user, thunkAPI) => {
    try {
      return await authService.register(user);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error de registro"
      );
    }
  }
);

const API_BASE_URL = "http://localhost:5000";

export const updateUserAsync = createAsyncThunk(
  "auth/updateUser",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // NO poner Content-Type aquí con FormData
        },
        body: formData,
      });

      // Intentamos leer JSON, pero si falla, leemos texto
      let data;
      try {
        data = await res.clone().json(); // .clone() para no perder el stream original
      } catch {
        data = await res.clone().text();
      }

      if (!res.ok) return rejectWithValue(data);
      console.log("Respuesta actualización usuario:", data);
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
export const followUserAsync = createAsyncThunk(
  "user/followUser",
  async (userIdToFollow, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/users/${userIdToFollow}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // si usas token
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Respuesta error backend followUserAsync:", errorData);
        return rejectWithValue(errorData.message || "Error al seguir usuario");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error catch followUserAsync:", error);
      return rejectWithValue(error.message);
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("✅ Login completado con payload:", action.payload);
        const { user, token } = action.payload;

        if (!user || !token) {
          state.user = null;
          state.token = null;
          state.error = "Login sin datos válidos";
          return;
        }

        const normalizedUser = {
          id: user.id || user._id,
          _id: user._id || user.id,
          username: user.username || user.name || "Sin nombre",
          email: user.email || "Sin email",
        };

        console.log(
          `Usuario: ${normalizedUser.username}, Email: ${normalizedUser.email}, Token: ${token}`
        );

        state.user = normalizedUser;
        state.token = token;
        state.loading = false;
        state.error = null;
        localStorage.setItem("user", JSON.stringify(normalizedUser));
        localStorage.setItem("token", token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
  const updatedUserData = action.payload;

  const mergedUser = {
    ...state.user,
    ...updatedUserData,
  };

  const normalizedUser = {
    id: mergedUser.id || mergedUser._id,
    _id: mergedUser._id || mergedUser.id,
    username: mergedUser.username || mergedUser.name || "Sin nombre",
    email: mergedUser.email || "Sin email",
    image: mergedUser.image || "",
  };

  state.user = normalizedUser;
  localStorage.setItem("user", JSON.stringify(normalizedUser));
  state.loading = false;
  state.error = null;
})
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

