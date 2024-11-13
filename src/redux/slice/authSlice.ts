import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login } from "../../services/authApi"; // Make sure login is defined as a thunk
import authService from "../../services/authService";

interface AuthState {
  isLoggedIn: boolean;
  role: string;
  username: string;
  userId: number;
  fullName: string;
  avatar: string;
}

let initialState: AuthState = {
  isLoggedIn: authService.getAccessToken() !== null,
  role: authService.getRole() || 'GUEST',
  username: authService.getUsername() || null,
  userId: authService.getUserId() || null,
  fullName: '',
  avatar: '',
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
      state.fullName = '';
      state.avatar = '';
    },
    setUserInfo: (state, action: PayloadAction<{ fullName: string, avatar: string }>) => {
      state.fullName = action.payload?.fullName;
      state.avatar = action.payload?.avatar;
    }
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

export const { logout, setUserInfo } = authSlice.actions;
export default authSlice.reducer;
