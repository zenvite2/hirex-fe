import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import loadingSlice from './slice/loadingSlice';

const store = configureStore({
    reducer: {
        loadingSlice
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
