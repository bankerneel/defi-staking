const {
  getStakedUsersDetails,
  createStakingDetails,
  deleteStakingDetails,
  dashboardInfo,
  balanceValidation,
  calculateReward,
  getUserStakingTime,
  calculateRewardRate,
  updateStakingTime,
} = require('../services/v1/contractService');
const {
  syncData,
  updateTransactionHash,
} = require('../services/v1/syncDataService');
require('dotenv').config();

const responseHelper = require('../helpers/responseHelper');
const logger = require('../middleware/logger');

module.exports.index = async (req, res) => {
  const address = req.session.web.accountId;
  const stakedUser = await getStakedUsersDetails(address);
  const dashboardData = await dashboardInfo(address);

  res.render('dashboard', {
    title: 'DeFixy',
    activeBar: 'dashboard',
    session: req.session.web,
    stakeUser: stakedUser,
    dashboard: dashboardData,
  });
};

module.exports.createStakingDetail = async (req, res) => {
  try {
    const metaAddress = req.session.web.accountId;
    const createStakeData = await createStakingDetails(metaAddress);
    if (createStakeData) {
      return responseHelper.success(res, 'Success');
    }
    return responseHelper.error(res, 'Failed!', 500);
  } catch (error) {
    logger.error('error', error);
    return responseHelper.error(res, 'Failed', 500);
  }
};

module.exports.deleteStakingDetail = async (req, res) => {
  try {
    const metaAddress = req.session.web.accountId;
    const deleteStakeData = await deleteStakingDetails(metaAddress);
    if (deleteStakeData) {
      return responseHelper.success(res, 'Success');
    }
    return responseHelper.error(res, 'Failed!', 500);
  } catch (error) {
    logger.error('error', error);
    return responseHelper.error(res, 'Failed', 500);
  }
};

module.exports.checkTokens = async (req, res) => {
  try {
    const metaAddress = req.session.web.accountId;
    const { tokens } = req.params;
    const balanceCheck = await balanceValidation(metaAddress, tokens);
    if (balanceCheck) {
      return responseHelper.success(res, 'true', process.env.PLATFORM_KEY);
    }
    return responseHelper.success(res, 'false');
  } catch (error) {
    logger.error('error', error);
    return responseHelper.error(res, 'Failed', 500);
  }
};

module.exports.getUpdatedReward = async (req, res) => {
  try {
    const metaAddress = req.session.web.accountId;
    const reward = await calculateReward(metaAddress);
    if (reward) {
      const new_Data = {
        rewards: reward,
        platformKey: process.env.PLATFORM_KEY,
      };
      return responseHelper.success(res, 'Success', new_Data);
    }
    return responseHelper.success(res, 'Failed');
  } catch (error) {
    logger.error('error', error);
    return responseHelper.error(res, 'Failed', 500);
  }
};

module.exports.updateStakeTime = async (req, res) => {
  try {
    const metaAddress = req.session.web.accountId;
    const stakeTime = await updateStakingTime(metaAddress);
    if (stakeTime) {
      return responseHelper.success(res, 'Success');
    }
    return responseHelper.success(res, 'Failed');
  } catch (error) {
    logger.error('error', error);
    return responseHelper.error(res, 'Failed', 500);
  }
};

module.exports.getStakeTime = async (req, res) => {
  try {
    const metaAddress = req.session.web.accountId;
    const stakeTime = await getUserStakingTime(metaAddress);
    return responseHelper.success(res, 'Success', stakeTime);
  } catch (error) {
    logger.error('error', error);
    return responseHelper.error(res, 'Failed', 500);
  }
};

module.exports.getRewardRate = async (req, res) => {
  try {
    const metaAddress = req.session.web.accountId;
    const rewardRate = await calculateRewardRate(metaAddress);
    if (rewardRate) {
      return responseHelper.success(res, 'Success', rewardRate);
    }
    return responseHelper.success(res, 'Failed');
  } catch (error) {
    logger.error('error', error);
    return responseHelper.error(res, 'Failed', 500);
  }
};

module.exports.syncData = async (req, res) => {
  try {
    logger.info('Inside syncData controller');
    const metaAddress = req.session.web.accountId;
    const resp = await syncData(metaAddress);
    if (resp) {
      logger.info(`Data Response: ${resp}`);
      return responseHelper.success(res, 'Success', resp);
    }
    return responseHelper.success(res, 'Failed');
  } catch (error) {
    logger.error('error', error);
    return responseHelper.error(res, 'Failed', 500);
  }
};

module.exports.updateTransactionHash = async (req, res) => {
  try {
    const txHash = req.body.txhash;
    // return false;
    const metaAddress = req.session.web.accountId;
    const resp = await updateTransactionHash(metaAddress, txHash);
    if (resp) {
      return responseHelper.success(res, 'Success', resp);
    }
    return responseHelper.success(res, 'Failed');
  } catch (error) {
    logger.error('error', error);
    return responseHelper.error(res, 'Failed', 500);
  }
};
