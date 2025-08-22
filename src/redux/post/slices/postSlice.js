import { createSlice } from "@reduxjs/toolkit";
import {fetchPosts,fetchPostById,addPost,addComment,likeComment,unlikePostAsync,deletePost,fetchLikedPostsByUser,updateUserAsync,} from "../thunks";

const initialState = { posts: [],  currentPost: null,likedPosts: [],loading: false,error: null,};

const postSlice = createSlice({name: "posts",initialState,reducers: {},extraReducers: (builder) => {builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.currentPost = action.payload;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { _id } = action.payload;
        const post = state.posts.find((p) => p._id === _id);
        if (post) post.comments = action.payload.comments;
        if (state.currentPost?._id === _id) {
          state.currentPost = action.payload;
        }
      })
  .addCase(likeComment.fulfilled, (state, action) => {
  const { postId, commentId, updatedComment } = action.payload;
  const post = state.posts.find((p) => p._id === postId);
  if (post) {
    const comment = post.comments.find((c) => c._id === commentId);
    if (comment) {
      comment.likes = updatedComment.likes;
    }
  }
})
      .addCase(unlikePostAsync.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post._id === action.payload
            ? { ...post, likes: post.likes - 1 }
            : post
        );
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((p) => p._id !== action.payload);
      })
      .addCase(fetchLikedPostsByUser.fulfilled, (state, action) => {
        state.likedPosts = action.payload;
      })
      .addCase(updateUserAsync.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.posts = state.posts.map((post) =>
          post.user._id === updatedUser._id
            ? { ...post, user: updatedUser }
            : post
        );
      });
  },
});

export default postSlice.reducer;