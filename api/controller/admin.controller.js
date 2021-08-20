const logger = require('../middleware/logger');
const {
  handleError,
  handleResponse,
} = require('../config/requestHandler');
const {
  setPlatformKey, depositReward, withdrawReward, getRewardDeposits,
} = require('../services/v1/adminService');

module.exports.setPlatformKey = async (req, res) => {
  logger.info('Inside setPlatformKey Controller');
  try {
    const result = await setPlatformKey(req.body.key, req.body.address);
    handleResponse({ res, msg: 'Platform Key', data: result });
  } catch (error) {
    handleError({ res, error });
  }
};

module.exports.depositReward = async (req, res) => {
  logger.info('Inside depositReward Controller');
  try {
    const result = await depositReward(req.body.amount, req.body.address);
    handleResponse({ res, msg: 'Deposit Reward', data: result });
  } catch (error) {
    handleError({ res, error });
  }
};

module.exports.withdrawReward = async (req, res) => {
  logger.info('Inside withdrawReward Controller');
  try {
    const result = await withdrawReward(req.body.amount, req.body.address);
    handleResponse({ res, msg: 'Withdraw Reward', data: result });
  } catch (error) {
    handleError({ res, error });
  }
};

module.exports.getRewardDeposits = async (req, res) => {
  logger.info('Inside getRewardDeposits Controller');
  try {
    const result = await getRewardDeposits(req.body.address);
    handleResponse({ res, msg: 'Get Reward Deposits', data: result });
  } catch (error) {
    handleError({ res, error });
  }
};
