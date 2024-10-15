import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

// Tạo async thunk cho danh sách các thành phố với query param
export const cityList = createAsyncThunk<any, { name: string }>(
    'city/list', // Tên action để theo dõi
    async (payload, { rejectWithValue }) => {
        try {
            // Gọi API GET và gửi query param 'name'
            const response = await axiosIns.get('/auto-fill/city', {
                params: { name: payload.name }
            });
            return { response: response.data }; // Trả về dữ liệu khi thành công
        } catch (error: any) {
            // Hiển thị lỗi qua toast notification và trả về lỗi
            toast.error(error.response?.data || "An error occurred");
            return rejectWithValue(error.response?.data);
        }
    }
);

export const districtList = createAsyncThunk<any,{ name?: string; cityIds?: number }>('district/list', 
    async (payload, { rejectWithValue }) => {
    try {
        const response = await axiosIns.get('/auto-fill/district', {
            params: {
                name: payload.name,
                cityIds: payload.cityIds
            }
        });
        return { response: response.data };
    } catch (error: any) {
        toast.error(error.response?.data || "An error occurred");
        return rejectWithValue(error.response?.data);
    }
});
