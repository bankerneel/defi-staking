const express = require('express');

const router = express.Router();

const {
  index,
  createStakingDetail,
  deleteStakingDetail,
  checkTokens,
  getUpdatedReward,
  updateStakeTime,
  getStakeTime,
  getRewardRate,
  syncData,
  updateTransactionHash
} = require('../controller/dashboard.controller');

// const metamask = require('./metamask');
// router.use('/metamask', metamask);
router.get('/', index);
router.post('/createStakingDetail', createStakingDetail);
router.post('/deleteStakingDetail', deleteStakingDetail);
router.get('/check-tokens/:tokens', checkTokens);
router.get('/update-reward', getUpdatedReward);
router.post('/updateStakingTime', updateStakeTime);
router.get('/stake-time', getStakeTime);
router.get('/update-reward-rate', getRewardRate);
router.post('/syncBlockchainData', syncData);
router.post('/updateTransactionHash', updateTransactionHash);
module.exports = router;
