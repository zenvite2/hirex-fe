import { createSlice } from "@reduxjs/toolkit";
import { login } from "../../services/authApi"; // Make sure login is defined as a thunk
import authService from "../../services/authService";

interface AuthState {
  isLoggedIn: boolean;
  role: string;
  username: string | null;
  token: string;
}

let initialState: AuthState = {
  isLoggedIn: authService.getToken() !== null,
  role: authService.getRole() || 'GUEST',
  username: authService.getUsername() || null,
  token: null
};

const authSlice = createSlice({
  name: 'authReducers',
  initialState,
  reducers: {
    logout: (state) => {
      authService.clearCredential();
      state.isLoggedIn = false;
      state.role = 'GUEST';
      state.username = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload.response.data.success == true) {
          // authService.saveCredentail(action.payload.data, action.payload.account);
          state.isLoggedIn = true;
          state.role = authService.getRole();
          state.username = authService.getUsername();
        }
      })
      .addCase(login.rejected, (state) => {
        state.isLoggedIn = false;
        state.role = 'GUEST';
        state.username = null;
        authService.clearCredential();
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
