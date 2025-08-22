import { configureStore } from '@reduxjs/toolkit'
import auth from '../redux/auth/slices/authSlice.js'
import posts from '../redux/post/slices/postSlice.js'
import user from '../redux/user/userSlice.js';
import comments from '../redux/comment/commentsSlice.js';

export const store = configureStore({
  reducer: {
    auth,
    posts,
       user,
          comments, 
  },
})




