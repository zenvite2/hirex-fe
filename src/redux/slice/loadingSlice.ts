import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LoadingState {
    isLoading: boolean;
    showMessenger: boolean;
}

const initialState: LoadingState = {
    isLoading: false,
    showMessenger: false,
};

const loadingSlice = createSlice({
    name: 'loading',
    initialState,
    reducers: {
        startLoading: (state) => {
            state.isLoading = true;
        },
        stopLoading: (state) => {
            state.isLoading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        openMessenger: (state) => {
            state.showMessenger = true;
        },
        closeMessenger: (state) => {
            state.showMessenger = false;
        }
    },
});

export const { startLoading, stopLoading, setLoading, openMessenger, closeMessenger } = loadingSlice.actions;
export default loadingSlice.reducer;