const bip39 = require('bip39');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');
const logger = require('./logger');
require('dotenv').config();

exports.getPrivateKey = async (req, res, next) => {
  try {
    const mnemonic = process.env.ADMIN_MNEMONIC;
    const seed = await bip39.mnemonicToSeed(mnemonic);// creates seed buffer
    const root = hdkey.fromMasterSeed(seed);
    const masterPrivateKey = root.privateKey.toString('hex');
    const addrNode = root.derive("m/44'/60'/0'/0/0");
    // const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
    // const addr = ethUtil.publicToAddress(pubKey).toString('hex');
    // const address = ethUtil.toChecksumAddress(addr);

    req.privateKey = addrNode._privateKey;
    next();
  } catch (err) {
    logger.error('error', err);
    return err;
  }
};
