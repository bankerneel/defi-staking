module.exports = (req, res, next) => {
  if (!req.session.flag || !req.session.admin.isLoggedIn) {
    return res.redirect('/admin');
  }
  next();
};
