module.exports = (req, res, next) => {
  if (!req.session.flag || !req.session.web.isLoggedIn) {
    return res.redirect('/');
  }
  next();
};
