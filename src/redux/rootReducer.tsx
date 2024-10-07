import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
// Import thêm các reducers khác nếu có

const rootReducer = combineReducers({
  user: userReducer,
  // Thêm các reducers khác vào đây
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;