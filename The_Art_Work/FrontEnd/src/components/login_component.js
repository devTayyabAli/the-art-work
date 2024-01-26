import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Navigate } from 'react-router-dom';
import logo from './images/avatar2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-bootstrap/Modal';
import Connection from '../connection';
import mask from './images/mask.png';

const Login_Component = () => {
  const [state, setState] = useState({
    test: 'home1',
    showmodal: false,
    sideshow: 'none',
    valid_email: false,
    valid_password: false,
    email: '',
    password: '',
    redirect: 0,
  });

  const signup = async () => {
    setState({
      ...state,
      valid_email: false,
      valid_password: false,
    });

    const { email, password } = state;

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
    } else {
      const api = Connection + 'login';

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
            alert(date);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (state.redirect === 1) {
    return <Navigate push to={`${process.env.PUBLIC_URL}/daovotes`} />;
  }
  if (state.redirect === 2) {
    return <Navigate push to={`${process.env.PUBLIC_URL}/myprofile`} />;
  }

  return (
    <div className="">
      <div className="d-flex" style={{ borderBottom: '1px solid gray', padding: '10px', alignItems: 'center' }}>
        <img src={logo} alt="test" className="img-fluid" style={{ width: '40px', height: '40px' }} />
        <p style={{ fontWeight: 'bold', color: 'black', marginLeft: '10px' }}>My Wallet</p>
      </div>

      <div style={{ padding: '20px' }}>
        <button className="d-flex wallet_btn1">
          <img src={mask} alt="test" className="img-fluid" style={{ width: '40px', height: '40px' }} />
          <p style={{ fontWeight: 'bold', color: 'black', marginLeft: '10px' }}>MetaMask</p>
        </button>
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

          <div className="d-flex justify-conntent-center" style={{ alignItems: 'center' }}>
            <button
              onClick={() => signup()}
              className=""
              style={{ backgroundColor: 'white', border: 'none', marginTop: '10px', marginLeft: '10px' }}
            >
              <p style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px', color: 'gray' }}>
                Create Account
              </p>
            </button>
            <button onClick={() => signup()} className="profile_btn2" style={{ marginLeft: 'auto' }}>
              <p style={{ fontSize: '10px', fontWeight: 'bold', textAlign: 'center', marginBottom: '0px', color: 'white' }}>
                Ok
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login_Component;
