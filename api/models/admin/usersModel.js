const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const db = require('../../connections/dbMaster');

const COLLECTION = 'admin_users';

const adminUsersSchema = new mongoose.Schema({
  email: {
    type: String,
    default: 'admin@defixy.com',
  },
  password: {
    type: String,
  },
},
{
  collection: COLLECTION,
});

adminUsersSchema.pre('save', async function (cb) {
  try {
    const user = this;
    user.password = bcrypt.hashSync(this.password, 10);
    cb();
  } catch (error) {
    cb(error);
  }
});

adminUsersSchema.methods.comparePassword = function comparePassword(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = db.model(COLLECTION, adminUsersSchema);
