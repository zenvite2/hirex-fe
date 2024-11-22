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

// Create resume
export const resumeCreate = createAsyncThunk<any, void>(
    'resume/getResume',
    async () => {
        return axiosIns.post(`/resumes`, {
            includeToken: true
        })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// Async thunk cho việc xóa resume
export const deleteResume = createAsyncThunk<any, number>(
    'resume/deleteResume',
    async (resumeId) => {
        try {
            // Gửi yêu cầu DELETE tới API
            const response = await axiosIns.delete(`/resumes/${resumeId}`, {
                includeToken: true
            });
            return response.data; // Trả về dữ liệu từ API nếu thành công
        } catch (error: any) {
            console.error('Error deleting resume:', error);
        }
    }
);