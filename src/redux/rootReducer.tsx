import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

// Khai báo kiểu RootState để sử dụng trong toàn bộ ứng dụng
const rootReducer = combineReducers({
  user: userSlice,
});

export { rootReducer };

// Định nghĩa kiểu RootState để sử dụng cho useSelector
export type RootState = ReturnType<typeof rootReducer>;
