const mongoose = require('mongoose');

var Ranking = mongoose.model('Ranking',{
  _userID : {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  _contestID : {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  score: {
    type: Number
  },
  time : {
    type : Date
  },
  problems: [{
    _problemID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    problemName: {
      type: String,
      required: true
    },
    correctSubmission: {
      type: Number,
      required: true
    },
    wrongSubmission: {
      type: Number,
      required: true
    }
  }]
});

module.exports = {Ranking};
