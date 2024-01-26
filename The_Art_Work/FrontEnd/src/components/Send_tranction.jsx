import React, { useState } from 'react';

function SignMessage() {
  const [status, setStatus] = useState('');

  const handleSignMessage = async () => {
    try {
      // Check if MetaMask is installed
      if (window.ethereum) {
        // Request account access and check if the user is connected
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];

        // Replace 'YOUR_MESSAGE_TO_SIGN' with the actual message you want the user to sign
        const messageToSign = 'Hello, this is a message to sign!';

        // Request signature from the user
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [messageToSign, account],
        });
        setStatus(`Signature: ${signature}`);
      } else {
        setStatus('MetaMask not detected. Please install MetaMask extension.');
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <button onClick={handleSignMessage}>Sign Message</button>
      <div>{status}</div>
    </div>
  );
}

export default SignMessage;
