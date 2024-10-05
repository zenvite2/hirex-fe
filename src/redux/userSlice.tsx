import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  accessToken: string | null;
  refreshToken: string | null;
  userId: number | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  accessToken: null,
  refreshToken: null,
  userId: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserCredentials: (state, action: PayloadAction<TokenResponse>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userId = action.payload.userId;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.userId = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUserCredentials, logout } = userSlice.actions;
export default userSlice.reducer;

// Định nghĩa kiểu cho TokenResponse
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  userId: number;
}