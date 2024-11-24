import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

// Tạo async thunk cho danh sách các thành phố với query param
export const cityList = createAsyncThunk<any, { name: string }>(
    'city/list', // Tên action để theo dõi
    async (payload) => {
        try {
            // Gọi API GET và gửi query param 'name'
            const response = await axiosIns.get('/auto-fill/city', {
                params: { name: payload.name }
            });
            return { response: response.data }; // Trả về dữ liệu khi thành công
        } catch (error: any) {
            // Hiển thị lỗi qua toast notification và trả về lỗi
            toast.error("An error occurred");
        }
    }
);

export const districtList = createAsyncThunk<any, { name?: string; cityIds?: number }>('district/list',
    async (payload) => {
        try {
            const response = await axiosIns.get('/auto-fill/district', {
                params: {
                    name: payload.name,
                    cityIds: payload.cityIds
                }
            });
            return { response: response.data };
        } catch (error: any) {
            toast.error("An error occurred");
        }
    });

export const salaryList = createAsyncThunk<any>(
    'salary/list',
    async () => {
        return axiosIns.get('/auto-fill/salary')
            .then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const jobTypeList = createAsyncThunk<any>(
    'job-type/list',
    async () => {
        return axiosIns.get('/auto-fill/job-type', {
        }).then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const experienceList = createAsyncThunk<any>(
    'experience/list',
    async () => {
        return axiosIns.get('/auto-fill/year-experience', {
        }).then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const positionList = createAsyncThunk<any>(
    'position/list',
    async () => {
        return axiosIns.get('/auto-fill/position', {
        }).then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const industryList = createAsyncThunk<any>(
    'industry/list',
    async () => {
        return axiosIns.get('/auto-fill/industry')
            .then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const educationList = createAsyncThunk<any>(
    'education/list',
    async () => {
        return axiosIns.get('/auto-fill/education')
            .then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const contracTypeList = createAsyncThunk<any>(
    'job-type/list',
    async () => {
        return axiosIns.get('/auto-fill/contract-type', {
        }).then(response => { return { response: response.data } })
            .catch(error => { })
    }
);

export const skillList = createAsyncThunk<any, { name: string }>(
    'skill/list',
    async (payload) => {
        try {
            const response = await axiosIns.get('/auto-fill/skill', {
                params: { name: payload.name }
            });
            return { response: response.data }; 
        } catch (error: any) {
            
            toast.error("An error occurred");
        }
    }
);