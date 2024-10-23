import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

// Create application
export const applicationCreate = createAsyncThunk<any, any>(
    'application/create',
    async (info) => {
        return axiosIns.post('/application', info, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => toast.error(error.response.data));
    }
);

// Get application
export const applicationLists = createAsyncThunk<any>(
    'application/getList',
    async () => {
        return axiosIns.get('/application')
            .then(response => { return { response: response.data } })
            .catch(error => toast.error(error.response.data));
    }
);