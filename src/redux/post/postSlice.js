import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPosts = createAsyncThunk('posts/fetchAll', async () => {
  const res = await axios.get('http://localhost:5000/api/posts');
  return res.data;
});

export const fetchPostById = createAsyncThunk(
  'posts/fetchById',
  async (postId) => {
    const res = await fetch(`/api/posts/${postId}`);
    const data = await res.json();
    return data;
  }
);
export const likeComment = createAsyncThunk(
  'posts/likeComment',
  async ({ postId, commentId }, thunkAPI) => {
   const token = localStorage.getItem('token');
const response = await axios.post(
  `http://localhost:5000/api/posts/${postId}/comments/${commentId}/like`,
  {},
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
    return { postId, commentId, updatedComment: response.data };
  }
);

export const addPost = createAsyncThunk('posts/addPost', async (postData, thunkAPI) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post('http://localhost:5000/api/posts', postData, {
      headers: {
         Authorization: `Bearer ${token}`, 
      },
    });
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al crear post');
  }
});

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ postId, text }, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return thunkAPI.rejectWithValue('No token found');
      }

      const res = await axios.post(
        `http://localhost:5000/api/posts/${postId}/comments`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Error al agregar comentario'
      );
    }
  }
);

const API_URL = "http://localhost:5000/api";

export const fetchLikedPostsByUser = createAsyncThunk(
  "posts/fetchLikedPostsByUser",
  async (userId, { getState }) => {
    const token = getState().auth?.token;
    if (!token) throw new Error("No hay token de autenticación");

    const res = await fetch(`${API_URL}/users/${userId}/liked-posts`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Error al obtener posts con like: ${errText}`);
    }

    const likedPostsData = await res.json();

 return likedPostsData; 
  }
);

export const unlikePostAsync = createAsyncThunk(
  'posts/unlikePost',
  async (postId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/posts/${postId}/unlike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return postId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al quitar like');
    }
  }
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (postId, thunkAPI) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return postId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al eliminar el post');
    }
  }
);

export const updateUserAsync = createAsyncThunk(
  "auth/updateUser",
  async (formData, thunkAPI) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return thunkAPI.rejectWithValue("Token no encontrado");
      }

      const response = await axios.put(
        "http://localhost:5000/api/users/update",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Error actualizando usuario"
      );
    }
  }
);

const postSlice = createSlice({
  name: 'posts',
  initialState: {
  all: [],
    likedPosts: [],
  currentPost: null,
  loading: false,
  error: null,
}
,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.all = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deletePost.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(deletePost.fulfilled, (state, action) => {
  state.loading = false;
  state.all = state.all.filter(post => post._id !== action.payload);
})
.addCase(deletePost.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
.addCase(fetchPostById.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(fetchPostById.fulfilled, (state, action) => {
  state.loading = false;
  state.currentPost = action.payload;
})

.addCase(likeComment.fulfilled, (state, action) => {
  const { commentId, updatedComment } = action.payload;
  const index = state.currentPost.comments.findIndex(c => c._id === commentId);
  if (index === -1) return;

  const prev = state.currentPost.comments[index];

  const sanitized = Object.fromEntries(
    Object.entries(updatedComment).filter(([_, v]) => v !== null && v !== undefined)
  );

  if (sanitized.user && typeof sanitized.user !== 'object') {
    delete sanitized.user;
  }

  const merged = { ...prev, ...sanitized };

  if (!merged.user || (typeof merged.user === 'object' && !merged.user.username)) {
    merged.user = prev.user;
  }

  state.currentPost.comments[index] = merged;
})
.addCase(fetchPostById.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
.addCase(fetchLikedPostsByUser.fulfilled, (state, action) => {
  state.likedPosts = action.payload; 
})

.addCase(unlikePostAsync.fulfilled, (state, action) => {
  state.likedPosts = state.likedPosts.filter(post => post._id !== action.payload);
})
      

.addCase(addComment.fulfilled, (state, action) => {
  state.currentPost = action.payload; })

      .addCase(addPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.loading = false;
        state.all.push(action.payload);
      })
      .addCase(addPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default postSlice.reducer;
