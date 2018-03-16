const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/OnsiteJudge').then(() => {
   console.log('Connected to Mongo instance.');
}, (err) => {
  console.log('Error connecting to Mongo instance: ', err);
});

module.export = { mongoose };
