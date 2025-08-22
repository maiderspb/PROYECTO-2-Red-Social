import { login } from "../thunks/loginThunk";
import { normalizeUser, saveUserToStorage } from "../utils/authUtils";

export const handleLogin = (builder) => {
  builder
    .addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(login.fulfilled, (state, action) => {
      const { user, token } = action.payload;
      if (!user || !token) {
        state.user = null;
        state.token = null;
        state.error = "Login sin datos válidos";
        return;
      }
      const normalizedUser = normalizeUser(user);
      state.user = normalizedUser;
      state.token = token;
      state.loading = false;
      state.error = null;
      saveUserToStorage(normalizedUser, token);
    })
    .addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
};