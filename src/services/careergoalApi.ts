import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

export const careergoalCreate = createAsyncThunk<any, any>(
    'career-goal/create',
    async (info) => {
        return axiosIns.post('/career-goal', info, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

export const careergoalUpdate = createAsyncThunk<any, any>(
    'career-goal/update',
    async ({ id, info }) => {
        return axiosIns.patch(`/career-goal/${id}`, info, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

export const careergoalGet = createAsyncThunk<any>(
    'career-goal/get',
    async () => {
        return axiosIns.get(`/career-goal`, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

export const careergoalDelete = createAsyncThunk<any, number>(
    'career-goal/delete',
    async (id) => {
        return axiosIns.delete(`/career-goal/${id}`, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);