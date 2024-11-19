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
      ] = await Promise.all([
        axiosIns.get('/auto-fill/year-experience'),
        axiosIns.get('/auto-fill/position'),
        axiosIns.get('/auto-fill/industry'),
        axiosIns.get('/auto-fill/contract-type'),
        axiosIns.get('/auto-fill/education')
      ]);

      return {
        experiences: experiencesResponse.data,
        positions: positionsResponse.data,
        industry: industryResponse.data,
        contractTypes: contractTypesResponse.data,
        education: educationResponse.data
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
    salaries: [],
    experiences: [],
    positions: [],
    industry: [],
    contractTypes: [],
    education: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAutoFillData.fulfilled, (state, action) => {
      state.experiences = action.payload.experiences;
      state.positions = action.payload.positions;
      state.industry = action.payload.industry;
      state.contractTypes = action.payload.contractTypes;
      state.education = action.payload.education
    });
  }
});

export default autoFillSlice.reducer;