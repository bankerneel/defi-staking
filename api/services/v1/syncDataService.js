/* eslint-disable radix */
/* eslint-disable node/no-unpublished-require */
const axios = require('axios');
const Web3 = require('web3');
const ethUtil = require('ethereumjs-util');
require('dotenv').config();

const userDetails = require('../../models/metamaskModel');

const apikey = process.env.ETHERSCAN_API_KEY;
const API_URL = process.env.ETHERSCAN_API_URL;
const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.ROPSTEN_INFURA_URL),
);
const logger = require('../../middleware/logger');

const StakingABI = module.require(
  '../../../ethereum/build/contracts/DeFiXyStaking.json',
);
const stakingABI = StakingABI.abi;
const stakingContractAddress = process.env.STAKING_CONTRACT_ADDRESS;

const stakingContract = new web3.eth.Contract(
  JSON.parse(JSON.stringify(stakingABI)),
  stakingContractAddress,
);

const { createStakingDetails } = require('./contractService');

module.exports = {
  // user while unStaking of Tokens
  updateTransactionHash: async (userAddress, txHash) => {
    const address = ethUtil.toChecksumAddress(userAddress);
    const query = await userDetails.updateOne(
      { walletAddress: address },
      { transactionHash: txHash },
    );
    return query;
  },
  syncData: async (userAddress) => {
    logger.info('Inside syncData service');
    try {
      const address = ethUtil.toChecksumAddress(userAddress);
      const walletAddress = await userDetails.findOne({ walletAddress: address });
      // Checks if Wallet exist or not
      if (walletAddress) {
        logger.info('Wallet Address Found');
        // When ClaimReward is done but not updated on DB
        if (walletAddress.transactionHash === '') {
          logger.info('Transaction Hash Null');
          const details = await stakingContract.methods
            .getStakedUsersDetails(address)
            .call({
              from: address,
            });
          const query = await userDetails.updateOne(
            { walletAddress: address },
            { stakingTime: parseInt(details[2]) * 1000, currentlyStakedTokens: parseInt(details[0]) },
          );
          return query;
        }
        logger.info('Transaction Hash Exists');
        // else: Delete Data after unstake
        const txHash = walletAddress.transactionHash;
        const apiCall = {
          method: 'get',
          url: `${API_URL}/api?module=transaction&action=gettxreceiptstatus&txhash=${txHash}&apikey=${apikey}`,
        };
        const response = await axios(apiCall);
        // check status of pending transaction and update on DB
        if (response.data.result.status === '1') {
          logger.info('Transaction Status: Success');
          const query = await userDetails.deleteOne({ walletAddress: address });
          return query;
        }
        logger.info('Transaction Status: Pending');
        // else: the transaction is pending
        return 'pending';
      }
      logger.info('Wallet Not Found, Adding Entry in Database');
      // else: Wallet Data doesn't exist on DB
      const addStakingDetails = await createStakingDetails(address);
      return addStakingDetails;
    } catch (error) {
      logger.error(error);
      return error;
    }
  },
};
