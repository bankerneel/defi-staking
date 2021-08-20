const mongoose = require('mongoose');
const db = require('../connections/dbMaster');

const MetamaskSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
  },
  currentlyStakedTokens: {
    type: mongoose.Types.Decimal128,
    required: true,
    default: 0,
  },
  stakingTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  transactionHash: {
    type: String,
    required: false,
    default: '',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

MetamaskSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.currentlyStakedTokens = ret.currentlyStakedTokens.toString();
    return ret;
  },
});

module.exports = db.model('metamaskDetails', MetamaskSchema);
