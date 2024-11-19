// autoFillSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axiosIns from '../../services/axiosIns';

export const fetchAutoFillData = createAsyncThunk(
  'autoFill/fetchData',
  async () => {
    try {
      const [
        experiencesResponse,
        positionsResponse,
        industryResponse,
        contractTypesResponse,
        educationResponse,
        jobTypeResponse,
      ] = await Promise.all([
        axiosIns.get('/auto-fill/year-experience'),
        axiosIns.get('/auto-fill/position'),
        axiosIns.get('/auto-fill/industry'),
        axiosIns.get('/auto-fill/contract-type'),
        axiosIns.get('/auto-fill/education'),
        axiosIns.get('/auto-fill/job-type')
      ]);

      return {
        experiences: experiencesResponse.data,
        positions: positionsResponse.data,
        industry: industryResponse.data,
        contractTypes: contractTypesResponse.data,
        education: educationResponse.data,
        jobType: jobTypeResponse.data
      };
    } catch (error) {
      toast.error('An error occurred while fetching auto-fill data');
      throw error;
    }
  }
);

const autoFillSlice = createSlice({
  name: 'autoFill',
  initialState: {
    experiences: [],
    positions: [],
    industry: [],
    contractTypes: [],
    education: [],
    jobType: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAutoFillData.fulfilled, (state, action) => {
      state.experiences = action.payload.experiences;
      state.positions = action.payload.positions;
      state.industry = action.payload.industry;
      state.contractTypes = action.payload.contractTypes;
      state.education = action.payload.education;
      state.jobType = action.payload.jobType;
    });
  }
});

export default autoFillSlice.reducer;