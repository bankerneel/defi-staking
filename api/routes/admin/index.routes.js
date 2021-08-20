const express = require('express');

const router = express.Router();

const {
  index,
  authLogin,
  postUser,
} = require('../../controller/admin/index.controller');

router.get('/logout', (req, res) => {
  req.session.admin = {};
  res.redirect('/admin');
});

router.get('/', index);
router.post('/authentication', authLogin);
router.post('/post-user', postUser);

module.exports = router;
