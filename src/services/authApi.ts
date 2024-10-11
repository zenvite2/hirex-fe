import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

// cai any dau tien la kieu return, cai thu 2 la kieu payload
export const login = createAsyncThunk<any, { username: string, password: string }>(
    'authReducers/login',
    async (payload) => {
        return axiosIns.post('/auth/login', payload)
            .then(response => { return { response: response.data } })
            .catch(error => error);
    }
);

export const register = createAsyncThunk<any, any>(
    'authReducers/register',
    async (info) => {
        return axiosIns.post('/auth/register/user', info)
            .then(response => { toast.success(response.data) })
            .catch(error => toast.error(error.response.data));
    }
);