import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

// Create skill
export const skillCreate = createAsyncThunk<any, any>(
    'skill/create',
    async (info) => {
        return axiosIns.post('/skill', info, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// Update skill
export const skillUpdate = createAsyncThunk<any, any>(
    'skill/update',
    async ({ id, info }) => {
        return axiosIns.patch(`/skill/${id}`, info, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);


// Get all skill
export const skillGetAll = createAsyncThunk<any>(
    'skill/getAll',
    async () => {
        return axiosIns.get('/skill/list', {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// Get skill
export const skillGet = createAsyncThunk<any, any>(
    'skill/getskill',
    async (id) => {
        return axiosIns.get(`/skill/${id}`)
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// Delete skill
export const skillDelete = createAsyncThunk<any, number>(
    'skill/delete',
    async (id) => {
        return axiosIns.delete(`/skill /${id}`, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);