const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ =require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    minlength: 1,
    trim: true,
    unique: true,
    validate: {
      validator:  validator.isEmail,
      message: '{VALUE} is not valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.toJSON = function () {     //to return only id n email else it will return everthing include password so we overwrite moongoose method
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject,['_id','email']);
};

UserSchema.methods.generateAuthToken = function () {
  var user = this;      //now we have access to doc which it is called on
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(),access}, process.env.JWT_SECRET).toString();

  // user.tokens.push({access,token});
  user.tokens = user.tokens.concat([{access,token}]);

  return user.save().then(() => {
    return token;
  });
};

UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {                    //pull operator of mongoose remove element from array
      tokens: {
        token: token
      }
    }
  })
};

UserSchema.statics.findByToken = function (token) {       //model method
  var User = this;                        //called by model instead of instance
  var decoded;

  try {
      decoded = jwt.verify(token,process.env.JWT_SECRET);
  } catch (e) {
      // return new Promise(function(resolve, reject) {
      //   reject();
      // });
      return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email,password) {
  var User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    // bcrypt only uses callbacks but we want to return promise
    return new Promise((resolve, reject) => {
      bcrypt.compare(password,user.password, (err,res) => {
        if(res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre('save', function (next) {
  var user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10, (err,salt) => {
      bcrypt.hash(user.password,salt, (err,hash) => {
          user.password = hash;
          next();
      });
    });
  }   else {
    next();
  }
});

var User = mongoose.model('User',UserSchema);

module.exports = {User};
