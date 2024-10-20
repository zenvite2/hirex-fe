import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

// Create experience
export const experienceCreate = createAsyncThunk<any, any>(
    'experience/create',
    async (info) => {
        return axiosIns.post('/experience', info, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => toast.error(error.response.data));
    }
);

// Update experience
export const experienceUpdate = createAsyncThunk<any, any>(
    'experience/update',
    async ({ id, info }) => {
        return axiosIns.patch(`/experience/${id}`, info, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => toast.error(error.response.data));
    }
);


// Get all experience
export const experienceGetAll = createAsyncThunk<any>(
    'experience/getAll',
    async () => {
        return axiosIns.get('/experience/list', {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => toast.error(error.response.data));
    }
);

// Delete experience
export const experienceDelete = createAsyncThunk<any, number>(
    'experience/delete',
    async (id) => {
        return axiosIns.delete(`/experience/${id}`, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => toast.error(error.response.data));
    }
);