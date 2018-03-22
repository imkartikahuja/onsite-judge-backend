const mongoose = require('mongoose');

var Submission = mongoose.model('Submission', {
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
    default: new Date.now
  },
  language : {
    type: String,
  },
  status : {
    type: String
  }
});
