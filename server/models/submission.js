const mongoose = require('mongoose');

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
  time : {
    type : Date,
    default: Date.now
  },
  language : {
    type: String
  },
  status : {
    type: String
  }
});

module.exports = {Submission};
