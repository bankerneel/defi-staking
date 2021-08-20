const express = require('express');

const router = express.Router();
const mnemonic = require('../../middleware/mnemonic-to-key');
const {
  index,
  depositRewards,
  withdrawRewards,
} = require('../../controller/admin/settings.controller');

router.get('/', index);
router.post('/deposit-reward', mnemonic.getPrivateKey, depositRewards);
router.post('/withdraw-reward', mnemonic.getPrivateKey, withdrawRewards);

module.exports = router;
