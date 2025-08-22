import { updateComment } from "../thunks";

export const handleUpdateComment = (builder) => {
  builder.addCase(updateComment.fulfilled, (state, action) => {
    const index = state.all.findIndex(c => c._id === action.payload._id);
    if (index !== -1) {
      state.all[index] = action.payload;
    }
  });
};