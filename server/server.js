const _ = require('lodash')
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Contest} = require('./models/contest');
var {Problem} = require('./models/problem');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');


var app = express();

app.use(bodyParser.json());

//for logging request
app.use((req,res,next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  next();
});

app.post('/contests', (req,res) => {
  var contest = new Contest({
    name: req.body.name,
    startTime: req.body.startTime,
    endTime: req.body.endTime
  });

  contest.save().then((result) => {
    res.send(result);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/contests', (req,res) => {
  Contest.find({}).then((contests) => {
    res.send({contests});
  }, (e) => {
    res.status(400).send(e);
  });
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
