import { createSlice } from "@reduxjs/toolkit";
import { handleFetchComments, handleCreateComment, handleUpdateComment, handleDeleteComment } from "./reducers";

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    all: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    handleFetchComments(builder);
    handleCreateComment(builder);
    handleUpdateComment(builder);
    handleDeleteComment(builder);
  },
});

export default commentsSlice.reducer;