import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

// Create job
export const jobCreate = createAsyncThunk<any, any>(
    'job/create',
    async (info) => {
        return axiosIns.post('/job', info, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// Update job
export const jobUpdate = createAsyncThunk<any, any>(
    'job/update',
    async ({ id, info }) => {
        return axiosIns.patch(`/job/${id}`, info, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// Get all job
export const jobGetAll = createAsyncThunk<any>(
    'job/getAll',
    async () => {
        return axiosIns.get('/job', {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// Get job
export const jobGet = createAsyncThunk<any, any>(
    'job/getJob',
    async (id) => {
        return axiosIns.get(`/job/${id}`)
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// Get jobWith
export const jobGetWith = createAsyncThunk<any, any>(
    'job/getJob',
    async (id) => {
        return axiosIns.get(`/job/detail/${id}`)
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// Get job with company
export const jobGetWithCompany = createAsyncThunk<any>(
    'job/getJobWithComapany',
    async (id) => {
        return axiosIns.get(`/job/with-company`, {
            // includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// Delete job
export const jobDelete = createAsyncThunk<any, number>(
    'job/delete',
    async (id) => {
        return axiosIns.delete(`/job/${id}`, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);