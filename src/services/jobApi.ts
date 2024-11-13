import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "./axiosIns";

interface JobSearchRequest {
    searchQuery?: string;
    city?: number;
    techIds?: number[];
    positionIds?: number[];
    experienceIds?: number[];
    salaryIds?: number[];
    educationIds?: number[];
    jobTypeIds?: number[];
    contractTypeIds?: number[];
}

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

// Search jobs
export const jobSearch = createAsyncThunk<any, JobSearchRequest>(
    'job/search',
    async (request) => {
        return axiosIns.get('/job/search', {
            params: {
                searchQuery: request.searchQuery,
                city: request.city,
                techIds: request.techIds,
                positionIds: request.positionIds,
                experienceIds: request.experienceIds,
                salaryIds: request.salaryIds,
                educationIds: request.educationIds,
                jobTypeIds: request.jobTypeIds,
                contractTypeIds: request.contractTypeIds
            },
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);