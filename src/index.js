import React from 'react';
// import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min";
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'
import { polygonMumbai} from 'viem/chains'
import { store } from './Redux/store';
import { Provider } from 'react-redux';

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '69c4cbeab754277b30bea2b4df141d53'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [polygonMumbai]
const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })


// const root = ReactDOM.createRoot(document.getElementById('root'));


ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <WagmiConfig config={wagmiConfig}>
        <App />
      </WagmiConfig>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
)
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
