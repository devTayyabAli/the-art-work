import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotateRight, faCopy, faCircleDollarToSlot, faClose } from '@fortawesome/free-solid-svg-icons';
import { faEthereum } from '@fortawesome/free-brands-svg-icons';
import Modal from 'react-bootstrap/Modal';
import Image_path from '../image_path';
import logo from './images/avatar2.png';
import matic from './images/matic.png';
import usdc from './images/usdc.png';
import useCheckProfile from '../hooks/useCheckProfile';
import { useSelector } from 'react-redux';
import Web3 from 'web3';
import { DAO_Abi, DAO_Address, DAO_Token_Abi, DAO_Token_Address } from '../utilies/constant';
import { useAccount } from 'wagmi';
import {
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core";
import toast from 'react-hot-toast';

const Score_Component = () => {
  const { address } = useAccount();
  const [TokenBalance, setTokenBalance] = useState(0)
  const [getTokenValue, setgetTokenValue] = useState("")
  const [spinner, setspinner] = useState(false)
  const [memberData, setMemberData] = useState([])
  const [selectedstack, setselectedstack] = useState(0)
  const [radio1, setradio1] = useState(1)
  const [spinnerStake, setSpinnerStake] = useState(false)
  let User_profile = useSelector((state) => state.User_profile?.data?.data);
  const [state, setState] = useState({
    test: 'home1',
    showmodal: false,
    sideshow: 'none',
    name: '',
    image_url: '',
    selectedstack: 0,
    radio1: 1,
    tokens: '0',
    newtoken: '',
    power: 0,
    checkbox: false,
    messageshow: false,
  });

  const webSupply = new Web3("https://polygon-testnet.public.blastapi.io");

  const getBalance = async () => {
    try {

      let tokenContractOf = new webSupply.eth.Contract(
        DAO_Token_Abi,
        DAO_Token_Address
      );
      let ContractOf = new webSupply.eth.Contract(
        DAO_Abi,
        DAO_Address
      );
      if (address) {
        let blanceOf = await tokenContractOf.methods.balanceOf(address).call();
        blanceOf = webSupply.utils.fromWei(blanceOf.toString())
        setTokenBalance(parseFloat(blanceOf).toFixed(2))
        let members = await ContractOf.methods.members(address).call();
        setMemberData(members)
        console.log("members", members);
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getBalance()
   
  }, [address])


  const stakToken = async () => {
    try {
      if (getTokenValue == "") {
        toast.error("Please Enter Token Amount First!");
        setSpinnerStake(false);
      } else {
        if (!address) {
          toast.error("Please Connect Metamaske First!");
        } else {
          setSpinnerStake(true);

          let stakingValue = webSupply.utils.toWei(getTokenValue.toString());

          if (Number(TokenBalance) >= Number(getTokenValue)) {
            const { request } = await prepareWriteContract({
              address: DAO_Token_Address,
              abi: DAO_Token_Abi,
              functionName: "approve",
              args: [DAO_Address, stakingValue.toString()],
              account: address,
            });
            const { hash } = await writeContract(request);
            const data = await waitForTransaction({
              hash,
            });

            setTimeout(async () => {
              toast.success("Approve Confirmed");
              let stakeTime
              if (radio1 == 1) {
                stakeTime = false
              } else {
                stakeTime = true

              }
              const { request } = await prepareWriteContract({
                address: DAO_Address,
                abi: DAO_Abi,
                functionName: "stake",
                args: [stakingValue.toString(), stakeTime],
                account: address,
              });
              const { hash } = await writeContract(request);
              const data = await waitForTransaction({
                hash,
              });
              toast.success(`Token Staked Successfull.`);
              setSpinnerStake(false);
            }, 1000);
          } else {
            toast.error("Insufficient Balance");
            setSpinnerStake(false);
          }
        }
      }

    } catch (error) {
      console.log(error);
      setSpinnerStake(false);
      toast.error("Something went wrong!");

    }
  }



  const getmax = () => {
    setState({
      ...state,
      newtoken: state.tokens,
    });
  };

  const getmax1 = () => {
    setState({
      ...state,
      newtoken: state.power,
    });
  };

  const goback = () => {
    setState({
      ...state,
      newtoken: '',
      selectedstack: 0,
    });
  };

  const goback1 = () => {
    let newtoken = parseInt(state.newtoken);
    let token = parseInt(state.tokens);
    let newvalue = token - newtoken;

    setState({
      ...state,
      power: newtoken,
      tokens: newvalue,
      newtoken: '',
      selectedstack: 0,
    });
  };

  const goback12 = () => {
    let newtoken = parseInt(state.newtoken);
    let token = parseInt(state.tokens);
    let power = parseInt(state.power);

    let newvalue = power - newtoken;

    setState({
      ...state,
      power: newvalue,
      tokens: token + newtoken,
      newtoken: '',
      selectedstack: 0,
    });
  };

  const openstake = () => {
    if (TokenBalance !== 0) {
      // setState({
      //   ...state,
      //   selectedstack: 1,
      // });
      setselectedstack(1)
    }
  };

  const openunstake = () => {
    if (memberData?.score !== 0) {
      setselectedstack(1)
    }
  };

  const numberWithSpaces = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const closemessage = () => {
    let value = state.checkbox;
    if (value === true) {
      localStorage.setItem('alertmessage', 'yes');
    }
    setState({
      ...state,
      messageshow: false,
    });
  };

  return (
    <div className="score_div" style={{}}>
      <Modal show={state.messageshow} size="md" centered transparent={true} animationType="slide" onHide={() => setState({ ...state, messageshow: false })}>
        <Modal.Body style={{ width: '100%', padding: '0px 5px' }}>
          <div className="row p-3 main_record">
            <div className="col-12 text-end">
              <FontAwesomeIcon onClick={() => setState({ ...state, messageshow: false })} style={{ fontSize: '16px', color: 'gray', cursor: 'pointer' }} icon={faClose} />
            </div>
            <div className="col-12">
              <p style={{ color: 'black', marginBottom: '10px' }}>You can stake your governance tokens to receive vote power.</p>
              <p style={{ color: 'black', marginTop: '10px' }}>1 governance token = 1 power vote</p>
            </div>
            <div className="col-8">
              <div onClick={() => setState({ ...state, checkbox: !state.checkbox })} style={{ display: 'flex', marginTop: '5px', cursor: 'pointer' }}>
                <input type="checkbox" checked={state.checkbox} value={state.checkbox} onChange={() => setState({ ...state, checkbox: !state.checkbox })} />
                <p style={{ marginLeft: '10px', fontSize: '12px' }}>Don't display this message anymore </p>
              </div>
            </div>
            <div className="col-4 text-end">
              <button onClick={() => closemessage()} className="btn btn-primary" style={{ borderRadius: 20, backgroundColor: '#014090' }}>
                Thanks
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <div className="d-flex justify-content-between" style={{ borderBottom: '1px solid gray', padding: '10px', alignItems: 'center' }}>
        <div className="d-flex" style={{ alignItems: 'center' }}>
          {User_profile?.profile_image === '' ? (
            <img src={logo} alt="test" className="img-fluid" style={{ width: '30px', height: '30px', marginLeft: '10px' }} />
          ) : (
            <img src={User_profile?.profile_image || logo} alt="test" className="img-fluid" style={{ width: '30px', height: '30px', borderRadius: '20px', marginLeft: '10px', objectFit: 'cover' }} />
          )}
          <p style={{ fontWeight: 'bold', color: 'black', marginLeft: '10px' }}>{User_profile?.name}</p>
        </div>
        <FontAwesomeIcon onClick={() => getBalance()} style={{ fontSize: '20px', cursor: 'pointer' }} icon={faRotateRight} />
      </div>

      <div style={{ padding: '20px', position: 'relative' }}>
        <h3 style={{ textAlign: 'center', fontWeight: 'bold' }}>Vote power</h3>
        <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>{(memberData?.score/1000000000000000000) || 0}</h1>
        <h3 style={{ textAlign: 'center', fontWeight: 'bold', marginTop: '15px' }}>Governance Token</h3>
        <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>{(TokenBalance)}</h1>

        <div onClick={() => openstake()} style={state.tokens !== 0 ? { border: '1px solid black', padding: '2px 0px', borderRadius: 10, position: 'absolute', right: 10, bottom: 40, width: '60px', cursor: 'pointer' } : { border: '1px solid gray', padding: '2px 0px', borderRadius: 10, position: 'absolute', right: 10, bottom: 40, width: '60px', cursor: 'pointer' }}>
          <p style={state.tokens !== 0 ? { fontSize: 10, textAlign: 'center', fontWeight: 'bold' } : { fontSize: 10, textAlign: 'center' }}>Stake</p>
        </div>
        <div onClick={() => openunstake()} style={state.power !== 0 ? { border: '1px solid black', padding: '2px 0px', borderRadius: 10, position: 'absolute', right: 10, bottom: 15, width: '60px', cursor: 'pointer' } : { border: '1px solid gray', padding: '2px 0px', borderRadius: 10, position: 'absolute', right: 10, bottom: 15, width: '60px', cursor: 'pointer' }}>
          <p style={state.power !== 0 ? { fontSize: 10, textAlign: 'center', fontWeight: 'bold' } : { fontSize: 10, textAlign: 'center' }}>Unstake</p>
        </div>
      </div>
      <hr className="m-0" />
      {selectedstack === 0 && (
        <div style={{ padding: '0px 20px' }}>
          <button className="wallet_btn1" style={{ marginBottom: '10px' }}>
            <p style={{ fontWeight: 'bold', color: '#767f88', fontSize: '12px' }}>Total Balance</p>
            <p style={{ fontWeight: 'bold', color: 'black', fontSize: '14px' }}>$26,09 USD</p>
            <div className="d-flex justify-content-center" style={{ alignItems: 'center' }}>
              <p style={{ fontWeight: 'bold', color: '#767f88', fontSize: '12px' }}>0xe2...12sd</p>
              <FontAwesomeIcon style={{ fontSize: '12px', color: '#767f88', marginLeft: '5px' }} icon={faCopy} />
            </div>
          </button>

          <button className="d-flex wallet_btn2 justify-content-between">
            <div className="d-flex" style={{ alignItems: 'center' }}>
              <img src={matic} className="img-fluid" style={{ width: '35px', height: '30px', marginRight: '10px', objectFit: 'cover' }} />
              <div>
                <p style={{ fontWeight: 'bold', color: 'black', fontSize: '12px', textAlign: 'left' }}>MATIC</p>
                <p style={{ fontWeight: 'bold', color: '#767f88', fontSize: '10px', textAlign: 'left' }}>Polygon</p>
              </div>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: 'black', fontSize: '12px', textAlign: 'right' }}>0,0003</p>
              <p style={{ fontWeight: 'bold', color: '#767f88', fontSize: '10px', textAlign: 'right' }}>$0,10 USD</p>
            </div>
          </button>
          <button className="d-flex wallet_btn2 justify-content-between">
            <div className="d-flex" style={{ alignItems: 'center' }}>
              <img src={usdc} className="img-fluid" style={{ width: '35px', height: '30px', marginRight: '10px', objectFit: 'cover' }} />
              <div>
                <p style={{ fontWeight: 'bold', color: 'black', fontSize: '12px', textAlign: 'left' }}>USDC</p>
                <p style={{ fontWeight: 'bold', color: '#767f88', fontSize: '10px', textAlign: 'left' }}>Polygon</p>
              </div>
            </div>
            <div>
              <p style={{ fontWeight: 'bold', color: 'black', fontSize: '12px', textAlign: 'right' }}>0,0003</p>
              <p style={{ fontWeight: 'bold', color: '#767f88', fontSize: '10px', textAlign: 'right' }}>$0,10 USD</p>
            </div>
          </button>
        </div>
      )}

      {selectedstack === 1 && (
        <div style={{ padding: '0px 20px' }}>
          <div className='row '>
            <div className='col-12 text-end'>
              <FontAwesomeIcon onClick={() => setselectedstack(0)} style={{ fontSize: '16px', color: 'gray', cursor: 'pointer', marginTop: '10px' }} icon={faClose} />
            </div>
            <div onClick={() => setradio1(1)} className='col-12 mt-3' style={{ width: '100%', margin: 'auto', cursor: 'pointer' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '10%' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '10px', border: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                    {radio1 == 1 && <div style={{ width: '15px', height: '15px', borderRadius: '10px', backgroundColor: 'black', textAlign: 'center' }}> </div>}
                  </div>
                </div>
                <div style={{ width: '90%' }}>
                  <p style={{ fontSize: 10, fontWeight: 'bold' }}>I want to stake my governance tokens for 48 hours minimum and to receive the equivalent in vote power.</p>
                </div>
              </div>
            </div>

            <div onClick={() => setradio1(2)} className='col-12 mt-2' style={{ width: '100%', margin: 'auto', cursor: 'pointer' }}>
              <div style={{ display: 'flex' }}>
                <div style={{ width: '10%' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '10px', border: '1px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                    {radio1 == 2 && <div style={{ width: '15px', height: '15px', borderRadius: '10px', backgroundColor: 'black', textAlign: 'center' }}> </div>}
                  </div>
                </div>
                <div style={{ width: '90%' }}>
                  <p style={{ fontSize: 10, fontWeight: 'bold' }}>I want to stake my governance tokens for 60 months minimum and to receive the equivalent in vote power and 2% governance tokens reward every 12 months in my wallets. --&gt; Please note that this action is irreversible.</p>
                </div>
              </div>
            </div>


            <div className='col-12 mt-3 text-end'>
              <div style={{ position: 'relative' }}>
                <input
                  type='number'
                  max={TokenBalance}
                  onChange={(e) => setgetTokenValue(e.target.value)}
                  value={getTokenValue}
                  style={{ borderRadius: '20px', border: '1px solid black', paddingRight: '70px', textAlign: 'right', width: '50%', fontWeight: 'bold' }}
                />

                <div
                  onClick={() => {
                    setgetTokenValue( TokenBalance !== "0.00" ?( Number(TokenBalance) - Number(0.004)):0)
                  }}
                  style={{ position: 'absolute', right: '5px', top: '5px', width: '50px', border: '1px solid gray', padding: '0px 0px', borderRadius: '20px', cursor: 'pointer' }}
                >
                  <p style={{ fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>Max</p>
                </div>
              </div>
            </div>

            <div className='col-12 mt-3 text-end'>
              <div
                onClick={() => {
                  stakToken();
                }}
                style={{ width: '50px', border: '1px solid black', padding: '3px 0px', borderRadius: '20px', cursor: 'pointer', float: 'right' }}
              >
                <p style={getTokenValue === '' ? { fontSize: '10px', textAlign: 'center', color: 'black', cursor: "not-allowed" } : { fontSize: '10px', textAlign: 'center', color: 'black', fontWeight: 'bold', cursor: "pointer" }}>
                  {
                    spinnerStake ? "Loading..." : " Go!"
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {state.selectedstack === 2 && (
        <div style={{ padding: '0px 20px' }}>
          <div className='row '>
            {/* ... other components ... */}

            <div className='col-12 mt-4 text-end'>
              <div style={{ position: 'relative' }}>
                <input
                  type='text'
                  max={state.tokens}
                  onChange={(value) => {
                    setState({
                      ...state,
                      newtoken: value.target.value,
                    });
                  }}
                  value={state.newtoken}
                  style={{ borderRadius: '20px', border: '1px solid black', paddingRight: '70px', textAlign: 'right', width: '50%', fontWeight: 'bold' }}
                />
                <div
                  onClick={() => {
                    getmax1();
                  }}
                  style={{ position: 'absolute', right: '5px', top: '5px', width: '50px', border: '1px solid gray', padding: '0px 0px', borderRadius: '20px', cursor: 'pointer' }}
                >
                  <p style={{ fontSize: '10px', textAlign: 'center', fontWeight: 'bold' }}>Max</p>
                </div>
              </div>
            </div>

            <div className='col-12 mt-3 text-end'>
              <div
                onClick={() => {
                  goback12();
                }}
                style={{ width: '50px', border: '1px solid black', padding: '3px 0px', borderRadius: '20px', cursor: 'pointer', float: 'right' }}
              >
                <p style={state.newtoken === '' ? { fontSize: '10px', textAlign: 'center', color: 'black' } : { fontSize: '10px', textAlign: 'center', color: 'black', fontWeight: 'bold' }}>Go!</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>

  )
}


export default Score_Component;