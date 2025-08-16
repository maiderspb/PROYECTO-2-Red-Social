import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const createComment = createAsyncThunk(
  "comments/createComment",
  async ({ postId, commentText, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });
      if (!response.ok) throw new Error("Error al crear comentario");
      const data = await response.json();
      return data.comment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateComment = createAsyncThunk(
  "comments/updateComment",
  async ({ commentId, commentText, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: commentText }),
      });
      if (!response.ok) throw new Error("Error al actualizar comentario");
      const data = await response.json();
      return data.comment;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteComment = createAsyncThunk(
  "comments/deleteComment",
  async ({ commentId, token }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Error al eliminar comentario");
      return commentId; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/comments`); 
      if (!response.ok) throw new Error("Error al obtener comentarios");
      const data = await response.json();
      return data.comments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    all: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.all = action.payload;   
      })
     
      .addCase(createComment.fulfilled, (state, action) => {
        state.all.push(action.payload);
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.all.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.all[index] = action.payload;
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.all = state.all.filter(c => c._id !== action.payload);
      });
  },
});

export default commentsSlice.reducer;

