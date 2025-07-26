import { configureStore } from '@reduxjs/toolkit'
import auth from '../redux/auth/authSlice.js'
import posts from '../redux/post/postSlice.js'

export const store = configureStore({
  reducer: {
    auth,
    posts,
  },
})


