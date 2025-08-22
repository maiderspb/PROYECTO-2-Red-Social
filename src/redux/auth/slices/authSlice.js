import { createSlice } from "@reduxjs/toolkit";
import { getSafeJSON, clearStorage } from "../utils/authUtils";
import { handleLogin } from "./loginReducer";
import { handleRegister } from "./registerReducer";
import { handleUpdateUser } from "./updateUserReducer";

import { login } from "../thunks/loginThunk";
import { register } from "../thunks/registerThunk";
import { updateUserAsync } from "../thunks/updateUserThunk";
import { followUserAsync } from "../thunks/followUserThunk";

const userStorage = getSafeJSON("user");

const initialState = {
  user: userStorage || null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      clearStorage();
    },
  },
  extraReducers: (builder) => {
    handleLogin(builder);
    handleRegister(builder);
    handleUpdateUser(builder);
  },
});

export const { logout } = authSlice.actions;
export { login, register, updateUserAsync, followUserAsync };
export default authSlice.reducer;