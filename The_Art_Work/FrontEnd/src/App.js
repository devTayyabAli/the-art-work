import logo from "./logo.svg";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "./components/home";
import Test from "./components/test";
import Profile from "./components/profie";
import Vote_Details from "./components/vote_details";
import Header from "./components/header";

import "./App.css";
import useAllMember from "./hooks/useAllMember";
import { useEffect, useState } from "react";
import axios from "axios";
import useCheckProfile from "./hooks/useCheckProfile";
import { useDispatch, useSelector } from "react-redux";
import { get_All_Candidate } from "./Redux/apiSlice";
import { useAccount } from "wagmi";
import { get_profile } from "./Redux/ProfileSlice";
import toast, { Toaster } from 'react-hot-toast';


function App() {
  const { address } = useAccount();
  const [showAllMember, getAllMenber] = useAllMember();
  const [profile_data, getUserProfile] = useCheckProfile();

  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(get_All_Candidate({type:'all',status:"all",searchData:''}));
    dispatch(get_profile(address))
    getAllMenber();
    getUserProfile();
  }, [address]);

  return (
    <>
    <Toaster />

      <Routes>
        <Route exact path={`/`} element={<Header />} />
        <Route exact path={`/daovotes`} element={<Home />} />
        <Route exact path={`/myprofile`} element={<Profile />} />
        <Route exact path={`/profile`} element={<Vote_Details />} />
      </Routes>
    </>
  );
}

export default App;
