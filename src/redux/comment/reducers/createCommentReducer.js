import { createComment } from "../thunks";

export const handleCreateComment = (builder) => {
  builder.addCase(createComment.fulfilled, (state, action) => {
    state.all.push(action.payload);
  });
};