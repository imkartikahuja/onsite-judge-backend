const mongoose = require('mongoose');

var Contest = mongoose.model('Contest',{
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  }
});

module.exports = {Contest};
