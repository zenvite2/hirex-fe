import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

// cai any dau tien la kieu return, cai thu 2 la kieu payload
export const login = createAsyncThunk<any, { username: string, password: string }>(
    'authReducers/login',
    async (payload) => {
        return axiosIns.post('/auth/login', payload)
            .then(response => { response.data?.success == true && toast.success('Welcome back to Hirex.'); return { response: response.data } })
            .catch(error => { toast.error(error.response.data) });
    }
);

export const registerEmployee = createAsyncThunk<any, any>(
    'authReducers/registerEmployee',
    async (info) => {
        return axiosIns.post('/employee/create', info)
            .then(response => { return { response: response.data } })
            .catch(error => toast.error(error.response.data));
    }
);

export const registerEmployer = createAsyncThunk<any, any>(
    'authReducers/registerEmployer',
    async (info) => {
        return axiosIns.post('/employer/create', info)
            .then(response => { return { response: response.data } })
            .catch(error => toast.error(error.response.data));
    }
);