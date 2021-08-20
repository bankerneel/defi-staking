/* eslint-disable radix */
/* eslint-disable node/no-unpublished-require */
const Web3 = require('web3');
const ethUtil = require('ethereumjs-util');
const moment = require('moment');
require('dotenv').config();

const userDetails = require('../../models/metamaskModel');

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.ROPSTEN_INFURA_URL),
);
const logger = require('../../middleware/logger');
const TokenABI = require('../../../ethereum/build/contracts/DeFiXyToken.json');

const StakingABI = module.require(
  '../../../ethereum/build/contracts/DeFiXyStaking.json',
);
const tokenABI = TokenABI.abi;
const stakingABI = StakingABI.abi;
const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS;
const stakingContractAddress = process.env.STAKING_CONTRACT_ADDRESS;

const tokenContract = new web3.eth.Contract(
  JSON.parse(JSON.stringify(tokenABI)),
  tokenContractAddress,
);

const stakingContract = new web3.eth.Contract(
  JSON.parse(JSON.stringify(stakingABI)),
  stakingContractAddress,
);

module.exports = {
  getContractDetails: async () => {
    logger.info('Inside Get Contract Details');
    try {
      const totalStakes = await stakingContract.methods.totalStakes().call();
      const totalRewards = await stakingContract.methods.totalRewards().call();
      const newStakedTokens = totalStakes / 1e18;
      const details = {
        totalStakedTokens: newStakedTokens,
        totalTokenRewards: totalRewards / 1e18,
        tokenContractAddress,
      };
      return details;
    } catch (error) {
      logger.error('error', error);
      return error;
    }
  },
  getStakedUsersDetails: async (userAddress) => {
    logger.info('User Address', userAddress);
    logger.info('Inside getStakedUsersDetails Details');
    try {
      const address = ethUtil.toChecksumAddress(userAddress);
      const query = await userDetails.findOne({ walletAddress: address });
      let stakedTokens;
      if (query === null) {
        stakedTokens = 0;
      } else {
        stakedTokens = query.currentlyStakedTokens;
      }
      if (stakedTokens > 0) {
        return true;
      }
      return false;
    } catch (error) {
      logger.error('error', error);
      return error;
    }
  },
  createStakingDetails: async (userAddress) => {
    logger.info('Inside createStakingDetails service');
    try {
      const address = ethUtil.toChecksumAddress(userAddress);
      const details = await stakingContract.methods
        .getStakedUsersDetails(address)
        .call({
          from: address,
        });
      const userData = {
        walletAddress: address,
        currentlyStakedTokens: details[0],
        stakingTime: details[2] * 1000,
      };
      const query = await userDetails.create(userData);
      return query;
    } catch (error) {
      logger.error(error);
      return error;
    }
  },
  getUserBalanceDetails: async (userAddress) => {
    logger.info('Inside getUserBalanceDetails service');
    try {
      const address = ethUtil.toChecksumAddress(userAddress);
      const stakingDetails = await stakingContract.methods
        .getStakedUsersDetails(address)
        .call({
          from: address,
        });
      const balanceDetails = await tokenContract.methods
        .balanceOf(address)
        .call();
      const details = {
        userBalance: balanceDetails,
        userTotalStaked: stakingDetails[0],
        totalTimeOfStakedTokens: stakingDetails[1],
      };
      return details;
    } catch (error) {
      logger.error(error);
      return error;
    }
  },
  checkUserUnclaimedRewards: async (userAddress) => {
    logger.info('User Address', userAddress);
    logger.info('Inside checkUserUnclaimedRewards Details');
    try {
      const address = ethUtil.toChecksumAddress(userAddress);
      const query = await userDetails.findOne({ walletAddress: address });
      let unclaimedRewards;
      if (query === null) {
        unclaimedRewards = 0;
      } else {
        unclaimedRewards = query.userUnclaimedRewards;
      }
      if (unclaimedRewards > 0) {
        return true;
      }
      return false;
    } catch (error) {
      logger.error('error', error);
      return error;
    }
  },

  deleteStakingDetails: async (userAddress) => {
    logger.info('Inside deleteStakingDetails service');
    try {
      const address = ethUtil.toChecksumAddress(userAddress);
      const query = await userDetails.deleteOne({ walletAddress: address });
      return query;
    } catch (error) {
      logger.error(error);
      return error;
    }
  },

  dashboardInfo: async (userAddress) => {
    logger.info('Inside dashboardInfo service');
    try {
      const tokenBalance = await tokenContract.methods
        .balanceOf(userAddress)
        .call();
      const symbol = await tokenContract.methods.symbol().call();
      const query = await userDetails.findOne({ walletAddress: userAddress });

      let stakeTokens;
      let stakeTime;
      let stakeRank;
      let rate;
      let reward;

      if (query === null) {
        stakeTokens = 0;
        stakeTime = '';
        stakeRank = 0;
        rate = {
          rewardRate: 0,
          timeElapsed: 0,
          stakeDays: 0,
        };
        reward = {
          reward: 0,
          symbol,
        };
      } else {
        stakeTokens = query.currentlyStakedTokens;
        stakeTime = query.stakingTime;
        stakeRank = await module.exports.calculateStakeRank(userAddress);
        rate = await module.exports.calculateRewardRate(userAddress);
        reward = await module.exports.calculateReward(userAddress);
      }

      const result = {
        balance: tokenBalance / 1e18,
        stakeBalance: stakeTokens / 1e18,
        stakingTime: stakeTime,
        symbol,
        stakeRank,
        rate,
        reward,
      };
      return result;
    } catch (error) {
      logger.error(error);
      return error;
    }
  },

  balanceValidation: async (userAddress, amount) => {
    const tokenBalance = await tokenContract.methods
      .balanceOf(userAddress)
      .call();

    if (amount <= tokenBalance / 1e18) {
      return true;
    }
    return false;
  },

  calculateReward: async (userAddress) => {
    try {
      const timeInMs = Date.now();
      const symbol = await tokenContract.methods.symbol().call();
      const query = await userDetails.findOne({ walletAddress: userAddress });

      let reward = 0;
      if (query === null) {
        return {
          reward,
          symbol,
        };
      }

      const stakedTime = query.stakingTime;
      const stakeDate = new Date(stakedTime);
      const stakeEpoch = stakeDate.getTime();
      const stakeTimeInMs = timeInMs - stakeEpoch;
      const stakeTimeInMin = new Date(stakeTimeInMs);
      const stakeMins = moment
        .duration(stakeTimeInMin, 'milliseconds')
        .asMinutes();
      const timeElapsed = parseInt(stakeMins);
      const stakeAmount = query.currentlyStakedTokens / 1e18;
      if (timeElapsed >= 0 && timeElapsed <= 10080) {
        reward =
          ((stakeAmount * timeElapsed) / 3506400) *
          (1 + (0.25 / 10080) * timeElapsed);
      } else if (timeElapsed > 10080 && timeElapsed <= 20160) {
        reward =
          ((stakeAmount * timeElapsed) / 3506400) *
          (1.25 + (0.5 / 10080) * (timeElapsed - 10080));
      } else if (timeElapsed > 20160 && timeElapsed <= 30240) {
        reward =
          ((stakeAmount * timeElapsed) / 3506400) *
          (1.75 + (1.25 / 10080) * (timeElapsed - 20160));
      } else {
        reward = (3 * stakeAmount * timeElapsed) / 3506400;
      }
      return {
        reward,
        symbol,
      };
    } catch (error) {
      logger.error(error);
      return error;
    }
  },

  calculateRewardRate: async (userAddress) => {
    try {
      const timeInMs = Date.now();
      const query = await userDetails.findOne({ walletAddress: userAddress });
      let rewardRate = 0;
      let timeElapsed = 0;
      let stakeDays = 0;
      if (query === null) {
        return {
          rewardRate,
          timeElapsed,
          stakeDays,
        };
      }
      const stakedTime = query.stakingTime;
      const stakeDate = new Date(stakedTime);
      const stakeEpoch = stakeDate.getTime();
      const stakeTimeInMs = timeInMs - stakeEpoch;
      const stakeTimeInMin = new Date(stakeTimeInMs);
      const stakeMins = moment
        .duration(stakeTimeInMin, 'milliseconds')
        .asMinutes();
      stakeDays = moment.duration(stakeTimeInMin, 'milliseconds').asDays();
      timeElapsed = parseInt(stakeMins);
      if (timeElapsed >= 0 && timeElapsed <= 10080) {
        rewardRate = 15 * (1 + (0.25 / 10080) * timeElapsed);
      } else if (timeElapsed > 10080 && timeElapsed <= 20160) {
        rewardRate = 15 * (1.25 + (0.5 / 10080) * (timeElapsed - 10080));
      } else if (timeElapsed > 20160 && timeElapsed <= 30240) {
        rewardRate = 15 * (1.75 + (1.25 / 10080) * (timeElapsed - 20160));
      } else {
        rewardRate = 45;
      }
      rewardRate = Number(`${Math.round(`${rewardRate}e2`)}e-2`);
      const result = {
        rewardRate,
        timeElapsed,
        stakeDays,
      };
      return result;
    } catch (error) {
      logger.error(error);
      return error;
    }
  },

  calculateStakeRank: async (userAddress) => {
    try {
      const users = await userDetails.aggregate([
        {
          $sort: {
            currentlyStakedTokens: -1,
          },
        },
        {
          $group: {
            _id: null,
            wallets: {
              $push: {
                walletAddress: '$walletAddress',
                currentlyStakedTokens: '$currentlyStakedTokens',
              },
            },
          },
        },
        {
          $unwind: {
            path: '$wallets',
            includeArrayIndex: 'ranking',
          },
        },
        {
          $match: {
            'wallets.walletAddress': userAddress,
          },
        },
      ]);
      const stakeRank = users[0].ranking + 1;
      return stakeRank;
    } catch (error) {
      logger.error(error);
      return error;
    }
  },

  updateStakingTime: async (userAddress) => {
    try {
      const address = ethUtil.toChecksumAddress(userAddress);
      const details = await stakingContract.methods
        .getStakedUsersDetails(address)
        .call({
          from: address,
        });
      const query = await userDetails.updateOne(
        { walletAddress: userAddress },
        { stakingTime: parseInt(details[2]) * 1000 },
      );
      return query;
    } catch (error) {
      logger.error(error);
      return error;
    }
  },
  getUserStakingTime: async (userAddress) => {
    logger.info('User Address', userAddress);
    logger.info('Inside getUserStakingTime Details');
    try {
      const address = ethUtil.toChecksumAddress(userAddress);
      const query = await userDetails.findOne({ walletAddress: address });
      let stakedTime;
      if (query === null) {
        stakedTime = '';
        return stakedTime;
      }
      stakedTime = query.stakingTime;
      return stakedTime;
    } catch (error) {
      logger.error('error', error);
      return error;
    }
  },
};
