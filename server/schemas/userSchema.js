const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: String,
    email:String,
    password:String
  });
module.exports =  User = mongoose.model('User',UserSchema,'users_global');