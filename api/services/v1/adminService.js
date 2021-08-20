const Web3 = require('web3');
require('dotenv').config();

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.MAINNET_INFURA_URL));
const moment = require('moment');
const logger = require('../../middleware/logger');
const userDetails = require('../../models/metamaskModel');
const { calculateReward } = require('./contractService');
const Tx = require('ethereumjs-tx').Transaction;

const StakingABI = module.require('../../../ethereum/build/contracts/DeFiXyStaking.json');
const stakingABI = StakingABI.abi;
const stakingContractAddress = process.env.STAKING_CONTRACT_ADDRESS;

const stakingContract = new web3.eth.Contract(
  JSON.parse(JSON.stringify(stakingABI)),
  stakingContractAddress,
);
module.exports = {
  setPlatformKey: async (key, owner) => {
    logger.info('Inside setPlatformKey Details');
    try {
      const { privateKey } = req;
      const nonce = await web3.eth.getTransactionCount(owner);

      const rawTx = {
        nonce: web3.utils.toHex(nonce),
        from: owner,
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'Gwei')),
        gasLimit: web3.utils.toHex('3000000'),
        to: stakingContractAddress,
        value: '0x00',
        data: stakingContract.methods.setPlatformKey(key).encodeABI(),
      };

      const tx = new Tx(rawTx, { chain: 'mainnet' });
      tx.sign(privateKey);

      const serializedTx = await tx.serialize();

      const result = await web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
        .on('receipt', console.log);

      return result;
    } catch (err) {
      logger.error(err);
      return false;
    }
  },
  depositReward: async (amount, owner, privateKey) => {
    logger.info('Inside depositReward Details');
    try {
      const Amount = web3.utils.toWei(amount.toString(), 'ether');

      const nonce = await web3.eth.getTransactionCount(owner);

      const rawTx = {
        nonce: web3.utils.toHex(nonce),
        from: owner,
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'Gwei')),
        gasLimit: web3.utils.toHex('3000000'),
        to: stakingContractAddress,
        value: '0x00',
        data: stakingContract.methods.depositReward(Amount).encodeABI(),
      };

      const tx = new Tx(rawTx, { chain: 'mainnet' });
      tx.sign(privateKey);

      const serializedTx = await tx.serialize();

      const result = await web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
        .on('receipt', console.log);

      return result;
    } catch (err) {
      logger.error(err);
      return false;
    }
  },
  withdrawReward: async (amount, owner, privateKey) => {
    logger.info('Inside withdrawReward Details');
    try {
      const Amount = web3.utils.toWei(amount.toString(), 'ether');

      const nonce = await web3.eth.getTransactionCount(owner);

      const rawTx = {
        nonce: web3.utils.toHex(nonce),
        from: owner,
        gasPrice: web3.utils.toHex(web3.utils.toWei('10', 'Gwei')),
        gasLimit: web3.utils.toHex('3000000'),
        to: stakingContractAddress,
        value: '0x00',
        data: stakingContract.methods.withdrawReward(Amount).encodeABI(),
      };

      const tx = new Tx(rawTx, { chain: 'mainnet' });
      tx.sign(privateKey);

      const serializedTx = await tx.serialize();

      const result = await web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`)
        .on('receipt', console.log);

      return result;
    } catch (err) {
      logger.error(err);
      return false;
    }
  },
  getRewardDeposits: async (owner) => {
    logger.info('Inside getRewardDeposits Details');
    try {
      const reward = await stakingContract.methods.getRewardDeposits().call({ from: owner });
      return reward;
    } catch (error) {
      logger.error('error', error);
      return error;
    }
  },
  getAllUserDetails: async () => {
    logger.info('Inside getAllUserDetails service');
    try {
      let walletAddress;
      let stakedTokens;
      let rewardsEarned;
      let stakedTime;
      let result = {};
      const resultData = [];
      const query = await userDetails.find({});
      if (query === null) {
        result = {
          walletAddress: 0,
          stakedTokens: 0,
          rewardsEarned: '0 DFX',
          stakedTime: 0,
        };
        resultData.push(result);
        return resultData;
      }
      for (let i = 0; i < query.length; i++) {
        walletAddress = query[i].walletAddress;
        stakedTokens = query[i].currentlyStakedTokens;
        rewardsEarned = await calculateReward(walletAddress);
        stakedTime = query[i].stakingTime;

        result = {
          userAddresses: walletAddress,
          userStakedTokens: stakedTokens / 1e18,
          userRewardsEarned: `${rewardsEarned.reward.toFixed(2).toString()} ${rewardsEarned.symbol.toString()}`,
          userStakingTime: moment(stakedTime).format('MM-DD-YYYY HH:mm'),
        };
        resultData.push(result);
      }
      return resultData;
    } catch (error) {
      logger.error('error', error);
      return error;
    }
  },
};
