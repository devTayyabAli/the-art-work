import React, { useState, useEffect, useMemo } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  Navigate,
  useNavigate,
} from "react-router-dom";
import logo from "./images/avatar2.png";
import sponsor from "./images/sponsor.png";
import logo_image from "./images/logo.png";
import close_batch from "./images/close_batch.png";
import open_batch from "./images/open_batch.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMagnifyingGlass,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";
import Wallet_Component from "./wallet_component";
import Score_Component from "./score_component";
import Login_Component from "./login_component";
import Chevron from "react-chevron";
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";
import useCheckProfile from "../hooks/useCheckProfile";
import { useDispatch, useSelector } from "react-redux";
import { get_profile } from "../Redux/ProfileSlice";
import Web3 from "web3";

const Header = () => {
  let User_profile = useSelector((state) => state.User_profile?.data?.data);
  let walletset = useSelector((state) => state?.getCandidate?.walletset);
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();


  const { disconnect } = useDisconnect();
  const { address } = useAccount();
  const [sideshow, setSideshow] = useState("");
  const [jobshow, setJobshow] = useState("none");
  const [selected_job, setSelectedJob] = useState("All Votes");
  const [login, setLogin] = useState(true);
  const [selectedbtn, setSelectedBtn] = useState(1);
  const [redirect, setRedirect] = useState(0);
  const history = useNavigate();
  const dispatch = useDispatch();

  // console.log("User_profile",User_profile);

  useEffect(() => {
    const switchConnection = async () => {
      let ethereum = window.ethereum;
      await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: Web3.utils.toHex(80001) }],
      })
      address ? setSelectedBtn(2) : setSelectedBtn(1);

    }
    if (chain?.id !== chains[0]?.id) {
      switchConnection()
      // switchNetwork?.(chains[0]?.id)

    }
  }, [address, User_profile]);

  const w3_close = () => {
    setSideshow("");
  };

  const w3_open = (value) => {
    setSelectedBtn(value);
    if (sideshow === "show") {
      setSideshow("");
    } else {
      setSideshow("show");
    }
  };

  const move_screen = (value) => {
    if (value === "votes") {
      setRedirect(1);
    } else {
      setRedirect(2);
    }
  };

  const logout = () => {
    localStorage.removeItem("customer");
    setLogin(false);
    disconnect();
  };

  const openvotestype = () => {
    if (jobshow === "none") {
      setJobshow("block");
    } else {
      setJobshow("none");
    }
  };
  const closeside = () => {
    if (sideshow === "show") {
      setSideshow("");
    }
  };

  if (redirect === 1) {
    return <Navigate push to={`/daovotes`} />;
  }
  if (redirect === 2) {
    return <Navigate push to={`/myprofile`} />;
  }
  if (redirect === 3) {
    return <Navigate push to={`/profile`} />;
  }

  let AppComponent = null;

  if (selectedbtn === 1) {
    AppComponent = Wallet_Component;
  }
  if (selectedbtn === 2) {
    AppComponent = Score_Component;
  }
  if (selectedbtn === 3) {
    AppComponent = Login_Component;
  }


  return (
    <>
      <div
        className={`w3-sidebar w3-bar-block w3-border-right ${sideshow}`}
        id="mySidebar"
        style={{ zIndex: 2 }}
      >
        <AppComponent />
      </div>
      <div
        className=""
        onClick={() => {
          closeside();
        }}
      >
        <header
          style={{
            borderBottom: "1px solid black",
            height: "60px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div
            className="d-flex justify-content-between maindiv"
            style={{ margin: "auto", alignItems: "center" }}
          >
            <div onClick={() => history("/")}>
              <img src={logo_image} className="img-fluid logo_img" />
            </div>
            <div>
              {/* {address && User_profile?.length != 0 ? (/ */}
              {address ? (
                <div
                  className="d-flex justify-content-between"
                  style={{ alignItems: "center" }}
                >
                  {User_profile?.profile_image == "" ? (
                    <>
                      <img
                        src={logo}
                        alt="test"
                        style={{ width: 40, height: 40 }}
                      />
                    </>
                  ) : (
                    <>
                      <img
                        src={User_profile?.profile_image || logo}
                        alt="test"
                        style={{ width: 40, height: 40 }}
                      />
                    </>
                  )}

                  <div className="dropdown">
                    <button
                      onClick={() => {
                        w3_close();
                      }}
                      className="dropbtn"
                    >
                      Account{" "}
                    </button>
                    <div className="dropdown-content">
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          w3_open(2);
                        }}
                      >
                        My Wallet
                      </a>
                      <a
                        style={{ cursor: "pointer" }}

                        onClick={() => {
                          move_screen("votes");
                        }}
                      >
                        DAO votes
                      </a>
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          move_screen("profile");
                        }}
                      >
                        My profile
                      </a>
                      <a
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          logout();
                        }}
                      >
                        Logout
                      </a>
                    </div>
                    <Chevron direction={"down"} />
                  </div>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between">
                    <div
                      style={{
                        alignItems: "center",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        marginRight: "20px",
                      }}
                    >
                      <button
                        onClick={() => {
                          move_screen("votes");
                        }}
                        className="header_btn1"
                      >
                        DAO Votes
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        w3_open(1);
                      }}
                      className="header_btn2"
                    >
                      Join DAO
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>
      </div>
    </>
  );
};

export default Header;
