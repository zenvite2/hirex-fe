import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

export const getConversations = createAsyncThunk<any>(
    'messageReducers/getConversations',
    async () => {
        return axiosIns.get(`/conversations`, { includeToken: true })
            .then(response => { return { response: response.data.data } })
            .catch(error => { toast.error("Không thể tải tin nhắn."); return []; });
    }
);
