const _ = require('lodash')
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const cors = require('cors');
const moment = require('moment');

var {mongoose} = require('./db/mongoose');
var {Contest} = require('./models/contest');
var {Problem} = require('./models/problem');
var {User} = require('./models/user');
var {Submission} = require('./models/submission');
var {Ranking} = require('./models/ranking');
var {authenticate} = require('./middleware/authenticate');
var {compileCpp} = require('./compiler/cpp.js');

var app = express();

app.use(bodyParser.json());
app.use(cors());

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

app.post('/problems', (req,res) => {
  var body = _.pick(req.body, ['name'],['code'], ['mainText'],['input'],['output'],['constraints'],['example'],['time_limit'],['_contestID']);
  var problem = new Problem(body);

  problem.save().then((result) => {
    res.send(result);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/problems/find', (req,res) => {
  var id = req.body.id;

  Problem.find({
    _contestID : id
  }).then((probs) => {
    res.send({probs});
  },(e) => {
    res.send(400).send(e);
  });
});

app.post('/submit', authenticate , (req,res) => {
  var _problemID = req.body._problemID;
  var _contestID = req.body._contestID;
  var code = req.body.code;
  var language = req.body.language;
  var _userID = req.user._id;
  var submission;

  var time_limit;
  Problem.findOne({
    _id: _problemID
  }).then((prob) => {
    time_limit = prob.time_limit;
  });

  var status;
  if (language == 'cpp'){
    compileCpp(code,1200,_userID,(data) => {
      status = data;
      // console.log('DATA',status);
      submission = new Submission({_problemID,_contestID, _userID,code,language, status});
      submission.save().then((result) => {
        res.send(status);
      }, (e) => {
        res.status(400).send(e);
      });
    });
  }


  // submission.save().then((result) => {
  //   res.send(result);
  // }, (e) => {
  //   res.status(400).send(e);
  // });
  //

});

app.get('/mysubmissions',authenticate ,(req,res) => {
  var _userID = req.user._id;

  Submission.find({_userID}).then((result) => {
    res.send({result});
  } , (e) => {
    res.status(404).send(e);
  });
});

app.post('/signup', async (req,res) => {
  try {
    var body = _.pick(req.body, ['email'],['password']);
    var user = new User(body);
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth',token).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post('/login', async (req,res) => {
  try {
    const body = _.pick(req.body, ['email'],['password']);
    const user = await User.findByCredentials(body.email,body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth',token).send(user);
  } catch (e) {
    res.status(400).send();
  }
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
