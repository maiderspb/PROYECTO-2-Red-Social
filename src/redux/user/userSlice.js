import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:5000/api/users";

export const fetchUserFollowers = createAsyncThunk(
  "user/fetchFollowers",
  async (userId, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) {
      return rejectWithValue("No hay token, usuario no autenticado");
    }
    try {
      console.log("Token usado en fetchUserFollowers:", token);
      const res = await fetch(`${API_URL}/${userId}/followers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener seguidores");
      const data = await res.json();
      return data; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const followUserAsync = createAsyncThunk(
  "user/followUser",
  async (userIdToFollow, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue("No hay token, usuario no autenticado");

    try {
      const res = await fetch(`${API_URL}/${userIdToFollow}/follow`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(errorData.message || "Error al seguir usuario");
      }

      const data = await res.json(); 

      return data.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const unfollowUserAsync = createAsyncThunk(
  "user/unfollowUser",
  async (userIdToUnfollow, { getState, rejectWithValue }) => {
 const token = getState().auth.token;
    if (!token) {
      return rejectWithValue("No hay token, usuario no autenticado");
    }
    try {
      const res = await fetch(`${API_URL}/${userIdToUnfollow}/unfollow`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al dejar de seguir usuario");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchUsersAsync = createAsyncThunk(
  "user/search",
  async (term, { rejectWithValue }) => {
    try {
      const res = await fetch(`${API_URL}/search?username=${term}`);
      if (!res.ok) throw new Error("Error buscando usuarios");
      const data = await res.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    followers: [],
    following: [],
    searchResults: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
   
      .addCase(fetchUserFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload.followers;
        state.following = action.payload.following;
      })
      .addCase(fetchUserFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al obtener seguidores";
      })

      
  .addCase(followUserAsync.fulfilled, (state, action) => {
  state.loading = false;
  const followedUser = action.payload;

  
  if (!state.following.some(u => u._id === followedUser._id)) {
    state.following.push(followedUser);

    if (state.user) {
      const updatedUser = {
        ...state.user,
        following: [...(state.user.following || []), followedUser],
      };
      state.user = updatedUser;
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }
})

      .addCase(unfollowUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        const userUnfollowed = action.meta.arg;
        state.following = state.following.filter(
          (u) => u._id !== userUnfollowed
        );
      })
      .addCase(unfollowUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error al dejar de seguir usuario";
      })

      .addCase(searchUsersAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsersAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(searchUsersAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error buscando usuarios";
        state.searchResults = [];
      });
  },
});

export default userSlice.reducer;
