import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

export enum ApplicationStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED'
}
// Create application
export const applicationCreate = createAsyncThunk<any, any>(
    'application/create',
    async (info) => {
        return axiosIns.post('/application', info, {
            includeToken: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// Get application
export const applicationLists = createAsyncThunk<any>(
    'application/getList',
    async () => {
        return axiosIns.get('/application')
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// Update application
export const applicationUpdate = createAsyncThunk<any, { id: number; status: ApplicationStatus }>(
    'application/updateStatus',
    async ({ id, status }) => {
        const url = `/application/${id}/status?status=${status}`;
        return axiosIns.patch(
            url,
            {},  // empty body
            {
                includeToken: true
            }
        )
            .then(response => ({ response: response.data }))
            .catch(error => {
                toast.error(error.response?.data?.message || 'Có lỗi xảy ra');
                throw error;
            });
    }
)