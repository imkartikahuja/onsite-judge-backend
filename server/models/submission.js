const mongoose = require('mongoose');
const moment = require('moment');

var Submission = mongoose.model('Submission', {
  code: {
    type:String,
    required: true
  },
  _problemID : {
  type: mongoose.Schema.Types.ObjectId,
  required: true
  },
  _contestID : {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  _userID : {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  time : {
    type : Date,
    default: moment()
  },
  language : {
    type: String
  },
  status : {
    type: String
  }
});

module.exports = {Submission};
