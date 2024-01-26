import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  useLocation,
} from "react-router-dom";
import logo_image from "./images/logo.png";
import logo from "./images/avatar2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Connection from "../connection";
import Image_path from "../image_path";
import Chevron from "react-chevron";
import close_batch from "./images/close_batch.png";
import open_batch from "./images/open_batch.png";
import Wallet_Component from "./wallet_component";
import Score_Component from "./score_component";
import Login_Component from "./login_component";
import sponsor from "./images/sponsor.png";
import Header from "./header";
import { useAccount, useSignMessage } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { get_Sponsor } from "../Redux/Sponsor_get_Slice";
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import { DAO_Abi, DAO_Address } from "../utilies/constant";
import Web3 from "web3";
import { walletConnect } from "../Redux/apiSlice";
import Loading from "./Loading";

const VoteDetails = () => {
  const [test, setTest] = useState("home1");
  const [selectedbtn, setSelectedbtn] = useState(1);
  const [redirect, setRedirect] = useState(0);
  const [showmodal1, setShowmodal1] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const [sideshow, setSideshow] = useState("none");
  const [selected_vote, setSelectedVote] = useState(1);
  const [status, setStatus] = useState("");
  const [batch, setBatch] = useState(0);

  const [myvote, setMyvote] = useState(false);
  const [selected_vote_value, setSelectedVoteValue] = useState("For");

  const [member_check, setMemberCheck] = useState(true);

  const [sponsored_1_check, setSponsored1Check] = useState("false");
  const [show_record, setShowRecord] = useState("block");
  const [spinner, setSpinner] = useState(false);
  const [userVote, setUserVote] = useState(true);
  const [spinnerVote, setSpinnerVote] = useState(false);
  const [getVoterDetails, setGetVoterDetails] = useState([]);
  const [endDate, setendDate] = useState("");
  const [memberData, setMemberData] = useState([]);
  const [url_data, setUrl_data] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().getTime() / 1000);
  const [spinner_load, setspinner_load] = useState(false);
  const dispatch = useDispatch();
  const { address } = useAccount();
  let User_profile = useSelector((state) => state.User_profile?.data?.data);
  let sponsor_All = useSelector((state) => state.Get_Sponsor?.data?.data);
  let paramData = useLocation();
  paramData = paramData?.state;
  // console.log("Sate",url_data);

  const webSupply = new Web3("https://polygon-testnet.public.blastapi.io");

  const getMember = async () => {
    try {
      let ContractOf = new webSupply.eth.Contract(DAO_Abi, DAO_Address);
      // if (address) {
      let members = await ContractOf.methods
        .members(paramData.useraddress)
        .call();
      setMemberData(members);
      console.log("members", members);
      // }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    const getOneCandidate = async () => {
      try {
        setspinner_load(true);
        let res = await axios.get(
          `https://tron.betterlogics.tech/api/v1/get_By_id_Candidate?useraddress=${paramData.useraddress}`
        );
        console.log("get_By_id_Candidate", res);
        if (res.data.success == true) {
          setUrl_data(res.data.data);
          setspinner_load(false);
        }
      } catch (error) {
        setspinner_load(false);

        console.log(error);
      }
    };
    getOneCandidate();
  },[])

  useEffect(() => {
    getMember();
    dispatch(get_Sponsor(paramData.useraddress));
    console.log("url_data.useraddress", paramData.useraddress);

    const get_Sponsor_data = async () => {
      try {
        let res = await axios.get(
          `https://tron.betterlogics.tech/api/v1/getVoterDetails?voterAddress=${address}&candidateAddress=${paramData.useraddress}`
        );
        console.log("res", res);
        if (res.data.success == true) {
          setGetVoterDetails(res.data.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const getVoteTime = async () => {
      let ContractOf = new webSupply.eth.Contract(DAO_Abi, DAO_Address);
      // if (address) {
      let voteTime = await ContractOf.methods.voteTime().call();
      // console.log("voteTime",voteTime);
      let endDate = new Date(paramData?.date);
      endDate = endDate.getTime() / 1000;
      // endDate = Number(endDate) + Number(process.env.REACT_APP_TIME);
      endDate = Number(endDate) + Number(voteTime);
      setendDate(endDate);
    };
    getVoteTime();
    get_Sponsor_data();
  }, [spinnerVote, address, spinner]);

  const handleSignMessage = async () => {
    try {
      if (address) {
        if (paramData?.SponsorID?.Sponsor_Address === address) {
          setSpinner(true);
          const { request } = await prepareWriteContract({
            address: DAO_Address,
            abi: DAO_Abi,
            functionName: "asignSponser",
            args: [
              paramData.useraddress,
              paramData?.SponsorID?.Sponsor_Address,
            ],
            account: address,
          });
          const { hash } = await writeContract(request);
          const data = await waitForTransaction({
            hash,
          });
          let res = await axios.post(
            "https://tron.betterlogics.tech/api/v1/create_sponsor",
            {
              userAddress: paramData.useraddress,
              Check_sponsor: "true",
            }
          );
          console.log("Signature", res);
          let res_create_Candidate = await axios.post(
            "https://tron.betterlogics.tech/api/v1/create_Candidate",
            {
              useraddress: paramData?.SponsorID?.Sponsor_Address,
              score: "100",
            }
          );
          console.log("res_create_Candidate", res_create_Candidate);
          setSpinner(false);

          // if (window.ethereum) {
          //   const account = address;

          //   // Replace 'YOUR_MESSAGE_TO_SIGN' with the actual message you want the user to sign
          //   const messageToSign = "Hello, this is a message to sign!";

          //   // Request signature from the user
          //   const signature = await window.ethereum.request({
          //     method: "personal_sign",
          //     params: [messageToSign, account],
          //   });
          //   setStatus(`Signature: ${signature}`);

          // } else {
          //   setStatus(
          //     "MetaMask not detected. Please install MetaMask extension."
          //   );
          // }
        } else {
          toast.error("You are not Sponsor");
        }
      } else {
        dispatch(walletConnect(1));
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Something went wrong!");
      setStatus(`Error: ${error.message}`);
      setSpinner(false);
    }
  };

  const castVote = async () => {
    try {
      if (address) {
        if (getVoterDetails.length == 0) {
          setSpinnerVote(true);
          const { request } = await prepareWriteContract({
            address: DAO_Address,
            abi: DAO_Abi,
            functionName: "vote",
            args: [paramData.useraddress, userVote],
            account: address,
          });
          const { hash } = await writeContract(request);
          const data = await waitForTransaction({
            hash,
          });
          let res = await axios.post(
            "https://tron.betterlogics.tech/api/v1/createVoter",
            {
              candidateAddress: paramData.useraddress,
              voterAddress: address,
              vote: selected_vote_value,
            }
          );
          console.log("createVoter", res);
          toast.success("You cast your Vote Successfully! ");
          setSpinnerVote(false);
          setShowmodal(false);
        } else {
          toast.error("Sorry! Yor already cast your vote.");
          setShowmodal(false);
        }
      } else {
        dispatch(walletConnect(1));
      }
    } catch (error) {
      setSpinnerVote(false);
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  const showmodal_Show = () => {
    setShowmodal(true);
  };

  const selectVote = (value) => {
    if (value === "For") {
      setSelectedVote(1);
      setSelectedVoteValue(value);
      setUserVote(true);
    } else {
      setSelectedVote(2);
      setSelectedVoteValue(value);
      setUserVote(false);
    }
  };

  const closeside = () => {
    if (sideshow === "show") {
      setSideshow("");
    } else {
      // Handle other cases as needed
    }
  };
  const w3_open = (value) => {
    setSelectedbtn(value);
    // console.log("aaaa ->");
    if (sideshow == "show") {
      setSideshow("");
    } else {
      setSideshow("show");
    }
  };

  if (redirect === 1) {
    return <Navigate push to={`${process.env.PUBLIC_URL}/daovotes`} />;
  }
  if (redirect === 2) {
    return <Navigate push to={`${process.env.PUBLIC_URL}/myprofile`} />;
  }
  if (redirect === 3) {
    return <Navigate push to={`${process.env.PUBLIC_URL}/profile`} />;
  }
  if (redirect === 4) {
    return <Navigate push to={`${process.env.PUBLIC_URL}/`} />;
  }

  let AppComponent = null;

  // let AppComponent1 = Drawer_Screen;

  if (selectedbtn == "1") {
    AppComponent = Wallet_Component;
  }
  if (selectedbtn == "2") {
    AppComponent = Score_Component;
  }
  if (selectedbtn == "3") {
    AppComponent = Login_Component;
  }
  return (
    <>
      <div
        class={`w3-sidebar w3-bar-block w3-border-right ${sideshow}`}
        id="mySidebar"
        style={{ zIndex: 2 }}
      >
        <AppComponent />
      </div>
      <div onClick={() => closeside()}>
        <Modal
          show={showmodal}
          size="sm"
          centered
          transparent={true}
          animationType="slide"
          onHide={() => setShowmodal(false)}
        >
          <Modal.Body style={{ width: "100%" }}>
            <p
              style={{
                fontSize: "12px",
                color: "black",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Are you sure you want to cast this vote?
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "black",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              This action cannot be undone.
            </p>
            <div className="selectedvote_div">
              <h5
                style={{
                  color: "gray",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {selected_vote_value}
              </h5>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button
              onClick={() => setShowmodal(false)}
              className="btn vote_modal_cancel_btn"
            >
              Cancel
            </button>
            <button
              onClick={() => castVote()}
              className="btn vote_modal_vote_btn"
              style={{}}
            >
              {spinnerVote ? "Loading.." : "Vote"}
            </button>
          </Modal.Footer>
        </Modal>

        <Modal
          className="success_modal"
          show={showmodal1}
          size="sm"
          centered
          transparent={true}
          animationType="slide"
          onHide={() => setShowmodal1(false)}
        >
          <Modal.Body
            style={{
              width: "100%",
              padding: "0px",
              borderRadius: "30px",
              backgroundColor: "red",
            }}
          >
            <div className="vote_success">
              <FontAwesomeIcon
                style={{
                  fontSize: "20px",
                  color: "white",
                  marginRight: "10px",
                }}
                icon={faCircleCheck}
              />
              <h5 style={{ color: "white", fontWeight: "bold" }}>
                Your vote is in!
              </h5>
            </div>
          </Modal.Body>
        </Modal>

        <Header />

        {spinner_load && (
          <Loading />
        ) }
         <div
              className="maindiv"
              style={{
                margin: "auto",
                marginTop: "5rem",
                display: show_record,
              }}
            >
              <div className="row mt-3" style={{}}>
                <div className="col-md-8 col-12">
                  <div
                    onClick={() => {
                      setRedirect(1);
                    }}
                    className="d-flex"
                    style={{ alignItems: "center", cursor: "pointer" }}
                  >
                    <FontAwesomeIcon
                      style={{
                        fontSize: "14px",
                        color: "gray",
                        marginRight: "10px",
                        marginTop: "2px",
                      }}
                      icon={faArrowLeft}
                    />

                    <h5 style={{ color: "gray", fontSize: "14px" }}>Back</h5>
                  </div>
                  <div
                    className="row  detail_page_side1 "
                    style={{ justifyContent: "center", marginBottom: "20px" }}
                  >
                    <div
                      className="col-md-3 col-3"
                      style={{ alignItems: "center" }}
                    >
                      {url_data.profile_image == "" ? (
                        <img src={logo} alt="test" className="img-fluid" />
                      ) : (
                        <LazyLoadImage
                          className="img-fluid candidate_image"
                          effect="blur"
                          placeholderSrc={logo}
                          src={url_data.profile_image}
                        />
                      )}
                    </div>
                    <div className="col-md-9 col-9 p-0  d-flex flex-column justify-content-evenly">
                      <div>
                        <h5 style={{ fontWeight: "bold" }}>
                          DAO Member{" "}
                          {url_data.job != "DAO Members" && (
                            <span>candidacy</span>
                          )}{" "}
                          {batch == 1 && (
                            <img
                              src={open_batch}
                              className="img_fluid"
                              style={{ width: "20px", height: "30px" }}
                            />
                          )}
                          {batch == 2 && (
                            <img
                              src={close_batch}
                              className="img_fluid"
                              style={{ width: "20px", height: "30px" }}
                            />
                          )}
                          {/* {batch == 0 && <span>({pending_time})</span>} */}
                        </h5>
                      </div>

                      <div className="col-12 d-md-block d-none">
                        <h5
                          style={{
                            marginTop: "10px",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          {url_data.name} - {url_data.job}
                        </h5>
                        <div className="col-md-3 d-md-block d-none ">
                          {url_data.status == "Active" ? (
                            <div
                              className="home_active1"
                              style={{ marginLeft: "0px", marginTop: "20px" }}
                            >
                              <p
                                style={{ textAlign: "center", color: "white" }}
                              >
                                Active
                              </p>
                            </div>
                          ) : (
                            <div
                              className="home_closed"
                              style={{ marginLeft: "0px", marginTop: "20px" }}
                            >
                              <p
                                style={{ textAlign: "center", color: "white" }}
                              >
                                Closed
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="d-flex mt-3" style={{}}>
                          {/* url_data.sponsord == ""  */}
                          {url_data?.SponsorID?.Sponsor_Address == "" ||
                          url_data?.SponsorID?.Sponsor_Address == undefined ? (
                            <h5
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                marginBottom: "0px",
                                width: "130px",
                              }}
                            >
                              Not Sponsored
                            </h5>
                          ) : (
                            <h5
                              style={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                marginBottom: "0px",
                                width: "130px",
                                marginTop: "3px",
                              }}
                            >
                              Sponsored By :
                            </h5>
                          )}
                          <div
                            className="d-flex"
                            style={{ alignItems: "center", flexWrap: "wrap" }}
                          >
                            {/* {sponsored_by_1 == "" ||
                        sponsored_by_1 == null ||
                        sponsored_by_1 == "null" ? (
                          <div></div>
                        ) : (
                          <div className="sponsored_by mb-3">
                            <h5
                              style={{ fontSize: "16px", fontWeight: "bold" }}
                            >
                              {sponsored_by_1}
                            </h5>
                            {sponsored_1_check == "true" ? (
                              <FontAwesomeIcon
                                style={{
                                  fontSize: "20px",
                                  color: "#21b66e",
                                  marginLeft: "10px",
                                }}
                                icon={faCircleCheck}
                              />
                            ) : (
                              <img
                                src={sponsor}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  marginLeft: "10px",
                                }}
                              />
                            )}
                          </div>
                        )} */}
                            {url_data?.SponsorID?.Sponsor_Address == "" ||
                            url_data?.SponsorID?.Sponsor_Address ==
                              undefined ? (
                              <div></div>
                            ) : (
                              <div className="sponsored_by1 mb-3">
                                <h5
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {url_data?.sponsord}
                                </h5>
                                {sponsor_All?.Check_sponsor == "false" ||
                                sponsor_All?.Check_sponsor == undefined ? (
                                  <>
                                    <img
                                      src={sponsor}
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        marginLeft: "10px",
                                      }}
                                    />
                                  </>
                                ) : (
                                  <>
                                    <FontAwesomeIcon
                                      style={{
                                        fontSize: "20px",
                                        color: "#21b66e",
                                        marginLeft: "10px",
                                      }}
                                      icon={faCircleCheck}
                                    />
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <h5
                      className="d-md-block d-none"
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        marginTop: "30px",
                        textAlign: "justify",
                        whiteSpace: "pre-line",
                        marginBottom: "20px",
                      }}
                    >
                      {url_data?.description}
                    </h5>

                    {url_data?.phone != "" && (
                      <h5
                        className="d-md-block d-none"
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          marginTop: "30px",
                        }}
                      >
                        Phone : {url_data?.phone}
                      </h5>
                    )}
                    {url_data?.web_link != "" && (
                      <h5
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          marginTop: "0px",
                        }}
                      >
                        {url_data?.web_link}
                      </h5>
                    )}
                    {url_data?.email != "" && (
                      <h5
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          marginTop: "0px",
                        }}
                      >
                        {url_data?.email}
                      </h5>
                    )}
                    {url_data?.company_name != "" && (
                      <h5
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        {url_data?.company_name}
                      </h5>
                    )}
                    {url_data?.postal_address != "" && (
                      <h5
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          marginTop: "0px",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {url_data?.postal_address}
                      </h5>
                    )}

                    <div className="col-12 d-md-none d-block">
                      <div
                        className="row mt-3 mb-2"
                        style={{ alignItems: "center" }}
                      >
                        <div className="col-8">
                          <h5 style={{ fontSize: "16px", fontWeight: "bold" }}>
                            {url_data?.name} - {url_data?.job}
                          </h5>
                        </div>
                        <div className="col-4">
                          {url_data?.status == "Active" ? (
                            <div className="home_active">
                              <p
                                style={{ textAlign: "center", color: "white" }}
                              >
                                Active
                              </p>
                            </div>
                          ) : (
                            <div className="home_closed">
                              <p
                                style={{ textAlign: "center", color: "white" }}
                              >
                                Closed
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <h5
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          textAlign: "justify",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {url_data?.description}
                      </h5>
                      {url_data?.phone != "" && (
                        <h5
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            marginTop: "20px",
                          }}
                        >
                          Phone : {url_data?.phone}
                        </h5>
                      )}
                      {url_data?.web_link != "" && (
                        <h5
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            marginTop: "0px",
                          }}
                        >
                          {url_data?.web_link}
                        </h5>
                      )}
                      {url_data?.email != "" && (
                        <h5
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            marginTop: "0px",
                          }}
                        >
                          {url_data?.email}
                        </h5>
                      )}
                      {url_data?.company_name != "" && (
                        <h5
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            marginTop: "10px",
                          }}
                        >
                          {url_data?.company_name}
                        </h5>
                      )}
                      {url_data?.postal_address != "" && (
                        <h5
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            marginTop: "0px",
                            whiteSpace: "pre-line",
                          }}
                        >
                          {url_data?.postal_address}
                        </h5>
                      )}

                      <div className="d-flex mt-3" style={{}}>
                        {/* url_data.sponsord == ""  */}
                        {url_data?.SponsorID?.Sponsor_Address == "" ||
                        url_data?.SponsorID?.Sponsor_Address == undefined ? (
                          <h5
                            style={{
                              fontSize: "16px",
                              fontWeight: "bold",
                              marginBottom: "0px",
                              width: "130px",
                            }}
                          >
                            Not Sponsored
                          </h5>
                        ) : (
                          <h5
                            style={{
                              fontSize: "16px",
                              fontWeight: "bold",
                              marginBottom: "0px",
                              width: "130px",
                              marginTop: "3px",
                            }}
                          >
                            Sponsored By :
                          </h5>
                        )}
                        <div
                          className="d-flex"
                          style={{ alignItems: "center", flexWrap: "wrap" }}
                        >
                          {/* {sponsored_by_1 == "" ||
                        sponsored_by_1 == null ||
                        sponsored_by_1 == "null" ? (
                          <div></div>
                        ) : (
                          <div className="sponsored_by mb-3">
                            <h5
                              style={{ fontSize: "16px", fontWeight: "bold" }}
                            >
                              {sponsored_by_1}
                            </h5>
                            {sponsored_1_check == "true" ? (
                              <FontAwesomeIcon
                                style={{
                                  fontSize: "20px",
                                  color: "#21b66e",
                                  marginLeft: "10px",
                                }}
                                icon={faCircleCheck}
                              />
                            ) : (
                              <img
                                src={sponsor}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  marginLeft: "10px",
                                }}
                              />
                            )}
                          </div>
                        )} */}
                          {url_data?.SponsorID?.Sponsor_Address == "" ||
                          url_data?.SponsorID?.Sponsor_Address == undefined ? (
                            <div></div>
                          ) : (
                            <div className="sponsored_by1 mb-3">
                              <h5
                                style={{ fontSize: "16px", fontWeight: "bold" }}
                              >
                                {url_data?.sponsord}
                              </h5>
                              {sponsor_All?.Check_sponsor == "false" ||
                              sponsor_All?.Check_sponsor == undefined ? (
                                <>
                                  <img
                                    src={sponsor}
                                    style={{
                                      width: "20px",
                                      height: "20px",
                                      marginLeft: "10px",
                                    }}
                                  />
                                </>
                              ) : (
                                <>
                                  <FontAwesomeIcon
                                    style={{
                                      fontSize: "20px",
                                      color: "#21b66e",
                                      marginLeft: "10px",
                                    }}
                                    icon={faCircleCheck}
                                  />
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-1 col-12"></div>
                <div className="col-md-3 col-12">
                  {console.log("Date", url_data?.date)}
                  {parseInt(endDate) > parseInt(currentDate) && (
                    <div
                      className="detail_page_div2"
                      style={{ marginBottom: "20px" }}
                    >
                      <div
                        style={{
                          borderBottom: "1px solid gray",
                          padding: "10px",
                        }}
                      >
                        <p style={{ fontWeight: "bold" }}>Cast your vote</p>
                      </div>
                      <div style={{ padding: "5%" }}>
                        <button
                          onClick={() => {
                            selectVote("For");
                          }}
                          className={
                            selected_vote == 1 ? `active_btn` : `inactive_btn`
                          }
                        >
                          For
                        </button>
                        <button
                          onClick={() => {
                            selectVote("Against");
                          }}
                          className={
                            selected_vote == 2 ? `active_btn` : `inactive_btn`
                          }
                        >
                          Against
                        </button>

                        {url_data?.SponsorID?.Check_sponsor == "false" &&
                          url_data?.SponsorID?.Sponsor_Address !==
                            undefined && (
                            <button
                              onClick={() => handleSignMessage()}
                              className="sponsorship_btn"
                            >
                              {spinner ? "Loading..." : "Sign sponsorships"}

                              <img
                                src={sponsor}
                                style={{
                                  width: "25px",
                                  height: "25px",
                                  position: "absolute",
                                  right: 10,
                                  top: 9,
                                }}
                              />
                            </button>
                          )}
                      </div>

                      <div style={{ padding: "5%" }}>
                        {address && User_profile?.length == 0 ? (
                          <button
                            onClick={() => {
                              w3_open(1);
                            }}
                            className="vote_btn"
                          >
                            Vote
                          </button>
                        ) : (
                          <button
                            onClick={() => showmodal_Show()}
                            className="vote_btn"
                          >
                            Vote
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div
                    className="detail_page_div2"
                    style={{ marginBottom: "20px" }}
                  >
                    <div
                      style={{
                        borderBottom: "1px solid gray",
                        padding: "10px",
                      }}
                    >
                      <p style={{ fontWeight: "bold" }}>Current Results</p>
                    </div>
                    {console.log(
                      "Voter",
                      Number(memberData?.fors) /
                        (Number(memberData?.fors) + Number(memberData?.againt))
                    )}
                    <div style={{ padding: "5%" }}>
                      <div className="d-flex justify-content-between mb-1">
                        <p style={{ fontWeight: "bold", color: "#545353" }}>
                          For
                        </p>
                        <p style={{ fontWeight: "bold", color: "#545353" }}>
                          {parseFloat(
                            (Number(memberData?.fors) /
                              (Number(memberData?.fors) +
                                Number(memberData?.againt))) *
                              100 || 0
                          ).toFixed(2)}
                          %
                        </p>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{
                            width: `${
                              (Number(memberData?.fors) /
                                (Number(memberData?.fors) +
                                  Number(memberData?.againt))) *
                                100 || 0
                            }%`,
                          }}
                        ></div>
                      </div>

                      <div className="d-flex justify-content-between mt-3 mb-1">
                        <p style={{ fontWeight: "bold", color: "#545353" }}>
                          Against
                        </p>
                        <p style={{ fontWeight: "bold", color: "#545353" }}>
                          {parseFloat(
                            (Number(memberData?.againt) * 100) /
                              (Number(memberData?.fors) +
                                Number(memberData?.againt)) || 0
                          ).toFixed(2) || 0}
                          %
                        </p>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-bar"
                          style={{
                            width: `${
                              (Number(memberData?.againt) * 100) /
                                (Number(memberData?.fors) +
                                  Number(memberData?.againt)) || 0
                            }%`,
                          }}
                        ></div>
                      </div>

                      <div className="d-flex justify-content-between mt-4">
                        <p
                          style={{
                            fontWeight: "bold",
                            color: "#545353",
                            fontSize: "14px",
                          }}
                        >
                          Start date
                        </p>
                        <p
                          style={{
                            fontWeight: "bold",
                            color: "#545353",
                            fontSize: "14px",
                          }}
                        >
                          {moment(url_data?.date).format(
                            "MMM DD YYYY, h:mm:ss a"
                          )}
                        </p>
                      </div>
                      <div className="d-flex justify-content-between mt-2">
                        <p
                          style={{
                            fontWeight: "bold",
                            color: "#545353",
                            fontSize: "14px",
                          }}
                        >
                          End date
                        </p>
                        <p
                          style={{
                            fontWeight: "bold",
                            color: "#545353",
                            fontSize: "14px",
                          }}
                        >
                          {moment(endDate * 1000).format(
                            "MMM DD YYYY, h:mm:ss a"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
      </div>
    </>
  );
};

export default VoteDetails;
