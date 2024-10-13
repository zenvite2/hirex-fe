import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { axiosWsIns } from "./axiosIns";

export const getConversations = createAsyncThunk<any, { userId: number }>(
    'messageReducers/getConversations',
    async (payload) => {
        return axiosWsIns.get(`/conversations/${payload.userId}`)
            .then(response => { return { response: response.data } })
            .catch(error => { toast.error(error.response.data); return []; });
    }
);
