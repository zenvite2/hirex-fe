import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "./axiosIns";
import { salaryOptions } from "../pages/employee/FindJobs";

interface JobSearchRequest {
    searchQuery?: string;
    city?: number;
    industryIds?: number[];
    positionIds?: number[];
    experienceIds?: number[];
    educationIds?: number[];
    jobTypeIds?: number[];
    contractTypeIds?: number[];
    salaryOptionsId?: number[];
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

// Get all job cms
export const jobGetAllCMS = createAsyncThunk<any>(
    'job/getAll',
    async () => {
        return axiosIns.get('/cms', {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// Get all user cms
export const getAllUserCMS = createAsyncThunk<any>(
    'job/getAll',
    async () => {
        return axiosIns.get('/cms/user', {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// update active
export const updateActiveUser = createAsyncThunk<any, number>(
    'cms/update',
    async (id) => {
        return axiosIns.patch(`/cms/user/${id}`, {active : true} , {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// update active
export const updateInActiveUser = createAsyncThunk<any, number>(
    'cms/update',
    async (id) => {
        return axiosIns.patch(`/cms/user/${id}`, {active : false} , {
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

// update reject job
export const updateRejectJobCMS = createAsyncThunk<any, number>(
    'cms/update',
    async (id) => {
        return axiosIns.patch(`/cms/${id}`, {active : false} , {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// update accept job
export const updateAcceptJobCMS = createAsyncThunk<any, number>(
    'cms/update',
    async (id) => {
        return axiosIns.patch(`/cms/${id}`, {active : true} , {
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
        let industryIdsParam;
        let positionIdsParam;
        let experienceIdsParam;
        let jobTypeIdsParam;
        let salaryOptionsParam;
        let educationIdsParam;
        let contractTypeIdsParam;

        // Map other parameters if needed
        if (request.industryIds.length > 0) {
            industryIdsParam = request.industryIds.join(',');
        } else {
            industryIdsParam = null;
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

        if (request.educationIds.length > 0) {
            educationIdsParam = request.educationIds.join(',');
        } else {
            educationIdsParam = null;
        }

        if (request.salaryOptionsId && request.salaryOptionsId.length > 0) {
            salaryOptionsParam =
                salaryOptions
                    .filter(option => request.salaryOptionsId.includes(option.id))
                    .map(option => ({
                        minSalary: option.value.minSalary,
                        maxSalary: option.value.maxSalary
                    }));
        } else {
            salaryOptionsParam = null;
        }

        if (request.jobTypeIds.length > 0) {
            jobTypeIdsParam = request.jobTypeIds.join(',');
        } else {
            jobTypeIdsParam = null;
        }

        if (request.contractTypeIds.length > 0) {
            contractTypeIdsParam = request.contractTypeIds.join(',');
        } else {
            contractTypeIdsParam = null;
        }

        return axiosIns.get('/job/search', {
            params: {
                searchQuery: request.searchQuery,
                city: request.city,
                industryIds: industryIdsParam,
                positionIds: positionIdsParam,
                experienceIds: experienceIdsParam,
                educationIds: educationIdsParam,
                jobTypeIds: jobTypeIdsParam,
                contractTypeIds: contractTypeIdsParam,
                salaryOptions: salaryOptionsParam && encodeURIComponent(JSON.stringify(salaryOptionsParam))
            },
        })
            .then(response => { return { response: response.data } })
            .catch(error => { console.error(error); });
    }
);

export const recommendJob = async (id: number) => {
    return axiosIns.get(`/recommend/${id}`, {
        includeToken: true
    })
        .then(response => { return response.data })
        .catch(error => { });
}

export const getSimilarJobs = async (id: string) => {
    return axiosIns.get(`/similar/${id}`)
        .then(response => { return response.data })
        .catch(error => { });
}