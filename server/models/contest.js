const mongoose = require('mongoose');

var Contest = mongoose.model('Contest',{
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  startTime: {
    type: Number,
    required: true,
  },
  endTime: {
    type: Number,
    required: true,
  }
});

module.exports = {Contest};
