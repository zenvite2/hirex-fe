import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "./axiosIns";
import { Resume } from '../pages/cv/types';

export const fetchResume = async (resumeId) => {
    try {
        const response = await axiosIns.get(`/resumes/${resumeId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching resume:', error);
        throw error;
    }
};

// Get resume
export const resumeGet = createAsyncThunk<any>(
    'resume/getResume',
    async (id) => {
        return axiosIns.get(`/resumes`, { includeToken: true })
            .then(response => { return { response: response.data } })
            .catch(error => { });
    }
);

// Create resume
export const resumeCreate = createAsyncThunk<
    any, // Kiểu dữ liệu trả về
    { name: string }, // Kiểu của tham số đầu vào
    { rejectValue: string } // Kiểu của giá trị trả về khi reject
>(
    'resume/create',
    async (payload, { rejectWithValue }) => {
        try {
            const response = await axiosIns.post(
                '/resumes',
                { name: payload.name }, // Gửi tên CV trong body
                { includeToken: true }
            );

            return { response: response.data };
        } catch (error: any) {
            console.error('Resume create error:', error);
            return rejectWithValue(
                error.response?.data?.message || 'Có lỗi xảy ra khi tạo CV'
            );
        }
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

export const saveResume = async (resumeData: Resume) => {
    try {
        let response;

        if (resumeData.id) {
            // Update existing resume
            response = await axiosIns.put(
                `/resumes/${resumeData.id}`,
                resumeData,
                { includeToken: true }
            );
        } 
        return response.data;
    } catch (error) {
        console.error('Error saving resume:', error);
        throw error;
    }
};