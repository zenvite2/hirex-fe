import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import loadingReducer from './slice/loadingSlice';
import authReducer from './slice/authSlice';

const store = configureStore({
    reducer: {
        loadingReducer,
        authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
