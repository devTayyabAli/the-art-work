const cron = require('node-cron');
const Web3 = require("web3");
const ethUtil = require("ethereumjs-util");
const ethereum_address = require("ethereum-address");

const contractAddress = "0xdb84E7163322DcDC5d5bf5975935676b049f4444"; // Deployed manually
const abi = [{"inputs":[{"internalType":"contract IERC20","name":"_token","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipient","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"AirdropDistributed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"member","type":"address"}],"name":"NewMember","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"member","type":"address"}],"name":"ProfileCompleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"candidate","type":"address"},{"indexed":false,"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"ProposalSubmitted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"bool","name":"isLongTerm","type":"bool"}],"name":"Staked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"bool","name":"support","type":"bool"}],"name":"VoteCasted","type":"event"},{"inputs":[],"name":"Token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"UnStake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newMember","type":"address"}],"name":"addToWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_treasuryWallet","type":"address"}],"name":"addTreasuryWallet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"airdropAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"airdropCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"member","type":"address"},{"internalType":"address","name":"_sponser","type":"address"}],"name":"asignSponser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"blacklist","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"companyName","type":"string"},{"internalType":"string","name":"jobList","type":"string"},{"internalType":"string","name":"postalAddress","type":"string"},{"internalType":"string","name":"telephoneNumber","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"webLink","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"profilePicture","type":"string"},{"internalType":"address","name":"_sponser","type":"address"}],"name":"completeProfile","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"distributeRewards","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"members","outputs":[{"internalType":"bool","name":"isWhitelisted","type":"bool"},{"internalType":"bool","name":"isBlacklisted","type":"bool"},{"internalType":"bool","name":"rewardDistributed","type":"bool"},{"internalType":"uint256","name":"score","type":"uint256"},{"internalType":"uint256","name":"fors","type":"uint256"},{"internalType":"uint256","name":"againt","type":"uint256"},{"internalType":"address","name":"sponsors","type":"address"},{"internalType":"bool","name":"rewardStatus","type":"bool"},{"components":[{"internalType":"string","name":"companyName","type":"string"},{"internalType":"string","name":"jobList","type":"string"},{"internalType":"string","name":"postalAddress","type":"string"},{"internalType":"string","name":"telephoneNumber","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"string","name":"webLink","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"profilePicture","type":"string"}],"internalType":"struct DAO.Profile","name":"profile","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_time","type":"uint256"}],"name":"setVoteTime","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bool","name":"isLongTerm","type":"bool"}],"name":"stake","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"stakeTimes","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"times","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"treasuryWallet","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"memberAddress","type":"address"},{"internalType":"bool","name":"support","type":"bool"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"voteTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"whitelist","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]
const getReward = async () => {
    const web3 = new Web3('https://polygon-testnet.public.blastapi.io');
    let fromAddress = '0xcb06C621e1DCf9D5BB67Af79BEa90Ac626e4Ff38';
    let privateKey = '2817782db86070d764c41b898d0564c791747c8e35961b3bcb655565a804907b';
    cron.schedule('0 * * * *', async () => {
        try {
            if (!privateKey.startsWith("0x")) {
                privateKey = "0x" + privateKey;
            }
            let bufferedKey = ethUtil.toBuffer(privateKey);

            if (
                ethereum_address.isAddress(fromAddress) &&
                ethereum_address.isAddress(fromAddress) &&
                ethUtil.isValidPrivate(bufferedKey)
            ) {
                const contract = await new web3.eth.Contract(abi, contractAddress);
                let count;
                // web3.eth.defaultAccount = fromAddress;

                const tx_builder = await contract.methods.distributeRewards();
                let encoded_tx = tx_builder.encodeABI();

                let gasPrice = await web3.eth.getGasPrice();
                let transactionObject = {
                    nonce: web3.utils.toHex(count),
                    from: fromAddress,
                    gasPrice: web3.utils.toHex(gasPrice),
                    gasLimit: web3.utils.toHex(45276),
                    to: contractAddress,
                    data: encoded_tx,
                    chainId: 11155111,
                };

                web3.eth.accounts
                    .signTransaction(transactionObject, privateKey)
                    .then(async (signedTx) => {
                        web3.eth.sendSignedTransaction(
                            signedTx.rawTransaction,
                            async function (err, hash) {
                                if (!err) {
                                    console.log("hash is : ",  hash);
                                    setTimeout(async () => {
                                        let receipt = await web3.eth.getTransactionReceipt(hash)
                                        console.log("receipt", receipt);
                                        if (receipt?.status == true) {
                                            console.log("Transaction is in mining state", hash);

                                        } else {
                                            console.log("Transaction is Fail");

                                        }
                                    }, 10000);

                                } else {
                                    console.log(`Bad Request ${err}`);

                                }
                            }
                        );
                    })
                    .catch((err) => {
                        console.log(`Your private or public address is not correct`);

                    });
            } else {
                console.log(`Your private or public address is not correct`);

            }
        } catch (e) {
            console.log('invalid transaction signing', e);

        }


    });
}
module.exports = getReward;
