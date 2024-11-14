const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const UserSchema = new Schema({
  username: {type: String, required: true, min: 4, unique: true},
  password: {type: String, required: true},
});

const UserModel = model('User', UserSchema);

module.exports = UserModel;

// const mongoose = require("mongoose");
 
// const userSchema = new mongoose.Schema({
//   // name: { type: String, required: true },
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// const User = mongoose.model("User", userSchema);

// module.exports = User;

// const mongoose = require("mongoose");
// const { Schema, model } = mongoose;
// // user schema

// const UserSchema = new Schema({
//   name: { type: String, required: true },
//   username: { type: String, required: true, min: 4, unique: true }, // validation
//   password: { type: String, required: true },
// });

// // create model

// const UserModel = model("User", UserSchema);

// module.exports = UserModel;
