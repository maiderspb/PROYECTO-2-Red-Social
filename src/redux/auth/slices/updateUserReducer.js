import { updateUserAsync } from "../thunks/updateUserThunk";
import { normalizeUser, saveUserToStorage } from "../utils/authUtils";

export const handleUpdateUser = (builder) => {
  builder
    .addCase(updateUserAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateUserAsync.fulfilled, (state, action) => {
      const updatedUserData = action.payload;
      const mergedUser = { ...state.user, ...updatedUserData };
      const normalizedUser = normalizeUser(mergedUser);
      state.user = normalizedUser;
      saveUserToStorage(normalizedUser);
      state.loading = false;
      state.error = null;
    })
    .addCase(updateUserAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
};