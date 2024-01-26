import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import logo from './images/avatar2.png';
import mask from './images/mask.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-bootstrap/Modal';
import Connection from '../connection';
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import useWallectConnect from '../hooks/useWallectConnect';


const Wallet_Component = () => {
  const { chain } = useNetwork();
  const { chains, switchNetwork } = useSwitchNetwork();
  const { address } = useAccount();
  const { open } = useWeb3Modal();
  const [connectWallect] = useWallectConnect()

  const [state, setState] = useState({
    test: 'home1',
    showmodal: false,
    sideshow: 'none',
    show_signup_form: false,
    email: '',
    password: '',
    c_password: '',
    valid_email: false,
    valid_password: false,
    valid_c_password: false,
    redirect: false,
    login_password: '',
    login_email: '',
    signup: true,
  });

  const showsignup = () => {
    setState({ ...state, show_signup_form: true });
  };







  const signup = async () => {
    setState({
      ...state,
      valid_email: false,
      valid_password: false,
      valid_c_password: false,
    });

    const { email, password, c_password } = state;

    if (email === '') {
      setState({
        ...state,
        valid_email: true,
        error_message: 'Email is required.',
      });
    } else if (password === '') {
      setState({
        ...state,
        valid_password: true,
        error_message: 'Password is required.',
      });
    } else if (password !== c_password) {
      setState({
        ...state,
        valid_c_password: true,
        error_message: 'Confirm password does not match.',
      });
    } else {
      const api = Connection;

      try {
        const response = await fetch(api, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: `email=${email}&password=${password}`,
        });

        const data = await response.json();

        if (data.response === 'email already exist') {
          setState({
            ...state,
            valid_c_password: true,
            error_message: 'Email already exists',
          });
        } else {
          localStorage.setItem('customer', JSON.stringify(data));
          setState({ ...state, redirect: 1 });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const login = async () => {
    setState({
      ...state,
      valid_email: false,
      valid_password: false,
    });

    const { login_email, login_password } = state;

    if (login_email === '') {
      setState({
        ...state,
        valid_email: true,
        error_message: 'Email is required.',
      });
    } else if (login_password === '') {
      setState({
        ...state,
        valid_password: true,
        error_message: 'Password is required.',
      });
    } else {
      const api = Connection + 'login';

      try {
        const response = await fetch(api, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: `email=${login_email}&password=${login_password}`,
        });

        const data = await response.json();

        if (data.response === 'fail') {
          setState({
            ...state,
            valid_password: true,
            error_message: 'Account does not exist.',
          });
        } else {
          const hasRecord = data.response;
          const type = hasRecord[0].type;
          const date = hasRecord[0].date;

          if (type === 'Refused') {
            setState({
              ...state,
              valid_password: true,
              error_message: 'Your account is blocked',
            });
          } else {
            localStorage.setItem('customer', JSON.stringify(data.response));
            if (date === null || date === '' || date === 'null') {
              setState({
                ...state,
                sideshow: '',
                redirect: 1,
              });
            } else {
              window.location.reload(false);
              setState({
                ...state,
                sideshow: '',
                redirect: 2,
              });
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (state.redirect === 1) {
    return <Navigate push to={`${process.env.PUBLIC_URL}/myprofile`} />;
  }

  if (state.redirect === 2) {
    return <Navigate push to={`${process.env.PUBLIC_URL}/daovotes`} />;
  }

  return (
    <div className="">
      <div className="d-flex" style={{ borderBottom: '1px solid gray', padding: '10px', alignItems: 'center' }}>
        <img src={logo} alt="test" className="img-fluid" style={{ width: '40px', height: '40px' }} />
        <p style={{ fontWeight: 'bold', color: 'black', marginLeft: '10px' }}>My Wallet</p>
      </div>

      <div style={{ padding: '20px' }}>
        <button className="d-flex wallet_btn1"
          onClick={() =>
            connectWallect()
          }
        >
          {address ? (
            // chain?.id == chains[0]?.id || chain?.id == chains[1]?.id ? (
              address ? (
                <>
                  {`${address.substring(0, 6)}...${address.substring(
                    address.length - 4
                  )}`}
                </>
              ) : (
                <>
                  <img src={mask} alt="test" className="img-fluid" style={{ width: '40px', height: '40px' }} />
                  <p style={{ fontWeight: 'bold', color: 'black', marginLeft: '10px' }}>MetaMask</p>
                </>
              )
            // ) : (
            //   "Switch NewWork"
            // )
          ) : (
            <>
              <img src={mask} alt="test" className="img-fluid" style={{ width: '40px', height: '40px' }} />
              <p style={{ fontWeight: 'bold', color: 'black', marginLeft: '10px' }}>MetaMask</p>
            </>
          )}

        </button>

        {/* {state.show_signup_form && (
          <div>
            {state.signup ? (
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={state.email}
                  onChange={(value) => setState({ ...state, email: value.target.value, error_message: '' })}
                  className="input1"
                />
                {state.valid_email && (
                  <span style={{ fontSize: '10px', color: 'red', marginLeft: '10px', fontWeight: 'bold' }}>
                    {state.error_message}
                  </span>
                )}

                <input
                  type="password"
                  placeholder="Password"
                  value={state.password}
                  onChange={(value) => setState({ ...state, password: value.target.value, error_message: '' })}
                  className="input1"
                />
                {state.valid_password && (
                  <span style={{ fontSize: '10px', color: 'red', marginLeft: '10px', fontWeight: 'bold' }}>
                    {state.error_message}
                  </span>
                )}

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={state.c_password}
                  onChange={(value) => setState({ ...state, c_password: value.target.value, error_message: '' })}
                  className="input1"
                />
                {state.valid_c_password && (
                  <span style={{ fontSize: '10px', color: 'red', marginLeft: '10px', fontWeight: 'bold' }}>
                    {state.error_message}
                  </span>
                )}

                <div className="d-flex justify-conntent-center" style={{ alignItems: 'center' }}>
                  <button
                    onClick={() => setState({ ...state, signup: false })}
                    className=""
                    style={{ backgroundColor: 'white', border: 'none', marginTop: '10px', marginLeft: '10px' }}
                  >
                    <p style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px', color: 'gray' }}>
                      Sign in
                    </p>
                  </button>

                  <button onClick={signup} className="profile_btn2" style={{ marginLeft: 'auto' }}>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px', color: 'white' }}>
                      Join now
                    </p>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={state.login_email}
                  onChange={(value) => setState({ ...state, login_email: value.target.value, error_message: '' })}
                  className="input1"
                />
                {state.valid_email && (
                  <span style={{ fontSize: '10px', color: 'red', marginLeft: '10px', fontWeight: 'bold' }}>
                    {state.error_message}
                  </span>
                )}
                <input
                  type="password"
                  placeholder="Password"
                  value={state.login_password}
                  onChange={(value) => setState({ ...state, login_password: value.target.value, error_message: '' })}
                  className="input1"
                />
                {state.valid_password && (
                  <span style={{ fontSize: '10px', color: 'red', marginLeft: '10px', fontWeight: 'bold' }}>
                    {state.error_message}
                  </span>
                )}

                <div className="d-flex justify-conntent-center" style={{ alignItems: 'center' }}>
                  <button
                    onClick={() => setState({ ...state, signup: true })}
                    className=""
                    style={{ backgroundColor: 'white', border: 'none', marginTop: '10px', marginLeft: '10px' }}
                  >
                    <p style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px', color: 'gray' }}>
                      Create Account
                    </p>
                  </button>
                  <button onClick={login} className="profile_btn2" style={{ marginLeft: 'auto' }}>
                    <p style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px', color: 'white' }}>Ok</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Wallet_Component;
