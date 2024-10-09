import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import loadingReducer from './slice/loadingSlice';
import userReducer from './slice/userSlice';

const store = configureStore({
    reducer: {
        loadingReducer, userReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
