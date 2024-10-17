import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

// Create education
export const educationCreate = createAsyncThunk<any, any>(
    'education/create',
    async (info) => {
        return axiosIns.post('/education', info, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => toast.error(error.response.data));
    }
);

// Update education
export const educationUpdate = createAsyncThunk<any, any>(
    'education/update',
    async ({ id, info }) => {
        return axiosIns.patch(`/education/${id}`, info, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => toast.error(error.response.data));
    }
);


// Get all educations
export const educationGetAll = createAsyncThunk<any>(
    'education/getAll',
    async () => {
        return axiosIns.get('/education/list', {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => toast.error(error.response.data));
    }
);

// Delete education
export const educationDelete = createAsyncThunk<any, number>(
    'education/delete',
    async (id) => {
        return axiosIns.delete(`/education/${id}`, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => toast.error(error.response.data));
    }
);