const {
  getAllUserDetails,
} = require('../../services/v1/adminService');

module.exports.index = async (req, res) => {
  res.render('admin/transaction', {
    title: 'DeFixy-admin',
    activeBar: 'transaction',
  });
};

module.exports.getTransactions = async (req, res) => {
  const transactionDetail = await getAllUserDetails();
  const resultObj = {
    data: transactionDetail,
  };
  res.send(resultObj);
};
