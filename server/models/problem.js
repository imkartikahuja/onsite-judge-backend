const mongoose = require('mongoose');

var Problem = mongoose.model('Problem', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  mainText: {
    type: String,
    required: true,
    minlength: 1
  },
  input: {
    type: String,
    required: true,
    minlength: 1
  },
  output: {
    type: String,
    required: true,
    minlength: 1
  },
  constraints: {
    type: String,
    required: true,
    minlength: 1
  },
  example: {
    type: String,
    required: true,
    minlength: 1
  },
  _contestID: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Problem};
