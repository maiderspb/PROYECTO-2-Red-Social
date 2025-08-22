import { fetchComments } from "../thunks";

export const handleFetchComments = (builder) => {
  builder.addCase(fetchComments.fulfilled, (state, action) => {
    state.all = action.payload;
  });
};