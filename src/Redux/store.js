import { configureStore } from '@reduxjs/toolkit'
import apiReducer from './apiSlice'
import profileData from './ProfileSlice'
import ShowSponsor from './Sponsor_get_Slice'



export const store = configureStore({
  reducer: {
    getCandidate: apiReducer,
    User_profile:profileData,
    Get_Sponsor:ShowSponsor

  },
})