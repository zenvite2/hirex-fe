import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { users } from "../utils/data";
import { useDispatch } from "react-redux"; // Import useDispatch from react-redux

interface UserState {
  user: {
    id: number;
    name: string;
    accountType: string;
    token?: string;
  } | null;
}

const initialState: UserState = {
  user: JSON.parse(window?.localStorage.getItem("userInfo") || "null") ?? users[1],
};

const userSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ user: UserState["user"] }>) {
      state.user = action.payload.user;
    },
    logout(state) {
      state.user = null;
      window?.localStorage.removeItem("userInfo");
    },
  },
});

export default userSlice.reducer;

export function Login(user: UserState["user"]) {
  return (dispatch: any) => {
    dispatch(userSlice.actions.login({ user }));
  };
}

export function Logout() {
  return (dispatch: any) => {
    dispatch(userSlice.actions.logout());
  };
}
