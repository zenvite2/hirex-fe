import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "./axiosIns";


// Get resume
export const resumeGet = createAsyncThunk<any, any>(
    'resume/getResume',
    async (id) => {
        return axiosIns.get(`/resumes`, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);