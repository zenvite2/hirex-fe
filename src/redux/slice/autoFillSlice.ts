// autoFillSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import axiosIns from '../../services/axiosIns';

export const fetchAutoFillData = createAsyncThunk(
  'autoFill/fetchData',
  async () => {
    try {
      const [
        salariesResponse,
        experiencesResponse,
        positionsResponse,
        techsResponse,
        contractTypesResponse
      ] = await Promise.all([
        axiosIns.get('/auto-fill/salary'),
        axiosIns.get('/auto-fill/year-experience'),
        axiosIns.get('/auto-fill/position'),
        axiosIns.get('/auto-fill/tech'),
        axiosIns.get('/auto-fill/contract-type')
      ]);

      return {
        salaries: salariesResponse.data,
        experiences: experiencesResponse.data,
        positions: positionsResponse.data,
        techs: techsResponse.data,
        contractTypes: contractTypesResponse.data
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
    techs: [],
    contractTypes: []
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAutoFillData.fulfilled, (state, action) => {
      state.salaries = action.payload.salaries;
      state.experiences = action.payload.experiences;
      state.positions = action.payload.positions;
      state.techs = action.payload.techs;
      state.contractTypes = action.payload.contractTypes;
    });
  }
});

export default autoFillSlice.reducer;