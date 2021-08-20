const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
// const defaultConfig = require('./config/default')
const infuraUrl = 'https://ropsten.infura.io/v3/6359ad01c06541b6b173c25220e22f8a';
const mnemonic = 'rice special dirt town fabric exile raccoon say disorder resist manual gain';
// const logger = require('./middleware/logger')

const web3 = new Web3(infuraUrl);

module.exports = web3;
