import React, { Component, useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  useNavigate,
} from "react-router-dom";
import logo from "./images/avatar2.png";
import sponsor from "./images/sponsor.png";
import logo_image from "./images/logo.png";
import delete_icon from "./images/delete_icon.png";
import LinesEllipsis from "react-lines-ellipsis";
import open_batch from "./images/open_batch.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faTrash,
  faMagnifyingGlass,
  faCircleCheck,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import Modal from "react-bootstrap/Modal";
import Wallet_Component from "./wallet_component";
import Score_Component from "./score_component";
import Login_Component from "./login_component";
import Connection from "../connection";
import axios from "axios";
import moment from "moment";
import Image_path from "../image_path";
import Chevron from "react-chevron";
import useAllMember from "../hooks/useAllMember";
import { useAccount } from "wagmi";
import useCheckProfile from "../hooks/useCheckProfile";
import { useDispatch, useSelector } from "react-redux";
import Header from "./header";
import toast from "react-hot-toast";
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import { DAO_Abi, DAO_Address } from "../utilies/constant";
import { get_Sponsor } from "../Redux/Sponsor_get_Slice";

const ipfsClient = require("ipfs-http-client");
//const ipfs = ipfsClient.create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

const auth =
  "Basic " +
  Buffer.from(
    `2QHErwIJpoK3MpmsHbjR3gmFGZ8:68be7ad9dda60bf7fd303dbfb9c3dfbf`
  ).toString("base64");
const ipfs = ipfsClient.create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/api/v0",
  headers: { authorization: auth },
});

const Profile = () => {
  const inputRef = useRef();
  const history = useNavigate();
  const dispatch = useDispatch();
  let getCandidate_All = useSelector((state) => state.getCandidate?.data);

  let User_profile = useSelector((state) => state.User_profile?.data?.data);
  let sponsor_All = useSelector((state) => state.Get_Sponsor?.data?.data);
  const { address } = useAccount();
  const [test, setTest] = useState("home1");
  const [sideshow, setSideshow] = useState("none");
  const [jobshow, setJobshow] = useState("none");
  const [selectedJob, setSelectedJob] = useState("Your Job");
  const [showSelectedJob, setShowSelectedJob] = useState("Your Job");
  const [showmodal, setShowModal] = useState(false);
  const [showmodal1, setShowModal1] = useState(false);
  const [showSponsorName, setShowSponsorName] = useState(false);
  const [showSponsorName1, setShowSponsorName1] = useState(false);
  const [placeholderShow, setPlaceholderShow] = useState("none");
  const [sponsorName, setSponsorName] = useState("");
  const [sponsorId, setSponsorId] = useState(0);
  const [sponsorName1, setSponsorName1] = useState("");
  const [sponsorId1, setSponsorId1] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const [login, setLogin] = useState(false);
  const [selectedBtn, setSelectedBtn] = useState(1);
  const [redirect, setRedirect] = useState(0);
  const [otherJob, setOtherJob] = useState(false);
  const [profileImageName, setProfileImageName] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [shortbreak, setShortBreak] = useState(false);
  const [type, settype] = useState("");
  const [sponsored_2_check, setsponsored_2_check] = useState("");
  const [date, setdate] = useState("");
  const [sponsored_1_check, setsponsored_1_check] = useState("");
  const [getinputData, setgetinputData] = useState({
    name: "",
    company_name: "",
    email: "",
    postal_address: "",
    phone: "",
    web_link: "",
    description: "",
    job: "",
    sponsor: "",
    profile_image: "",
  });
  const [showAllMember, getAllMenber] = useAllMember();
  const [items_Members, setitems_Members] = useState([]);
  const [UpdateState, setUpdateState] = useState("");
  const [imagesUpload, setimagesUpload] = useState("");
  const [filesize_error, setfilesize_error] = useState("");
  const [selectedSponsorAll, setselectedSponsorAll] = useState([]);
  const [spinner, setspinner] = useState(false);

  useEffect(() => {
    dispatch(get_Sponsor(address));
    getAllMenber();
    let ArrayOfMember = [];
    const getMemberName = () => {
      for (let i = 0; i < getCandidate_All.length; i++) {
        ArrayOfMember = [
          ...ArrayOfMember,
          {
            name: getCandidate_All[i].name,
            id: i,
            useraddress: getCandidate_All[i].useraddress,
          },
        ];
      }
      setitems_Members(ArrayOfMember);
    };
    // console.log("ArrayOfMkember", showAllMember);
    getMemberName();
    setTimeout(() => {
      setShortBreak(true);
    }, 500);

    localStorage.setItem("selected_job", JSON.stringify("Active Votes"));
    // get_members();
    const user = localStorage.getItem("customer");
    const alertMessage = localStorage.getItem("alertmessage");

    if (user != null) {
      setLogin(true);
      let parsed = JSON.parse(user);
      // console.log("aaaaaaaaaaaaa", parsed[0].id);
      let id = parsed[0].id;
      let name = parsed[0].name;
      if (name == null) {
        name = "";
      }
      if (name != "") {
        name = name.replace(/"/g, "'");
      }
      let company_name = parsed[0].company_name;
      if (company_name == null) {
        company_name = "";
      }
      if (company_name != "") {
        company_name = company_name.replace(/"/g, "'");
      }
      let email = parsed[0].new_email;
      let login_email = parsed[0].email;
      if (email == null || email == "null" || email == "") {
        email = "";
      }
      let date = parsed[0].date;
      let description = parsed[0].description;
      if (description == null) {
        description = "";
      }
      if (description != "") {
        description = description.replace(/"/g, "'");
      }
      let type = parsed[0].type;
      let job = parsed[0].job;
      let phone = parsed[0].phone;
      // phone.replace("/", "+");
      let postal_address = parsed[0].postal_address;
      if (postal_address != null) {
        postal_address = postal_address.replace(/"/g, "'");
      }
      // console.log("long =>", postal_address);
      if (
        postal_address == "" ||
        postal_address == "null" ||
        postal_address == null
      ) {
        setPlaceholderShow("block");
      }
      let profile_image = parsed[0].profile_image;
      let sponsored_by_1 = parsed[0].sponsored_by_1;
      let sponsored_by_2 = parsed[0].sponsored_by_2;
      let sponsored_1_check = parsed[0].sponsored_1_check;
      let sponsored_2_check = parsed[0].sponsored_2_check;
      if (
        sponsored_by_1 == "" ||
        sponsored_by_1 == null ||
        sponsored_by_1 == "null"
      ) {
      } else {
        setShowSponsorName(true);
        setSponsorName(sponsored_by_1);
      }
      if (
        sponsored_by_2 == "" ||
        sponsored_by_2 == null ||
        sponsored_by_2 == "null"
      ) {
      } else {
        setShowSponsorName1(true);
        setSponsorName1(sponsored_by_2);
      }
      let status = parsed[0].status;
      let web_link = parsed[0].web_link;
      if (web_link != null) {
        web_link = web_link.replace(/"/g, "'");
      }
      if (
        profile_image == null ||
        profile_image == "null" ||
        profile_image == ""
      ) {
      } else {
        setProfileImageName(profile_image);
        setImageUrl(Image_path + profile_image);
      }
      if (job == null || job == "null" || job == "") {
      } else {
        setSelectedJob(job);
        setOtherJob(true);
      }
      if (type == "Member") {
        this.get_candidate1(login_email);
      } else {
        this.get_candidate(id);
      }
      // this.get_candidate1(name)
      // this.setState({
      //   id: id,
      //   type: type,
      //   login_email: login_email,
      //   name: name,
      //   company_name: company_name,
      //   email: email,
      //   date: date,
      //   description: description,
      //   status: status,
      //   phone: phone,
      //   postal_address: postal_address,
      //   web_link: web_link,
      //   sponsored_1_check: sponsored_1_check,
      //   sponsored_2_check: sponsored_2_check
      // })
    } else {
      setLogin(false);
    }
  }, [UpdateState]); // Empty dependency array means this effect will only run once, similar to componentDidMount

  const handleChange = (event) => {
    let { name, value } = event.target;
    setgetinputData({ ...getinputData, [name]: value });
  };
  const handleSubmit = async () => {
    // try {
    //   const { request } = await prepareWriteContract({
    //     address: DAO_Address,
    //     abi: DAO_Abi,
    //     functionName: "completeProfile",
    //     args: ["Betterlogics", "Developer", "Lahore", 0, "tyyabarine@gmail.com", "https://exquisite-choux-50db5f.netlify.app/myprofile", "His having within saw become ask passed misery giving. Recommend questions get too fulfilled. He fact in we case miss sake. Entrance be throwing he do blessing up. Hearts warmth in genius do garden advice mr it garret.", "pnag", "0xFE28B27dD94Ea5A4A3e39cf2E4FBbDaDcbC0D0aA"],
    //     account: address,
    //   });
    //   const { hash } = await writeContract(request);
    //   const data = await waitForTransaction({
    //     hash,
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
    // console.log("Profile", address);
    setspinner(true);
    let jsonUsrl = "";
    if (imagesUpload !== "") {
      const fileAdded = await ipfs.add(imagesUpload);
      if (!fileAdded) {
        console.error("Something went wrong when updloading the file");
        setspinner(false);

        return;
      }
      const metadata = {
        title: "Asset Metadata",
        type: "object",
        properties: {
          image: fileAdded.path,
        },
      };
      const metadataAdded = await ipfs.add(JSON.stringify(metadata));
      if (!metadataAdded) {
        console.error("Something went wrong when updloading the file");
        setspinner(false);
        return;
      }
      let API_url = `https://skywalker.infura-ipfs.io/ipfs/${metadataAdded.path}`;
      let Response = await axios.get(API_url);
      jsonUsrl = `https://skywalker.infura-ipfs.io/ipfs/${Response.data.properties.image}`;
    } else {
      jsonUsrl = User_profile?.profile_image || "./images/avatar2.png";
    }
    console.log("jsonUsrl", jsonUsrl);
    try {
      console.log("company_name", address);


      const { request } = await prepareWriteContract({
        address: DAO_Address,
        abi: DAO_Abi,
        functionName: "completeProfile",
        args: [getinputData?.company_name || User_profile?.name,
        selectedJob || User_profile?.job,
        getinputData?.postal_address || User_profile?.postal_address,
        getinputData?.phone || User_profile?.phone,
        getinputData?.email || User_profile?.email,
        getinputData?.web_link || User_profile?.web_link,
        getinputData?.description || User_profile?.description,
        jsonUsrl || User_profile?.profile_image,
        selectedSponsorAll?.useraddress || address],
        account: address,
      });
      const { hash } = await writeContract(request);
      const data = await waitForTransaction({
        hash,
      });
      let res = await axios.post(
        "https://tron.betterlogics.tech/api/v1/create_Candidate",
        {
          name: getinputData.name || User_profile?.name,
          useraddress: address,
          company_name: getinputData.company_name || User_profile?.company_name,
          job: selectedJob || User_profile?.job,
          postal_address:
            getinputData.postal_address || User_profile?.postal_address,
          phone: getinputData.phone || User_profile?.phone,
          email: getinputData.email || User_profile?.email,
          web_link: getinputData.web_link || User_profile?.web_link,
          description: getinputData.description || User_profile?.description,
          profile_image: jsonUsrl || User_profile?.profile_image,
          status: "Active",
          type: "",
          date: new Date(),
          sponsord: sponsorName || User_profile?.sponsord,
          Time: User_profile?.length == 0 ? "172800" : User_profile?.Time,
          score: User_profile?.length == 0 ? "1" : User_profile?.score,
        }
      );
      console.log("Submit", res);
      if (User_profile?.length == 0) {
        let res = await axios.post(
          "https://tron.betterlogics.tech/api/v1/create_sponsor",
          {
            userAddress: address,
            Sponsor_Address: selectedSponsorAll.useraddress,
            Sponsor_name: selectedSponsorAll.name,
            Check_sponsor: "false",
          }
        );
      }
      if (res.data.success == true) {
        toast.success("Your Profile is Created SuccessFully");
        setspinner(false);
        history("/daovotes");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
      setspinner(false);
    }
  };




  const w3_open = (value) => {
    setSelectedBtn(value);

    // console.log("aaaa ->");
    if (sideshow == "show") {
      setSideshow("");
    } else {
      setSideshow("show");
    }
  };
  const move_screen = (value) => {
    if (value == "votes") {
      this.setState({
        redirect: 1,
      });
    } else if (value == "profile") {
      window.location.reload(false);
    } else {
      this.setState({
        redirect: 2,
      });
    }
  };
  const showmodalShow = () => {
    this.setState({
      showmodal: true,
    });
  };
  const showmodala1 = () => {
    this.setState({
      showmodal1: true,
    });
  };
  const handleOnSearch = (string, results) => {
    // console.log(string, results);
    setUpdateState(string);
  };

  const handleOnHover = (result) => {
    // the item hovered
    // console.log(result);
    setUpdateState(result);
  };

  const handleOnSelect = (item) => {
    // console.log("handleOnSelect",item);
    setselectedSponsorAll(item);
    let id = item["id"];
    let name = item["name"];
    if (sponsorName == name || sponsorName1 == name) {
    } else {
      if (showSponsorName == false) {
        setShowSponsorName(true);
        setSponsorId(id);
        setSponsorName(name);
      } else if (showSponsorName1 == false) {
        setShowSponsorName1(true);
        setSponsorId1(id);
        setSponsorName1(name);
      } else {
      }
    }

    setTimeout(function () {
      document
        .getElementsByClassName("sc-hLBbgP")[0]
        .querySelector("input").value = "";
    }, 100);
  };

  const handleOnFocus = () => {
    setTimeout(function () {
      document
        .getElementsByClassName("sc-hLBbgP")[0]
        .querySelector("input").value = "";
    }, 100);
  };

  const formatResult = (item) => {
    // console.log("Focused11111 ->", item);
  };
  const handleClick = () => {
    // 👇️ open file input box on click of other element
    inputRef.current.click();
  };
  const imagepreview = (e) => {
    var file = e.target.files[0];
    const MAX_FILE_SIZE = 500; // 5MB
    const fileSizeKiloBytes = file.size / 1024;
    // console.log(fileSizeKiloBytes);
    if (fileSizeKiloBytes > MAX_FILE_SIZE) {
      setfilesize_error("File size is greater than maximum limit");
    } else {
      setImageUrl(URL.createObjectURL(e.target.files[0]));
      setimagesUpload(file);
    }
    // setFile(URL.createObjectURL(e.target.files[0]))

    // console.log("aa =>", file.name);
  };

  const onSubmit = () => {
    const formData = new FormData();
    // formData.append("image", this.state.check_image);
    axios
      .post(Connection + "upload_single_image", formData, {})
      .then((res) => {
        // console.log(res.data);
        this.setState({
          profile_image_name: res.data,
        });
      })
      .catch((err) => {
        console.log("error =>", err);
      });
  };

  const signup = async () => {
    let phone11 = this.state.phone;
    let date = new Date();
    let date1 = moment(date).format("MM-DD-YYYY h:mm:ss a");
    // console.log("aaa ->", phone11);
    let id = this.state.id;

    let name = this.state.name;
    if (name != "") {
      name = name.replace(/'/g, '"');
    }
    let company_name = this.state.company_name;
    if (company_name != "") {
      company_name = company_name.replace(/'/g, '"');
    }
    let description = this.state.description;
    if (description != "") {
      description = description.replace(/'/g, '"');
    }
    let phone = this.state.phone;
    let postal_address = this.state.postal_address;
    if (postal_address != "") {
      postal_address = postal_address.replace(/'/g, '"');
    }
    let web_link = this.state.web_link;
    if (web_link != "") {
      web_link = web_link.replace(/'/g, '"');
    }
    let profile_image_name = this.state.profile_image_name;
    let login_email = this.state.login_email;
    let job = this.state.selected_job;
    let api = Connection + "profile_update";
    let sponsord1 = "";
    let sponsord2 = "";
    if (this.state.show_sponsor_name == true) {
      sponsord1 = this.state.sponsor_name;
    }
    if (this.state.show_sponsor_name1 == true) {
      sponsord2 = this.state.sponsor_name1;
    }
    let email = this.state.email;
    phone = phone.replace("+", "/");
    // console.log("pass => ", api);
    await fetch(api, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `id=${id}&name=${name}&company_name=${company_name}&description=${description}&phone=${phone}&postal_address=${postal_address}&web_link=${web_link}&profile_image=${profile_image_name}&job=${job}&date=${date1}&sponsord1=${sponsord1}&sponsord2=${sponsord2}&email=${email}&login_email=${login_email}`,
    })
      .then((response) => response.json())
      .then((response) => {
        // console.log("response", response);

        localStorage.setItem("customer", JSON.stringify(response));
        this.setState({
          redirect: 1,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const update_record = async () => {
    let date = new Date();
    let date1 = moment(date).format("MM-DD-YYYY h:mm:ss a");
    // console.log("aaa ->", date1);
    let id = this.state.id;

    let name = this.state.name;
    if (name != "") {
      name = name.replace(/'/g, '"');
    }
    let email = this.state.email;
    let company_name = this.state.company_name;
    if (company_name != "") {
      company_name = company_name.replace(/'/g, '"');
    }
    let description = this.state.description;
    if (description != "") {
      description = description.replace(/'/g, '"');
    }
    let phone = this.state.phone;
    let postal_address = this.state.postal_address;
    if (postal_address != "") {
      postal_address = postal_address.replace(/'/g, '"');
    }
    let web_link = this.state.web_link;
    let profile_image_name = this.state.profile_image_name;

    let job = this.state.selected_job;
    let api = Connection + "profile_update1";
    let sponsord1 = "";
    let sponsord2 = "";
    if (this.state.show_sponsor_name == true) {
      sponsord1 = this.state.sponsor_name;
    }
    if (this.state.show_sponsor_name1 == true) {
      sponsord2 = this.state.sponsor_name1;
    }

    phone = phone.replace("+", "/");
    // if(split[0])

    await fetch(api, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body: `id=${id}&name=${name}&company_name=${company_name}&description=${description}&phone=${phone}&postal_address=${postal_address}&web_link=${web_link}&profile_image=${profile_image_name}&job=${job}&date=${date1}&sponsord1=${sponsord1}&sponsord2=${sponsord2}&email=${email}&login_email=${this.state.login_email}`,
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          redirect: 1,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const logout = () => {
    localStorage.removeItem("customer");
    // localStorage.removeItem('alertmessage');

    this.setState({
      login: false,
      redirect: 1,
    });
  };
  const openvotestype = () => {
    if (jobshow == "none") {
      setJobshow("block");
    } else {
      setJobshow("none");
    }
  };
  const selectother = () => {
    this.setState({
      show_selected_job: "Other",
      jobshow: "none",
      otherjob: true,
      selected_job: "",
    });
  };
  const check = () => {
    if (this.state.sideshow == "show") {
      this.setState({
        sideshow: "",
      });
    }
  };
  const closeside = () => {
    if (this.state.sideshow == "show") {
      this.setState({
        sideshow: "",
      });
    } else {
    }
  };
  const onfocus = () => {
    // console.log("focus");
  };
  const onblur = () => {
    // console.log("blur");
  };
  const change_address = (value) => {
    if (value.target.value == "") {
      this.setState({
        placeholder_show: "block",
      });
    } else {
      this.setState({
        placeholder_show: "none",
      });
    }
    this.setState({
      postal_address: value.target.value,
    });
  };
  const closemessage = () => {
    let value = this.state.checkbox;
    if (value == true) {
      localStorage.setItem("alertmessage", "yes");
    }
    this.setState({
      messageshow: false,
    });
  };

  if (redirect == 1) {
    return <Navigate push to={`${process.env.PUBLIC_URL}/daovotes`} />;
  }
  if (redirect == 2) {
    return <Navigate push to={`${process.env.PUBLIC_URL}/`} />;
  }

  let AppComponent = null;

  // let AppComponent1 = Drawer_Screen;

  if (selectedBtn == "1") {
    AppComponent = Wallet_Component;
  }
  if (selectedBtn == "2") {
    AppComponent = Score_Component;
  }
  if (selectedBtn == "3") {
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
      <div
        className=""
        onClick={() => {
          closeside();
        }}
      >
        {/* <Modal show={messageShow} size="md" centered transparent={true} animationType='slide' onHide={() => setMessageShow(false)}>

          <Modal.Body style={{ width: '100%', padding: '0px 5px' }}>
            <div className='row p-3 main_record' >
              <div className='col-12 text-end'>
                <FontAwesomeIcon onClick={() => setMessageShow(false)} style={{ fontSize: '16px', color: 'gray', cursor: 'pointer' }} icon={faClose} />
              </div>
              <div className='col-12 ' >
                <p style={{ color: 'black', marginBottom: '10px' }}>You can stake your governance tokens to receive vote power.</p>
                <p style={{ color: 'black', marginTop: '10px' }}>1 governance tokens = 1 power vote</p>

              </div>
              <div className='col-8 ' style={{ marginTop: '20px', alignItems: 'center' }}>
                <div onClick={(value) => setCheckbox(!checkbox)} style={{ display: 'flex', marginTop: '5px', cursor: 'pointer' }}>
                  <input type='checkbox' checked={checkbox} value={checkbox} onChange={(value) => setCheckbox(!checkbox)} />
                  <p style={{ marginLeft: '10px', fontSize: '12px' }}>Don't display this message anymore </p>
                </div>


              </div>
              <div className='col-4 text-end' style={{ marginTop: '20px', alignItems: 'center' }}>
                <button onClick={() => closemessage()} className='btn btn-primary' style={{ borderRadius: 20, backgroundColor: '#014090' }}>Thanks</button>
              </div>

            </div>
          </Modal.Body>

        </Modal> */}
        <Header />
        <Modal
          show={showmodal}
          size="lg"
          centered
          transparent={true}
          animationType="slide"
          onHide={() => setShowModal(false)}
        >
          {/* <Modal.Header>Hi</Modal.Header> */}
          <Modal.Body style={{ width: "100%", padding: "5px 15px" }}>
            <div
              className="row p-3 main_record"
              style={{ justifyContent: "center" }}
            >
              <div
                className="col-md-2 col-3"
                style={{ alignItems: "center", display: "flex" }}
              >
                {imageUrl == null && User_profile?.profile_image == "" ? (
                  <img
                    src={logo}
                    alt="test"
                    className="img-fluid candidate_image"
                  />
                ) : (
                  <img
                    src={
                      imageUrl == null ? User_profile?.profile_image : imageUrl
                    }
                    className="img-fluid candidate_image"
                  />
                )}
              </div>
              <div className="col-md-10 col-9  d-flex flex-column justify-content-evenly">
                <div className="row">
                  <div className="col-md-9 col-12">
                    <h5 style={{ fontWeight: "bold" }}>
                      DAO Member candidacy (48 hours left)
                    </h5>
                  </div>
                  <div className="col-md-3 d-md-block d-none ">
                    <div className="home_active">
                      <p style={{ textAlign: "center", color: "white" }}>
                        Active
                      </p>
                    </div>
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
                    {getinputData.name == ""
                      ? User_profile?.name
                      : getinputData.name}{" "}
                    - {selectedJob == "" ? User_profile?.job : selectedJob}
                  </h5>
                  <h5 style={{ fontSize: "16px", fontWeight: "bold" }}>
                    <LinesEllipsis
                      text={
                        getinputData.description == ""
                          ? User_profile?.description
                          : getinputData.description
                      }
                      maxLine="3"
                      ellipsis="..."
                      trimRight={false}
                      basedOn="words"
                    />
                  </h5>
                  <div className="d-flex mt-3" style={{ alignItems: "center" }}>
                    {sponsor_All?.Sponsor_Address !== "" ||
                      User_profile?.Sponsor_Address !== undefined ? (
                      <div className="d-flex align-items-center">
                        <h5
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            marginBottom: "0px",
                          }}
                        >
                          Sponsored By :
                        </h5>
                        <div className="sponsored_by">
                          <h5
                            style={{
                              fontSize: "16px",
                              fontWeight: "bold",
                              marginBottom: "0px",
                            }}
                          >
                            {sponsorName == ""
                              ? User_profile?.sponsord
                              : sponsorName}
                          </h5>

                          {sponsor_All?.Check_sponsor == "true" ? (
                            <FontAwesomeIcon
                              style={{
                                fontSize: "18px",
                                color: "#21b66e",
                                marginLeft: "5px",
                                marginTop: "0px",
                              }}
                              icon={faCircleCheck}
                            />
                          ) : (
                            <img
                              src={sponsor}
                              style={{
                                width: "15px",
                                height: "15px",
                                marginLeft: "10px",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ) : (
                      <h5
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          marginBottom: "0px",
                        }}
                      >
                        Not Sponsored
                      </h5>
                    )}

                    {/* {this.state.show_sponsor_name1 == true && (
                      <div className="sponsored_by">
                        <h5
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            marginBottom: "0px",
                          }}
                        >
                          {this.state.sponsor_name1}
                        </h5>
                        {this.state.sponsored_2_check == "true" ? (
                          <FontAwesomeIcon
                            style={{
                              fontSize: "18px",
                              color: "#21b66e",
                              marginLeft: "5px",
                              marginTop: "0px",
                            }}
                            icon={faCircleCheck}
                          />
                        ) : (
                          <img
                            src={sponsor}
                            style={{
                              width: "15px",
                              height: "15px",
                              marginLeft: "10px",
                            }}
                          />
                        )}
                      </div>
                    )} */}
                  </div>
                </div>
              </div>
              <div className="col-12 d-md-none d-block">
                <div className="row">
                  <div className="col-8">
                    <h5
                      style={{
                        marginTop: "10px",
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                    >
                      {getinputData.name == ""
                        ? User_profile?.name
                        : getinputData.name}{" "}
                      - {selectedJob == "" ? User_profile?.job : selectedJob}
                    </h5>
                  </div>
                  <div className="col-4">
                    <div className="home_active">
                      <p style={{ textAlign: "center", color: "white" }}>
                        Active
                      </p>
                    </div>
                  </div>
                </div>
                <h5 style={{ fontSize: "16px", fontWeight: "bold" }}>
                  <LinesEllipsis
                    text={
                      getinputData.description == ""
                        ? User_profile?.description
                        : getinputData.description
                    }
                    maxLine="3"
                    ellipsis="..."
                    trimRight={false}
                    basedOn="words"
                  />
                </h5>
                <div className=" mt-3" style={{ alignItems: "center" }}>
                  {getinputData.sponsor == "" ||
                    User_profile?.sponsord == "" ? (
                    <>
                      <h5
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          marginBottom: "0px",
                        }}
                      >
                        Sponsored By:
                      </h5>
                      <div
                        className="sponsored_by"
                        style={{ marginTop: "10px" }}
                      >
                        <h5
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            marginBottom: "0px",
                          }}
                        >
                          {sponsorName == ""
                            ? User_profile?.sponsord
                            : sponsorName}
                        </h5>
                        {User_profile?.type == "Member" ? (
                          <FontAwesomeIcon
                            style={{
                              fontSize: "18px",
                              color: "#21b66e",
                              marginLeft: "5px",
                              marginTop: "0px",
                            }}
                            icon={faCircleCheck}
                          />
                        ) : (
                          <img
                            src={sponsor}
                            style={{
                              width: "15px",
                              height: "15px",
                              marginLeft: "10px",
                            }}
                          />
                        )}
                      </div>
                    </>
                  ) : (
                    <h5
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        marginBottom: "0px",
                      }}
                    >
                      Not Sponsored
                    </h5>
                  )}

                  {/* {this.state.show_sponsor_name1 == true && (
                    <div className="sponsored_by" style={{ marginTop: "10px" }}>
                      <h5
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          marginBottom: "0px",
                        }}
                      >
                        {this.state.sponsor_name1}
                      </h5>
                      {this.state.sponsored_2_check == "true" ? (
                        <FontAwesomeIcon
                          style={{
                            fontSize: "18px",
                            color: "#21b66e",
                            marginLeft: "5px",
                            marginTop: "0px",
                          }}
                          icon={faCircleCheck}
                        />
                      ) : (
                        <img
                          src={sponsor}
                          style={{
                            width: "15px",
                            height: "15px",
                            marginLeft: "10px",
                          }}
                        />
                      )}
                    </div>
                  )} */}
                </div>
              </div>
            </div>
          </Modal.Body>
          {/* <Modal.Footer>This is the footer</Modal.Footer> */}
        </Modal>
        <div
          className="maindiv"
          style={{ margin: "auto", marginTop: "3.3rem" }}
        >
          <h5 style={{ fontWeight: "bold", fontSize: "16px" }}>My Profile</h5>
          {shortbreak == true && (
            <div className="row mt-5">
              {User_profile?.name !== undefined ? (
                <div className="col-md-2 col-12 mb-4">
                  <input
                    type="text"
                    placeholder="name"
                    disabled={"true"}
                    value={User_profile?.name}
                    className="input"
                    style={{ border: "none", backgroundColor: "white" }}
                  />
                </div>
              ) : (
                <div className="col-md-2 col-12 mb-4">
                  <input
                    type="text"
                    placeholder="name"
                    name="name"
                    onChange={handleChange}
                    value={
                      getinputData.name == ""
                        ? User_profile?.name
                        : getinputData.name
                    }
                    defaultValue={User_profile?.name}
                    //  value={this.state.name} onChange={(value) => { this.setState({ name: value.target.value, }) }}
                    className="input"
                  />
                </div>
              )}
              {type != "Member" && <div className="col-md-10 col-12"></div>}
              <div className="col-md-2 col-12 mb-4">
                <div
                  onClick={() => handleClick()}
                  style={{ cursor: "pointer" }}
                  className="profile_image_design"
                >
                  {imageUrl == null ? (
                    User_profile?.profile_image == null ||
                      User_profile?.profile_image == "" ? (
                      <>
                        <div>
                          <h5 style={{ textAlign: "center" }}>
                            Your photo here
                          </h5>
                          <p style={{ fontSize: "10px", textAlign: "center" }}>
                            (500kb maximum)
                            <br />
                            <span style={{ color: "red" }}>
                              {filesize_error}
                            </span>
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <img
                          src={
                            imageUrl == null
                              ? User_profile?.profile_image
                              : imageUrl
                          }
                          className="candidate_image"
                        />
                      </>
                    )
                  ) : (
                    <img
                      src={
                        imageUrl == null
                          ? User_profile?.profile_image
                          : imageUrl
                      }
                      className="candidate_image"
                    />
                  )}
                </div>
                <input
                  style={{ display: "none" }}
                  ref={inputRef}
                  type="file"
                  onChange={(e) => {
                    imagepreview(e);
                  }}
                />
              </div>
              <div className="col-md-3 col-12" style={{ height: 180 }}>
                <input
                  type="text"
                  placeholder="Company Name"
                  name="company_name"
                  onChange={handleChange}
                  defaultValue={User_profile?.company_name}
                  value={
                    getinputData.company_name == ""
                      ? User_profile?.company_name
                      : getinputData.company_name
                  }
                  // value={this.state.company_name} onChange={(value) => { this.setState({ company_name: value.target.value, }) }}
                  className="input"
                />
                <input
                  type="text"
                  placeholder="Email"
                  className="input"
                  name="email"
                  onChange={handleChange}
                  value={
                    getinputData.email == ""
                      ? User_profile?.email
                      : getinputData.email
                  }
                  // value={this.state.email}  onChange={(value) => { this.setState({ email: value.target.value, }) }}
                  style={{ marginTop: "30px" }}
                />
                <input
                  type="text"
                  placeholder="Phone"
                  className="input"
                  name="phone"
                  onChange={handleChange}
                  value={
                    getinputData.phone == ""
                      ? User_profile?.phone
                      : getinputData.phone
                  }
                  //  value={this.state.phone}  onChange={(value) => { this.setState({ phone: value.target.value }) }}
                  style={{ marginTop: "30px" }}
                />
                <div
                  className="dropdown dropdown1"
                  style={{ position: "relative" }}
                >
                  <button
                    style={{ marginTop: "30px", padding: "0px 10px" }}
                    onClick={() => openvotestype()}
                    className="dropbtn"
                  >
                    {showSelectedJob}
                    <span style={{ marginLeft: "5px" }}>
                      <Chevron direction={"down"} />
                    </span>
                  </button>
                  <div
                    className="dropdown-content1"
                    style={{
                      display: jobshow,
                      height: "300px",
                      overflowX: "scroll",
                    }}
                  >
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => (
                        setSelectedJob("Artist"),
                        setShowSelectedJob("Artist"),
                        setJobshow("none"),
                        setOtherJob(false)
                      )}
                    >
                      Artist
                    </a>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => (
                        setSelectedJob("Gallery Director"),
                        setShowSelectedJob("Gallery Director"),
                        setJobshow("none"),
                        setOtherJob(false)
                      )}
                    >
                      Gallery Director
                    </a>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => (
                        setSelectedJob("Curator"),
                        setShowSelectedJob("Curator"),
                        setJobshow("none"),
                        setOtherJob(false)
                      )}
                    >
                      Curator
                    </a>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => (
                        setSelectedJob("Museum director"),
                        setShowSelectedJob("Museum director"),
                        setJobshow("none"),
                        setOtherJob(false)
                      )}
                    >
                      Museum director
                    </a>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => (
                        setSelectedJob("Art space director"),
                        setShowSelectedJob("Art space director"),
                        setJobshow("none"),
                        setOtherJob(false)
                      )}
                    >
                      Art space director
                    </a>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => (
                        setSelectedJob("Collector"),
                        setShowSelectedJob("Collector"),
                        setJobshow("none"),
                        setOtherJob(false)
                      )}
                    >
                      Collector
                    </a>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => (
                        setSelectedJob("Art dealer"),
                        setShowSelectedJob("Art dealer"),
                        setJobshow("none"),
                        setOtherJob(false)
                      )}
                    >
                      Art dealer
                    </a>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => (
                        setSelectedJob("Art critic"),
                        setShowSelectedJob("Art critic"),
                        setJobshow("none"),
                        setOtherJob(false)
                      )}
                    >
                      Art critic
                    </a>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => (
                        setSelectedJob("Foundation director"),
                        setShowSelectedJob("Foundation director"),
                        setJobshow("none"),
                        setOtherJob(false)
                      )}
                    >
                      Foundation director
                    </a>
                    <a
                      style={{ cursor: "pointer" }}
                      onClick={() => (
                        setSelectedJob(""),
                        setShowSelectedJob("Other"),
                        setJobshow("none"),
                        setOtherJob(true)
                      )}
                    >
                      Other
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-12">
                <input
                  type="text"
                  placeholder="Web Link"
                  name="web_link"
                  onChange={handleChange}
                  value={
                    getinputData.web_link == ""
                      ? User_profile?.web_link
                      : getinputData.web_link
                  }
                  //  value={this.state.web_link} onChange={(value) => { this.setState({ web_link: value.target.value, }) }}
                  className="input"
                />
                <div style={{ position: "relative" }}>
                  <textarea
                    type="text"
                    onFocus={() => {
                      onfocus();
                    }}
                    onBlur={() => {
                      onblur();
                    }}
                    placeholder="Your postal address : "
                    style={{
                      marginTop: "30px",
                      resize: "none",
                      height: "83px",
                    }}
                    // onChange={(value) => { this.change_address(value) }} value={this.state.postal_address}
                    onChange={handleChange}
                    name="postal_address"
                    value={
                      getinputData.postal_address == ""
                        ? User_profile?.postal_address
                        : getinputData.postal_address
                    }
                    className="input"
                    rows="3"
                  ></textarea>

                  <div style={{ display: `${placeholderShow}` }}>
                    <p
                      style={{
                        color: "#8f8f8f",
                        position: "absolute",
                        left: 165,
                        top: 33,
                      }}
                    >
                      9 John street
                    </p>
                    <p
                      style={{
                        color: "#8f8f8f",
                        position: "absolute",
                        left: 10,
                        top: 58,
                      }}
                    >
                      10001 New York
                    </p>
                    <p
                      style={{
                        color: "#8f8f8f",
                        position: "absolute",
                        left: 13,
                        top: 83,
                      }}
                    >
                      USA
                    </p>
                  </div>
                </div>
                {otherJob == true && (
                  <input
                    type="text"
                    placeholder="Job"
                    value={
                      selectedJob == "Your Job"
                        ? User_profile?.job
                        : getinputData.job
                    }
                    name="job"
                    onChange={(e) => setSelectedJob(e.target.value)}
                    //  onChange={(value) => { this.setState({ selected_job: value.target.value, }) }}

                    className="input"
                    style={{ marginTop: "28.7px" }}
                  />
                )}
              </div>
              <div className="col-md-4 col-12">
                <textarea
                  type="text"
                  placeholder="Describe your motivation to become a DAO member"
                  //  onChange={(value) => { this.setState({ description: value.target.value, }) }} value={this.state.description}
                  name="description"
                  onChange={handleChange}
                  value={
                    getinputData.description == ""
                      ? User_profile?.description
                      : getinputData.description
                  }
                  defaultValue={User_profile?.description}
                  style={{
                    resize: "none",
                    paddingLeft: "10px",
                    textIndent: "0px",
                    height: "200px",
                  }}
                  className="input"
                  rows="9"
                ></textarea>
              </div>
              {/* {sponsor_All?.length==0 && ( */}

              <div
                className="col-md-2 col-12 mb-4"
                style={{ marginTop: "10px" }}
              >
                {User_profile?.sponsord == undefined ? (
                  <ReactSearchAutocomplete
                    placeholder="Add a sponsor name"
                    items={items_Members}
                    onSearch={(string, result) => {
                      handleOnSearch(string, result);
                    }}
                    onHover={(result) => {
                      handleOnHover(result);
                    }}
                    onSelect={(item) => {
                      handleOnSelect(item);
                    }}
                    onFocus={() => {
                      handleOnFocus();
                    }}
                    showClear={false}
                    styling={{
                      borderrRadius: "20px",
                      border: "1px solid gray",
                      height: "28px",
                      width: "100%",
                      fontSize: "12px",
                      color: "black",
                      fontWeight: "bold",
                    }}
                  />
                ) : (
                  <>
                    <h5
                      style={{
                        fontSize: "16px",
                        fontWeight: "bold",
                        marginBottom: "0px",
                      }}
                    >
                      Sponsored By :
                    </h5>
                  </>
                )}
              </div>
              {/* )} */}

              {User_profile?.sponsord !== undefined ? (
                User_profile?.sponsord !== "" ? (
                  <>
                    <div className="col-md-3 col-12">
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <div
                          className="input d-flex justify-content-between"
                          style={{ padding: "4px 10px", alignItems: "center" }}
                        >
                          <h5
                            style={{
                              fontSize: "16px",
                              fontWeight: "bold",
                              marginBottom: "0px",
                            }}
                          >
                            {User_profile?.sponsord}
                          </h5>

                          <div
                            onClick={() => (
                              setShowSponsorName1(false), setSponsorName1("")
                            )}
                            className="d-flex justify-content-center"
                            style={{
                              width: "20px",
                              height: "20px",
                              borderRadius: "15px",
                              // backgroundColor: "red",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                          >
                            {sponsor_All.Check_sponsor == "true" ? (
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
                            ) : (
                              <>
                                <img src={sponsor} className="img-fluid" />
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-md-3 col-12">
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <div
                          className="input d-flex justify-content-between"
                          style={{ padding: "4px 10px", alignItems: "center" }}
                        >
                          <h5
                            style={{
                              fontSize: "14px",
                              fontWeight: "bold",
                              marginBottom: "0px",
                            }}
                          >
                            Not Sponsored
                          </h5>
                        </div>
                      </div>
                    </div>
                  </>
                )
              ) : (
                <></>
              )}
              <div className="col-md-3 col-12">
                {showSponsorName == true && (
                  <div className="d-flex" style={{ alignItems: "center" }}>
                    <div
                      className="input d-flex justify-content-between"
                      style={{ padding: "4px 10px", alignItems: "center" }}
                    >
                      <h5 style={{ fontSize: "14px" }}>{sponsorName}</h5>
                      {type != "Member" && date == null ? (
                        <div
                          onClick={() => (
                            setShowSponsorName(false), setSponsorName("")
                          )}
                          className="d-flex justify-content-center"
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "15px",
                            backgroundColor: "red",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <img src={delete_icon} className="img-fluid" />
                        </div>
                      ) : (
                        <div
                          className="d-flex"
                          style={{ alignItems: "center" }}
                        >
                          {sponsored_1_check == "true" ? (
                            <FontAwesomeIcon
                              style={{
                                fontSize: "20px",
                                color: "#21b66e",
                                marginLeft: "5px",
                                marginTop: "1px",
                              }}
                              icon={faCircleCheck}
                            />
                          ) : (
                            <img
                              onClick={() => (
                                setShowSponsorName(false), setSponsorName("")
                              )}
                              src={delete_icon}
                              className="img-fluid"
                              style={{
                                width: "20px",
                                height: "20px",
                                marginTop: "0px",
                                marginLeft: "5px",
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                    {type != "Member" && date == null && (
                      <div>
                        {sponsored_1_check == "true" ? (
                          <FontAwesomeIcon
                            style={{
                              fontSize: "20px",
                              color: "#21b66e",
                              marginLeft: "5px",
                              marginTop: "10px",
                            }}
                            icon={faCircleCheck}
                          />
                        ) : (
                          <img
                            src={sponsor}
                            className="img-fluid"
                            style={{
                              width: "20px",
                              height: "20px",
                              marginTop: "10px",
                              marginLeft: "5px",
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="col-md-3 col-12">
                {showSponsorName1 == true && (
                  <div className="d-flex" style={{ alignItems: "center" }}>
                    <div
                      className="input d-flex justify-content-between"
                      style={{ padding: "4px 10px", alignItems: "center" }}
                    >
                      <h5 style={{ fontSize: "14px" }}>{sponsorName1}</h5>
                      {type != "Member" && date == null ? (
                        <div
                          onClick={() => (
                            setShowSponsorName1(false), setSponsorName1("")
                          )}
                          className="d-flex justify-content-center"
                          style={{
                            width: "20px",
                            height: "20px",
                            borderRadius: "15px",
                            backgroundColor: "red",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                        >
                          <img src={delete_icon} className="img-fluid" />
                        </div>
                      ) : (
                        <div
                          className="d-flex"
                          style={{ alignItems: "center" }}
                        >
                          {sponsored_2_check == "true" ? (
                            <FontAwesomeIcon
                              style={{
                                fontSize: "20px",
                                color: "#21b66e",
                                marginLeft: "5px",
                                marginTop: "0px",
                              }}
                              icon={faCircleCheck}
                            />
                          ) : (
                            <img
                              src={sponsor}
                              className="img-fluid"
                              style={{
                                width: "20px",
                                height: "20px",
                                marginTop: "0px",
                                marginLeft: "5px",
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                    {type != "Member" && date == null && (
                      <div>
                        {sponsored_2_check == "true" ? (
                          <FontAwesomeIcon
                            style={{
                              fontSize: "20px",
                              color: "#21b66e",
                              marginLeft: "5px",
                              marginTop: "10px",
                            }}
                            icon={faCircleCheck}
                          />
                        ) : (
                          <img
                            src={sponsor}
                            className="img-fluid"
                            style={{
                              width: "20px",
                              height: "20px",
                              marginTop: "10px",
                              marginLeft: "5px",
                            }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="col-md-12 col-12">
                <button
                  onClick={() => {
                    setShowModal(true);
                  }}
                  className="profile_btn1"
                >
                  <p
                    style={{
                      fontSize: "10px",
                      fontWeight: "bold",
                      textAlign: "center",
                      marginBottom: "0px",
                    }}
                  >
                    DAO votes view
                  </p>
                </button>
                {/* {User_profile?.type == "candidate"  && (
                )} */}
                {/* {type == "Member" && (
                  <button
                    onClick={() => {
                      showmodal1();
                    }}
                    className="profile_btn1"
                  >
                    <p
                      style={{
                        fontSize: "10px",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: "0px",
                      }}
                    >
                      DAO member view
                    </p>
                  </button>
                )} */}
              </div>

              <div className="col-12 mb-4">
                <button
                  onClick={() => {
                    handleSubmit();
                  }}
                  className="profile_btn2"
                >
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "bold",
                      textAlign: "center",
                      marginBottom: "0px",
                      color: "white",
                    }}
                  >
                    {User_profile?.length == 0 ? (
                      <>{spinner ? "Loading..." : "   Submit to DAO"}</>
                    ) : (
                      <>{spinner ? "Loading..." : " Update"}</>
                    )}
                  </p>
                </button>
                {/* {type == "candidate" && date == null && (
                  <button
                    onClick={() => {
                      signup();
                    }}
                    className="profile_btn2"
                  >
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: "0px",
                        color: "white",
                      }}
                    >
                      Submit to DAO
                    </p>
                  </button>
                )} */}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Profile;
