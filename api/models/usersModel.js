const mongoose = require('mongoose');
const db = require('../connections/dbMaster');

const COLLECTION = 'users';

const usersSchema = new mongoose.Schema({
  metaMaskAddress: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
},
{
  collection: COLLECTION,
});

module.exports = db.model(COLLECTION, usersSchema);
