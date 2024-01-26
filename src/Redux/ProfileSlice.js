import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';
import Web3 from 'web3';

let URL = window.location.origin

export const get_profile = createAsyncThunk("lorem/get_profileData", async (arg, { rejectWithValue }) => {
  // const { address } = useAccount();
  try {

    const { data } = await axios.get(`https://tron.betterlogics.tech/api/v1/get_By_id_Candidate?useraddress=${arg}`)
    // console.log("get_profile", data);
    setTimeout(async() => {
      if (arg != undefined && data.data.success == false) {
        window.location.replace(`${URL}/myprofile`);
        let ethereum = window.ethereum;
          await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: Web3.utils.toHex(80001) }],
          })
      }
    }, 2000);
    // if(arg != undefined){
    //   let ethereum = window.ethereum;
    //   await ethereum.request({
    //     method: 'wallet_switchEthereumChain',
    //     params: [{ chainId: Web3.utils.toHex(80001) }],
    //   })
    // }
    return data;
  } catch (error) {
    rejectWithValue(error.response.data)
  }
})

export const ProfileSlice = createSlice(
  {

    name: 'User_profile',
    initialState: {
      data: [],
      isSuccess: false,
      message: "",
      loading: false,
    },
    reducers: {

    },
    extraReducers: {

      [get_profile.pending]: (state, { payload }) => {
        state.loading = true;
      },
      [get_profile.fulfilled]: (state, { payload }) => {
        state.loading = false;
        state.data = payload;
        state.isSuccess = true
      },
      [get_profile.rejected]: (state, { payload }) => {
        state.loading = false;
        state.message = payload;
        state.isSuccess = false
      },
    },
  })

// Action creators are generated for each case reducer function
export default ProfileSlice.reducer