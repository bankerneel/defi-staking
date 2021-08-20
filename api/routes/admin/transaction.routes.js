const express = require('express');

const router = express.Router();

const {
  index,
  getTransactions,
} = require('../../controller/admin/transaction.controller');

router.get('/', index);
router.get('/get-transactions', getTransactions);

module.exports = router;
