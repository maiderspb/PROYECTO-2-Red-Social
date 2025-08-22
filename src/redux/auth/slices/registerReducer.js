import { register } from "../thunks/registerThunk";

export const handleRegister = (builder) => {
  builder
    .addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
};