const ethUtil = require('ethereumjs-util');
const userModel = require('../models/usersModel');

const { addMetamaskEntry } = require('../services/v1/metamaskService');
const { getContractDetails } = require('../services/v1/contractService');
const { handleError, handleResponse } = require('../config/requestHandler');
const logger = require('../middleware/logger');
const responseHelper = require('../helpers/responseHelper');

module.exports = {
  addMetamaskDetails: async ({ body }, res) => {
    logger.info('Inside addMetamaskDetails Controller');
    try {
      const { walletAddress, currentlyStakedTokens } = body;
      const entryDetails = {
        walletAddress,
        currentlyStakedTokens,
      };
      const addEntry = await addMetamaskEntry(entryDetails);
      handleResponse({
        res,
        msg: 'Successfully Added Details',
        data: addEntry,
      });
    } catch (error) {
      handleError({ res, error });
    }
  },
};

module.exports.index = async (req, res) => {
  const contractDetails = await getContractDetails();
  res.render('index', {
    title: 'DeFixy',
    activeBar: 'home',
    session: req.session.web ? req.session.web : req.session,
    contractDetail: contractDetails,
  });
};

module.exports.updateSession = (req, res) => {
  //   try {
  if (req.body.accountId !== undefined) {
    const webSession = {
      isLoggedIn: true,
      accountId: ethUtil.toChecksumAddress(req.body.accountId),
    };
    req.session.web = webSession;
    req.session.flag = true;
    return responseHelper.success(res, 'updated successfully');
  }
  return responseHelper.error(res, 'something went wrong!');
  //   } catch (error) {
  //     logger.error(error.message);
  //     return responseHelper.error(res, 'Something went wrong!', 500);
  //   }
};

module.exports.getChallenge = async (req, res) => {
  try {
    const metaAddress = ethUtil.toChecksumAddress(req.params.MetaAddress);
    const user = await userModel.findOne({
      metaMaskAddress: metaAddress,
      isDeleted: false,
    });
    const { challenge } = req.metaAuth;
    res.send({
      challenge,
      user,
    });
  } catch (error) {
    logger.error(error.message);
    return responseHelper.error(res, 'Something went wrong!', 500);
  }
};

module.exports.getRecovered = async (req, res) => {
  try {
    if (req.metaAuth.recovered) {
      if (req.params.Token === req.metaAuth.recovered) {
        const recovered = ethUtil.toChecksumAddress(req.metaAuth.recovered);

        const userObj = new userModel({
          metaMaskAddress: recovered,
        });

        await userObj.save();

        const webSession = {
          isLoggedIn: true,
          accountId: recovered,
        };
        req.session.web = webSession;
        req.session.flag = true;

        res.send(req.metaAuth.recovered);
      } else {
        return responseHelper.error(res, 'Something went wrong!', 500);
      }
    } else {
      // Sig did not match, invalid authentication
      res.status(400).send();
    }
  } catch (error) {
    logger.error(error.message);
    return responseHelper.error(res, 'Something went wrong!', 500);
  }
};

module.exports.privacyPolicy = (req, res) => {
  res.render('privacy-policy', {
    title: 'Privacy-Policy',
    activeBar: 'privacy-policy',
    session: [],
  });
};

module.exports.yandex = (req, res) => {
  res.render('yandex_73a7fb008e2edb73', {
    title: 'yandex_73a7fb008e2edb73',
    activeBar: 'yandex_73a7fb008e2edb73.html',
    session: [],
  });
};
module.exports.whitepaper = (req, res) => {
  res.redirect('/web/data/DeFiXy_WhitePaper1.0.pdf');
};

module.exports.termsAndConditions = (req, res) => {
  res.render('terms-and-condition', {
    title: 'Terms-and-Condition',
    activeBar: 'terms-and-condition',
    session: [],
  });
};

module.exports.getContractDetails = async (req, res) => {
  logger.info('Inside Get Contract Details Controller');
  try {
    const result = await getContractDetails();
    handleResponse({ res, msg: 'Contract Details', data: result });
  } catch (error) {
    handleError({ res, error });
  }
};

module.exports.checkSession = (req, res) => {
  if (!req.session.web.isLoggedIn) {
    return responseHelper.success(res, 'Failed');
  }
  return responseHelper.success(res, 'Success');
};
