import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import toast from 'react-hot-toast';


export const get_Sponsor = createAsyncThunk("lorem/get_SponsorData", async (arg, { rejectWithValue }) => {

  try {
    const { data } = await axios.get(`https://tron.betterlogics.tech/api/v1/get_By_address_Sponsor?userAddress=${arg}`)
    return data;
  } catch (error) {
    rejectWithValue(error.response.data)
  }
})

export const Sponsor_get_Slice = createSlice({
  name: 'Get_Sponsor',
  initialState: {
    data: [],
    isSuccess: false,
    message: "",
    loading: false,
  },
  reducers: {

  },
  extraReducers: {

    [get_Sponsor.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [get_Sponsor.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.data = payload;
      state.isSuccess = true
    },
    [get_Sponsor.rejected]: (state, { payload }) => {
      state.loading = false;
      state.message = payload;
      state.isSuccess = false
    },
  },
})

// Action creators are generated for each case reducer function
export default Sponsor_get_Slice.reducer