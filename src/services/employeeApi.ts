import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosIns from "./axiosIns"; // Sử dụng instance axiosIns

export const getEmployees = createAsyncThunk<any>(
  'employee/get',
  async () => {
    return axiosIns.get('/employee', {
      includeToken: true
    }).then(response => { return { response: response.data } })
      .catch(error => { })
  }
);

export const updateEmployee = createAsyncThunk<any, FormData>(
  'employee/update',
  async (formData) => {
    return axiosIns.patch('/employee', formData, {
      includeToken: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(response => { return { response: response.data } })
      .catch(error => { })
  }
);

export const registerEmployer = createAsyncThunk<any, any>(
  'authReducers/registerEmployer',
  async (info) => {
    return axiosIns.post('/employer/create', info)
      .then(response => { return { response: response.data } })
      .catch(error => { });
  }
);
