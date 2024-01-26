import React, { Component, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  useNavigate,
} from "react-router-dom";
import logo from "./images/avatar2.png";
import LinesEllipsis from "react-lines-ellipsis";
import sponsor from "./images/sponsor.png";
import close_batch from "./images/close_batch.png";
import open_batch from "./images/open_batch.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Wallet_Component from "./wallet_component";
import Score_Component from "./score_component";
import Login_Component from "./login_component";
import moment from "moment";
import Modal from "react-bootstrap/Modal";

import Chevron from "react-chevron";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  faMagnifyingGlass,
  faCircleCheck,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import Header from "./header";
import Countdown from "react-countdown";
import { DAO_Abi, DAO_Address } from "../utilies/constant";
import Web3 from "web3";
import { useAccount } from "wagmi";
import { get_All_Candidate } from "../Redux/apiSlice";
import axios from "axios";

const Home = () => {
  let getCandidate_All = useSelector((state) => state.getCandidate?.data);
  const [jobshow, setJobShow] = useState("none");
  const [sideshow, setSideshow] = useState("none");
  const [messageshow, setMessageshow] = useState(false);
  const [selected_job, setSelectedJob] = useState("Active Votes");
  const [selectedbtn, setSelectedBtn] = useState(1);
  const [redirect, setRedirect] = useState(0);
  const [search, setSearch] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [batch, setbatch] = useState(0);
  const history = useNavigate();
  const [voteTime, setVoteTime] = useState(0);
  const { address } = useAccount();
  const dispatch = useDispatch();

  const webSupply = new Web3("https://polygon-testnet.public.blastapi.io");

  const collectData = async (data) => {
    try {
      let date = new Date(data.date).getTime() / 1000;
      let nowDate = new Date().getTime() / 1000;
      let dateDif = Number(parseInt(date)) + Number(voteTime);
      if (Number(nowDate) > Number(dateDif) && data?.status !== "Closed") {
        if (data?.status !== "Closed") {
          let res_create_Candidate = await axios.post(
            "https://tron.betterlogics.tech/api/v1/create_Candidate",
            {
              useraddress: data?.useraddress,
              status: "Closed",
              type:
                Number(data.fors) >= Number(data?.againt)
                  ? "DAO Member"
                  : "Refused Member",
            }
          );
          console.log("Update_status", res_create_Candidate);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getVoteTime = async () => {
      let ContractOf = new webSupply.eth.Contract(DAO_Abi, DAO_Address);
      let voteTime = await ContractOf.methods.voteTime().call();
      setVoteTime(voteTime);
    };
    getVoteTime();
  }, []);

  const goto_details_page = (id, items) => {
    localStorage.setItem("id", JSON.stringify(id));
    history("/profile", { state: items });
    setRedirect(3);
  };

  const openvotestype = () => {
    if (jobshow == "none") {
      setJobShow("block");
    } else {
      setJobShow("none");
    }
  };

  const changestatus = (value) => {
    if (value == "All Votes") {
      dispatch(
        get_All_Candidate({ type: "all", status: "all", searchData: "" })
      );
      setSelectedJob("All Votes");
      setJobShow("none");
    } else if (value == "Active Votes") {
      dispatch(
        get_All_Candidate({ type: "all", status: "Active", searchData: "" })
      );
      setSelectedJob("Active Votes");
      setJobShow("none");
    } else if (value == "Closed Votes") {
      dispatch(
        get_All_Candidate({ type: "all", status: "Closed", searchData: "" })
      );

      setSelectedJob("Closed Votes");
      setJobShow("none");
    } else if (value == "DAO Members") {
      dispatch(
        get_All_Candidate({ type: "DAO Member", status: "all", searchData: "" })
      );

      setSelectedJob("DAO Members");
      setJobShow("none");
    } else {
      dispatch(
        get_All_Candidate({
          type: "Refused Member",
          status: "all",
          searchData: "",
        })
      );
      setSelectedJob("Refused Members");
      setJobShow("none");
    }
  };

  const closemessage = () => {
    let value = checkbox;
    if (value == true) {
      localStorage.setItem("alertmessage", "yes");
    }
    setMessageshow(false);
  };

  const Completionist = () => {
    return (
      <>
        {/* <div
          className="text_days fs-5 "
          style={{ marginTop: "-0.2rem", marginLeft: "1rem" }}
        >
          <span className="me-2">(Time End!)</span>

          <button className="btn btn-primary " onClick={getresult}>
            {spinnerResult ? "Loadding..." : "Get Result"}
          </button>
        </div> */}
      </>
    );
  };
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <Completionist />;
    } else {
      return (
        <div className="text_days fs-5 ">
          {/* {days} D {hours} H {minutes} M {seconds} S */}( {days}d : {hours}h
          : {minutes}m : {seconds}s)
        </div>
      );
    }
  };

  if (redirect == 4) {
    return <Navigate push to={`${process.env.PUBLIC_URL}/`} />;
  }
  if (redirect == 2) {
    return <Navigate push to={`${process.env.PUBLIC_URL}/myprofile`} />;
  }
  if (redirect == 3) {
    return <Navigate push to={`${process.env.PUBLIC_URL}/profile`} />;
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
      <div id="header">
        <div
          class={`w3-sidebar w3-bar-block w3-border-right ${sideshow}`}
          id="mySidebar"
          style={{ zIndex: 2 }}
        >
          <AppComponent />
        </div>

        <div className="">
          <Header />

          <Modal
            show={messageshow}
            size="md"
            centered
            transparent={true}
            animationType="slide"
            onHide={() => setMessageshow(false)}
          >
            {/* <Modal.Header>Hi</Modal.Header> */}
            <Modal.Body style={{ width: "100%", padding: "0px 5px" }}>
              <div className="row p-3 main_record">
                <div className="col-12 text-end">
                  <FontAwesomeIcon
                    onClick={() => setMessageshow(false)}
                    style={{
                      fontSize: "16px",
                      color: "gray",
                      cursor: "pointer",
                    }}
                    icon={faClose}
                  />
                </div>
                <div className="col-12 ">
                  <p style={{ color: "black", marginBottom: "10px" }}>
                    You can stake your governance tokens to receive vote power.
                  </p>
                  <p style={{ color: "black", marginTop: "10px" }}>
                    1 governance tokens = 1 power vote
                  </p>
                </div>
                <div
                  className="col-8 "
                  style={{ marginTop: "20px", alignItems: "center" }}
                >
                  <div
                    onClick={(value) => setCheckbox(!checkbox)}
                    style={{
                      display: "flex",
                      marginTop: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checkbox}
                      value={checkbox}
                      onChange={(value) => setCheckbox(!checkbox)}
                    />
                    <p style={{ marginLeft: "10px", fontSize: "12px" }}>
                      Don't display this message anymore{" "}
                    </p>
                  </div>
                </div>
                <div
                  className="col-4 text-end"
                  style={{ marginTop: "20px", alignItems: "center" }}
                >
                  <button
                    onClick={() => closemessage()}
                    className="btn btn-primary"
                    style={{ borderRadius: 20, backgroundColor: "#014090" }}
                  >
                    Thanks
                  </button>
                </div>
              </div>
            </Modal.Body>
            {/* <Modal.Footer>This is the footer</Modal.Footer> */}
          </Modal>
          <div
            className="maindiv"
            style={{ margin: "auto", marginTop: "2rem" }}
            onClick={() => setSideshow("")}
          >
            <div
              className="row"
              style={{
                alignItems: "center",
                marginLeft: "0px",
                marginRight: "0px",
              }}
            >
              <div className="col-md-3 col-6 ps-0">
                <div
                  className="dropdown dropdown1"
                  style={{ position: "relative" }}
                >
                  <button
                    onClick={() => {
                      openvotestype();
                    }}
                    className="dropbtn ps-1"
                  >
                    {selected_job}
                    <span style={{ marginLeft: "5px" }}>
                      <Chevron direction={"down"} />
                    </span>
                  </button>
                  <div
                    className="dropdown-content1"
                    style={{ display: jobshow, width: "150px" }}
                  >
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => changestatus("All Votes")}
                    >
                      All Votes
                    </a>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => changestatus("Active Votes")}
                    >
                      Active Votes
                    </a>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => changestatus("Closed Votes")}
                    >
                      Closed Votes
                    </a>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => changestatus("DAO Members")}
                    >
                      DAO Members
                    </a>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => changestatus("Refused Members")}
                    >
                      Refused Members
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-5 col-0 d-md-block d-none"></div>
              <div className="col-md-4 col-6 pe-0">
                <div
                  className="d-flex justify-content-end"
                  style={{ position: "relative" }}
                >
                  <input
                    type="text"
                    placeholder=""
                    value={search}
                    onChange={(e) =>
                      dispatch(
                        get_All_Candidate({
                          type: "all",
                          status: "all",
                          searchData: e.target.value,
                        }),
                        setSearch(e.target.value)
                      )
                    }
                    className="search_input"
                  />
                  <FontAwesomeIcon
                    style={{
                      fontSize: "16px",
                      color: "black",
                      position: "absolute",
                      left: 9,
                      top: 7,
                    }}
                    icon={faMagnifyingGlass}
                  />
                </div>
              </div>
            </div>

            <div>
              {getCandidate_All?.map((items, index) => {
                let date = new Date(items.date)?.getTime() / 1000;
                let nowDate = new Date().getTime() / 1000;
                const getVoteTime = async () => {
                  let ContractOf = new webSupply.eth.Contract(
                    DAO_Abi,
                    DAO_Address
                  );
                  let voteTimes = await ContractOf.methods.voteTime().call();
                  console.log("voteTime", voteTimes);
                  date = Number(parseInt(date)) + Number(voteTimes);
                  if (
                    Number(nowDate) > Number(date) &&
                    items?.status == "Active"
                  ) {
                    collectData(items);
                  }
                };

                getVoteTime();

                return (
                  <>
                    <div
                    // style={{
                    //   backgroundColor:
                    //     items._id == itemID ? "rgba(0,0,0,0.1)" : "",
                    // }}
                    >
                      <div
                        onClick={() => goto_details_page(index, items)}
                        // onClick={() =>  items._id !== itemID ? goto_details_page(index, items):getresult()}
                        className="row p-3 main_record"
                        style={{
                          justifyContent: "center",
                          margin: "auto",
                          marginBottom: "20px",
                          color: "initial",
                          textDecoration: "none",
                          cursor: "pointer",
                          alignItems: "center",
                        }}
                      >
                        <div
                          className="col-md-2 col-3"
                          style={{ alignItems: "center" }}
                        >
                          {items.profile_image == "" ||
                            items.profile_image == null ? (
                            <img
                              src={logo}
                              alt="test"
                              className="img-fluid candidate_image"
                            />
                          ) : (
                            <LazyLoadImage
                              className="img-fluid candidate_image"
                              effect="blur"
                              placeholderSrc={logo}
                              src={items.profile_image}
                            />
                          )}
                        </div>
                        <div className="col-md-10 col-9  d-flex flex-column justify-content-evenly">
                          <div className="row">
                            <div className="col-md-11 col-12">
                              <h5
                                style={{ fontWeight: "bold", display: "flex" }}
                              >
                                <span> DAO Member</span>
                                {items.job != "DAO Members" && (
                                  <span>candidacy</span>
                                )}

                                {nowDate > Number(date) + Number(voteTime) && (
                                  <>
                                    {Number(items.fors) >=
                                      Number(items?.againt) ? (
                                      <img
                                        src={open_batch}
                                        className="img_fluid"
                                        style={{
                                          width: "20px",
                                          height: "30px",
                                          marginLeft: "0.5rem",
                                        }}
                                      />
                                    ) : (
                                      <>
                                        <img
                                          src={close_batch}
                                          className="img_fluid"
                                          style={{
                                            width: "20px",
                                            height: "30px",
                                            marginLeft: "0.5rem",
                                          }}
                                        />
                                      </>
                                    )}
                                  </>
                                )}

                                {batch == 0 && (
                                  <span>
                                    <Countdown
                                      date={
                                        parseInt(
                                          Number(date) + Number(voteTime)
                                        ) * 1000
                                      }
                                      renderer={renderer}
                                    />
                                  </span>
                                )}
                              </h5>
                            </div>
                            <div className="col-md-1 d-md-block d-none ">
                              {/* items.status == "Active" */}
                              {nowDate > Number(date) + Number(voteTime) ? (
                                <>
                                  <div className="home_closed">
                                    <p
                                      style={{
                                        textAlign: "center",
                                        color: "white",
                                      }}
                                    >
                                      Closed
                                      {/* {items.status} */}
                                    </p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className=" home_active">
                                    <p
                                      style={{
                                        textAlign: "center",
                                        color: "white",
                                      }}
                                    >
                                      Active
                                      {/* {items.status} */}
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="col-12 d-md-block d-none">
                            <h5
                              style={{
                                marginTop: "10px",
                                fontSize: "16px",
                                fontWeight: "bold",
                              }}
                            >
                              {items.name} -{" "}
                              {items.job == "Your Job" ? "" : items.job}
                            </h5>

                            <div>
                              <h5 style={{ fontSize: "16px" }}>
                                <LinesEllipsis
                                  text={items.description}
                                  maxLine="3"
                                  ellipsis="..."
                                  trimRight={false}
                                  basedOn="words"
                                />
                              </h5>
                            </div>

                            <div
                              className="d-flex mt-3"
                              style={{ alignItems: "center" }}
                            >
                              {items?.SponsorID?.Sponsor_Address == undefined && items?.sponsord == undefined ? (
                                <h5
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    marginBottom: "0px",
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
                                  }}
                                >
                                  Sponsored By
                                </h5>
                              )}
                              {items?.SponsorID?.Sponsor_Address == undefined && items?.sponsord == undefined ? (
                                <div></div>
                              ) : (
                                <div className="sponsored_by">
                                  <h5
                                    style={{
                                      fontSize: "16px",
                                      fontWeight: "bold",
                                    }}
                                  >

                                    {/* {items?.SponsorID?.Sponsor_name} */}
                                    {items?.sponsord}

                                  </h5>
                                  {items?.SponsorID?.Check_sponsor == "true" &&
                                    items?.SponsorID?.Sponsor_Address !==
                                    undefined ? (
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
                              )}
                              {/* {items.sponsored_by_2 == '' || items.sponsored_by_2 == null || items.sponsored_by_2 == 'null' ? <div></div> : <div className='sponsored_by'>
                                <h5 style={{ fontSize: '16px', fontWeight: 'bold', }}>{items.sponsored_by_2}</h5>
                                {items.sponsored_2_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '20px', color: '#21b66e', marginLeft: '10px', }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '20px', height: '20px', marginLeft: '10px' }} />}

                              </div>} */}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 d-md-none d-block">
                          <div
                            className="row mt-3"
                            style={{ alignItems: "center" }}
                          >
                            <div className="col-9">
                              <h5
                                style={{ fontSize: "14px", fontWeight: "bold" }}
                              >
                                {items.name} -{" "}
                                {items.job == "Your Job" ? "" : items.job}
                              </h5>
                            </div>
                            <div className="col-3">
                              {items.status == "Active" ? (
                                <div className="home_active1">
                                  <p
                                    style={{
                                      textAlign: "center",
                                      color: "white",
                                    }}
                                  >
                                    {items.status}
                                  </p>
                                </div>
                              ) : (
                                <div className="home_closed1">
                                  <p
                                    style={{
                                      textAlign: "center",
                                      color: "white",
                                    }}
                                  >
                                    {items.status}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                          <h5 style={{ fontSize: "16px" }}>
                            <LinesEllipsis
                              text={items.description}
                              maxLine="3"
                              ellipsis="..."
                              trimRight={false}
                              basedOn="words"
                            />
                          </h5>
                          <div
                            className="d-flex mt-3"
                            style={{ alignItems: "center" }}
                          >
                            {items?.SponsorID?.Sponsor_Address == "" ||
                              items?.SponsorID?.Sponsor_Address == undefined ? (
                              <h5
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "bold",
                                  marginBottom: "0px",
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
                                }}
                              >
                                Sponsored By
                              </h5>
                            )}
                            {items?.SponsorID?.Sponsor_Address == "" ||
                              items?.SponsorID?.Sponsor_Address == undefined ? (
                              <div></div>
                            ) : (
                              <div className="sponsored_by">
                                <h5
                                  style={{
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {items?.SponsorID?.Sponsor_name}
                                </h5>
                                {items?.SponsorID?.Check_sponsor == "true" &&
                                  items?.SponsorID?.Sponsor_Address !==
                                  undefined ? (
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
                            )}
                            {/* {items.sponsored_by_2 == '' || items.sponsored_by_2 == null || items.sponsored_by_2 == 'null' ? <div></div> : <div className='sponsored_by'>
                                <h5 style={{ fontSize: '16px', fontWeight: 'bold', }}>{items.sponsored_by_2}</h5>
                                {items.sponsored_2_check == 'true' ? <FontAwesomeIcon style={{ fontSize: '20px', color: '#21b66e', marginLeft: '10px', }} icon={faCircleCheck} /> : <img src={sponsor} style={{ width: '20px', height: '20px', marginLeft: '10px' }} />}

                              </div>} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
