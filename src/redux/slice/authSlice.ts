import { createSlice } from "@reduxjs/toolkit";
import { login } from "../../services/authApi"; // Make sure login is defined as a thunk
import authService from "../../services/authService";

interface AuthState {
  isLoggedIn: boolean;
  role: string;
  username: string;
  userId: number;
}

let initialState: AuthState = {
  isLoggedIn: authService.getAccessToken() !== null,
  role: authService.getRole() || 'GUEST',
  username: authService.getUsername() || null,
  userId: authService.getUserId() || null,
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
        if (action.payload?.response?.['success'] == true) {
          authService.saveCredential(action.payload.response.data);
          state.isLoggedIn = true;
          state.role = authService.getRole();
          state.username = authService.getUsername();
          state.userId = authService.getUserId();
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
