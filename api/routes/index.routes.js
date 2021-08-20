const express = require('express');

const router = express.Router();
const MetaAuth = require('meta-auth');

const metaAuth = new MetaAuth();

const {
  index,
  checkSession,
  getChallenge,
  getRecovered,
  updateSession,
  privacyPolicy,
  termsAndConditions,
  getContractDetails,
  whitepaper,
  yandex,
} = require('../controller/index.controller');
const { syncData } = require('../controller/dashboard.controller');
router.get('/logout', (req, res) => {
  req.session.web = {};
  res.send('destroyed');
});
// eslint-disable-next-line quotes
router.get('/', index);
router.get('/auth-check', checkSession);
router.post('/account-update', updateSession);
router.get('/auth/:MetaAddress', metaAuth, getChallenge);
router.get('/auth/:MetaMessage/:MetaSignature/:Token', metaAuth, getRecovered);
router.get('/privacy-policy', privacyPolicy);
router.get('/terms-and-condition', termsAndConditions);
router.get('/getContractDetails', getContractDetails);
router.get('/getContractDetails', getContractDetails);
router.get('/whitepaper', whitepaper);
router.get('/yandex_73a7fb008e2edb73.html', yandex);
router.get('/syncBlockchainData', syncData);

module.exports = router;
