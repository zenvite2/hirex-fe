import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { login } from "../../services/authApi"; // Make sure login is defined as a thunk
import authService from "../../services/authService";

interface AuthState {
  isLoggedIn: boolean;
  role: string;
  username: string | null;
  userId: number | null;
  fullName: string;
  avatar: string;
}

const initialState: AuthState = {
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
      return {
        isLoggedIn: null,
        role: 'GUEST',
        username: null,
        userId: null,
        fullName: '',
        avatar: '',
      };
    },
    setUserInfo: (state, action: PayloadAction<{ fullName?: string, avatar?: string }>) => {
      const { fullName, avatar } = action.payload;

      if (fullName !== undefined) {
        state.fullName = fullName;
      }

      if (avatar !== undefined) {
        state.avatar = avatar;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload?.response?.['success'] === true) {
          const { data } = action.payload.response;
          authService.saveCredential(data);
          return {
            ...state,
            isLoggedIn: true,
            role: authService.getRole(),
            username: authService.getUsername(),
            userId: authService.getUserId(),
          };
        }

        return state;
      })
      .addCase(login.rejected, () => {
        authService.clearCredential();
        return {
          ...initialState,
          isLoggedIn: false,
          role: 'GUEST',
          username: null,
        };
      });
  }
});

export const { logout, setUserInfo } = authSlice.actions;
export default authSlice.reducer;