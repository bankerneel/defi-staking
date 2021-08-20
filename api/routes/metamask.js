const express = require('express');
const router = express.Router();

const metamask = require('../controller/index.controller');

router.post('/login', metamask.addMetamaskDetails);
module.exports = router;
