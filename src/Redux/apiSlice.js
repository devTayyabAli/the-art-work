import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { DAO_Abi, DAO_Address } from '../utilies/constant';
import Web3 from 'web3';

const webSupply = new Web3("https://polygon-testnet.public.blastapi.io");

export const get_All_Candidate = createAsyncThunk("lorem/get_All_CandidateData", async (arg, { rejectWithValue }) => {
  try {

    let ContractOf = new webSupply.eth.Contract(DAO_Abi, DAO_Address);
    const { data } = await axios.get(`https://tron.betterlogics.tech/api/v1/get_Candidate?type=${arg?.type}&status=${arg?.status}&searchData=${arg?.searchData}`)
    console.log("promises", data);

    // Using Promise.all to wait for all asynchronous calls to complete
    const promises = data?.data?.map(async (item) => {
      let members = await ContractOf.methods
        .members(item?.useraddress)
        .call();

      return {
        useraddress: item?.useraddress,
        name: item?.name,
        company_name: item?.company_name,
        email: item?.email,
        phone: item?.phone,
        web_link: item?.web_link,
        postal_address: item?.postal_address,
        description: item?.description,
        job: item?.job,
        profile_image: item?.profile_image,
        date: item?.date,
        type: item?.type,
        status: item?.status,
        score: item.score,
        againt: members?.againt,
        fors: members?.fors,
        SponsorID: item?.SponsorID,
        sponsord: item?.sponsord,

      };
    });
    let arrayData = Promise.all(promises)
      .then((updatedData) => {
        return updatedData
        // setgetAllInfo(updatedData);
        console.log("promises", updatedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    // arrayData= await arrayData
    return await arrayData;
  } catch (error) {
    rejectWithValue(error.response.data)
  }
})

export const apiSlice = createSlice({
  name: 'getCandidate',
  initialState: {
    data: [],
    isSuccess: false,
    message: "",
    loading: false,
    walletset: 1
  },
  reducers: {
    walletConnect: (state, action) => {
      // console.log("action",action);
      state.walletset = action.payload;
    },
  },
  extraReducers: {
    [get_All_Candidate.pending]: (state, { payload }) => {
      state.loading = true;
    },
    [get_All_Candidate.fulfilled]: (state, { payload }) => {
      // console.log("payload",payload);
      state.loading = false;
      state.data = payload;
      state.isSuccess = true
    },
    [get_All_Candidate.rejected]: (state, { payload }) => {
      state.loading = false;
      state.message = payload;
      state.isSuccess = false
    },
  },
})
export const { walletConnect } = apiSlice.actions;
// Action creators are generated for each case reducer function
export default apiSlice.reducer