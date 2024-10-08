import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import loadingSlice from './slice/loadingSlice';
import authSlice from './slice/authSlice';

const store = configureStore({
    reducer: {
        loadingSlice,
        auth: authSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
