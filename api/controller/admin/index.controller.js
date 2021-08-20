const userModel = require('../../models/admin/usersModel');

module.exports.index = async (req, res) => {
  res.render('admin/index', {
    title: 'DeFixy-admin',
    activeBar: 'login',
  });
};

module.exports.authLogin = async (req, res) => {
  const form = req.body;

  const userData = await userModel.findOne({
    email: form.email,
  });
  if (userData) {
    if (userData.comparePassword(form.password)) {
      const adminSession = {
        isLoggedIn: true,
        userId: userData._id,
        userEmail: userData.email,
      };
      req.session.admin = adminSession;
      req.session.flag = true;
      res.send({
        status: 1,
        message: 'Login successfully',
      });
    } else {
      res.send({
        status: 0,
        message: 'Invalid Email or Password',
      });
    }
  } else {
    res.send({
      status: 0,
      message: 'Invalid Email or Password',
    });
  }
};

module.exports.postUser = (req, res) => {
  const obj = new userModel({
    email: req.body.email,
    password: req.body.password,
  });
  obj.save();
};
