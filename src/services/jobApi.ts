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
        let techIdsParam;
        let positionIdsParam;
        let experienceIdsParam;
        let salaryIdsParam;
        let jobTypeIdsParam;

        console.log("xxxxxxxx: " + request.searchQuery)

        if (request.techIds.length > 0) {
            techIdsParam = request.techIds.join(',');
        } else {
            techIdsParam = null; 
        }

        if (request.positionIds.length > 0) {
            positionIdsParam = request.positionIds.join(',');
        } else {
            positionIdsParam = null;
        }

        if (request.experienceIds.length > 0) {
            experienceIdsParam = request.experienceIds.join(',');
        } else {
            experienceIdsParam = null;
        }

        if (request.salaryIds.length > 0) {
            salaryIdsParam = request.salaryIds.join(',');
        } else {
            salaryIdsParam = null;
        }

        if (request.jobTypeIds.length > 0) {
            jobTypeIdsParam = request.jobTypeIds.join(',');
        } else {
            jobTypeIdsParam = null;
        }

        return axiosIns.get('/job/search', {
            params: {
                searchQuery: request.searchQuery,
                city: request.city,
                techIds: techIdsParam,
                positionIds: positionIdsParam,
                experienceIds: experienceIdsParam,
                salaryIds: salaryIdsParam,
                educationIds: request.educationIds,
                jobTypeIds: jobTypeIdsParam,
            },
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);