import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}


// cai any dau tien la kieu return, cai thu 2 la kieu payload
export const login = createAsyncThunk<any, { username: string, password: string }>(
    'authReducers/login',
    async (payload) => {
        return axiosIns.post('/auth/login', payload)
            .then(response => { response.data?.success == true && toast.success('Welcome back to Hirex.'); return { response: response.data } })
            .catch(error => { { } });
    }
);

export interface UserInfo {
    userId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    avatar: string;
    companyName?: string;
}

export const getUserInfo = async (userId: number): Promise<UserInfo | null> => {
    try {
        const response = await axiosIns.get(`/user-info/${userId}`, { includeToken: true });
        if (response.data?.success === true) {
            return {
                userId: response.data.data.userId,
                fullName: response.data.data.fullName,
                email: response.data.data.email,
                phoneNumber: response.data.data.phoneNumber,
                avatar: response.data.data.avatar,
                companyName: response.data.data.companyName
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
};

export const registerEmployee = createAsyncThunk<any, any>(
    'authReducers/registerEmployee',
    async (info) => {
        return axiosIns.post('/employee/create', info)
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

export const registerEmployer = createAsyncThunk<any, any>(
    'authReducers/registerEmployer',
    async (info) => {
        return axiosIns.post('/employer/create', info)
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

export const changePassword = createAsyncThunk<any, any>(
    'authReducers/changePassword',
    async (payload) => {
        return axiosIns.post('/auth/change-password', payload,
            { includeToken: true }
        )
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
)