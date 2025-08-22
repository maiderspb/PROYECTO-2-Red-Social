import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserFollowers,
  followUserAsync,
  unfollowUserAsync,
  searchUsersAsync,
} from "./thunks";

const initialState = {
  user: null,
  followers: [],
  following: [],
  searchResults: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserFollowers.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(fetchUserFollowers.fulfilled, (state, action) => {
        state.loading = false;
        state.followers = action.payload.followers;
        state.following = action.payload.following;
      })
      .addCase(fetchUserFollowers.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      .addCase(followUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        const u = action.payload;
        if (!state.following.some(f => f._id === u._id)) state.following.push(u);
      })
      .addCase(unfollowUserAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.following = state.following.filter(f => f._id !== action.meta.arg);
      })
      .addCase(unfollowUserAsync.rejected, (state, action) => {
        state.loading = false; state.error = action.payload;
      })
      .addCase(searchUsersAsync.pending, (state) => {
        state.loading = true; state.error = null;
      })
      .addCase(searchUsersAsync.fulfilled, (state, action) => {
        state.loading = false; state.searchResults = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(searchUsersAsync.rejected, (state, action) => {
        state.loading = false; state.error = action.payload; state.searchResults = [];
      });
  },
});

export default userSlice.reducer;