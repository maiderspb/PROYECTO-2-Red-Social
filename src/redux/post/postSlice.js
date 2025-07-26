import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPosts = createAsyncThunk('posts/fetchAll', async () => {
  const res = await axios.get('http://localhost:5000/api/posts');
  return res.data;
});

export const fetchPostById = createAsyncThunk('posts/fetchById', async (id, thunkAPI) => {
  try {
    const res = await axios.get(`http://localhost:5000/api/posts/${id}`);
    return res.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Error al obtener el post');
  }
});

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

const postSlice = createSlice({
  name: 'posts',
  initialState: {
  all: [],
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
.addCase(fetchPostById.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
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

