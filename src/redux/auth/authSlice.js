import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authService.js';
import * as jwt_decode from 'jwt-decode';

const getSafeJSON = (key) => {
  const item = localStorage.getItem(key);
  if (!item || item === 'undefined') return null;
  try {
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error parsing ${key} from localStorage`, e);
    return null;
  }
};

const userStorage = getSafeJSON('user')

const initialState = {
  user: userStorage || null,
token: localStorage.getItem('token'),
  loading: false,
  error: null,
  
};

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
  try {
    const response = await authService.login(credentials);
    const { user, token } = response;

    if (!user || !token) throw new Error('No user o token recibido');

    return { user, token };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message || 'Error de inicio de sesión');
  }
});

export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
  try {
    return await authService.register(user);
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error de registro');
  }
});

export const updateUserAsync = createAsyncThunk(
  'auth/updateUserAsync',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.updateUser(userData);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error actualizando usuario');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
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
          state.error = 'Login sin datos válidos';
          return;
        }

        const normalizedUser = {
          id: user.id || user._id,
          _id: user._id || user.id,
          username: user.username || user.name || 'Sin nombre',
          email: user.email || 'Sin email',
        };

        console.log(`Usuario: ${normalizedUser.username}, Email: ${normalizedUser.email}, Token: ${token}`);

        state.user = normalizedUser;
        state.token = token;
        state.loading = false;
        state.error = null;
        localStorage.setItem('user', JSON.stringify(normalizedUser));
     localStorage.setItem('token', token);
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
  state.loading = false;

  const user = action.payload;

  const normalizedUser = {
    id: user.id || user._id,
    _id: user._id || user.id,
    username: user.username || user.name || 'Sin nombre',
    email: user.email || 'Sin email',
    profilePicture: user.profilePicture || user.image || '',
  };

  state.user = normalizedUser;
  localStorage.setItem('user', JSON.stringify(normalizedUser));
})
      .addCase(updateUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
