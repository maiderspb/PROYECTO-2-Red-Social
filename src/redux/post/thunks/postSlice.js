import { createSlice } from "@reduxjs/toolkit";
import { fetchPosts, addPost } from "./thunks";

const initialState = {
  posts: [],
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPosts.fulfilled, (state, action) => { state.loading = false; state.posts = action.payload; })
      .addCase(fetchPosts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addPost.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addPost.fulfilled, (state, action) => { state.loading = false; state.posts.push(action.payload); })
      .addCase(addPost.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export default postSlice.reducer;