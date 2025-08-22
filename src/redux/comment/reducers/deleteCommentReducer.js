import { deleteComment } from "../thunks";

export const handleDeleteComment = (builder) => {
  builder.addCase(deleteComment.fulfilled, (state, action) => {
    state.all = state.all.filter(c => c._id !== action.payload);
  });
};
