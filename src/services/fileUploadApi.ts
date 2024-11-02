import { toast } from "react-toastify";
import axiosIns from "./axiosIns";

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await axiosIns.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            includeToken: true
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};
