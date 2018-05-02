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

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    // res.setHeader('Access-Control-Allow-Origin', 'http://192.168.43.189:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Expose-Headers','x-auth')
    // Pass to next layer of middleware
    next();
});

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
  console.log(req.body);
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
    time_limit = prob.time_limit*1000;  //for msec

      var status;
      var problems = [];
      if (language == 'cpp'){
        console.log('time_limit -> ',time_limit);
        compileCpp(code,time_limit,_userID,(data) => {
          status = data;

          submission = new Submission({_problemID,_contestID, _userID,code,language, status});
          submission.save().then((result) => {
            res.send(status);

            Ranking.findOne({_userID,_contestID}).then((data) => {
              if (!data) {
                //update ranking
                Problem.find({_contestID}).then((probs) => {

                  for(var i=0;i<probs.length;i++)
                  {
                    if (probs[i]._id == _problemID){
                     if (status.includes('Correct Answer')) {
                        problems.push({_problemID: probs[i]._id,problemName: probs[i].name,correctSubmission:1,wrongSubmission: 0 });
                      }
                      else {
                        problems.push({_problemID: probs[i]._id,problemName: probs[i].name,correctSubmission:0,wrongSubmission: 1 });
                      }
                    } else {
                      problems.push({_problemID: probs[i]._id,problemName: probs[i].name,correctSubmission:0,wrongSubmission: 0 });
                    }
                  }
                  // console.log(problems);

                  var wa=0,ca=0;
                  for(var i=0;i<problems.length;i++){
                    if(problems[i].correctSubmission) ca += 1;
                    else if (problems[i].wrongSubmission) {
                      wa += problems[i].wrongSubmission;
                    }
                  }
                  var time = moment().add(20 * wa,'m');
                  // console.log(time);
                  ranking = new Ranking({
                    _userID,
                    _contestID,
                    score: ca,
                    time,
                    problems
                  });
                  ranking.save().then((res) => {console.log(res);})
                });
              }
              else {
                //User already in ranking table
                 problems = [];
                  var updateTime = false;
                  console.log(data.time);
                  for(var i=0;i<data.problems.length;i++)
                  {
                    if (data.problems[i]._problemID == _problemID){
                     if (status.includes('Correct Answer')) {
                       if (data.problems[i].correctSubmission == 0){
                         updateTime = true;
                          problems.push({_problemID: data.problems[i]._problemID,problemName: data.problems[i].problemName,correctSubmission:1,wrongSubmission: data.problems[i].wrongSubmission });
                       } else {
                         problems.push({_problemID: data.problems[i]._problemID,problemName: data.problems[i].problemName,correctSubmission:data.problems[i].correctSubmission,wrongSubmission: data.problems[i].wrongSubmission });
                       }
                      }
                      else {
                        if(data.problems[i].correctSubmission == 0)
                          problems.push({_problemID: data.problems[i]._problemID,problemName: data.problems[i].problemName,correctSubmission:data.problems[i].correctSubmission,wrongSubmission: data.problems[i].wrongSubmission + 1 });
                        else {
                          problems.push({_problemID: data.problems[i]._problemID,problemName: data.problems[i].problemName,correctSubmission:data.problems[i].correctSubmission,wrongSubmission: data.problems[i].wrongSubmission });
                        }
                      }
                    } else {
                      problems.push({_problemID: data.problems[i]._problemID,problemName: data.problems[i].problemName,correctSubmission:data.problems[i].correctSubmission,wrongSubmission: data.problems[i].wrongSubmission });
                    }
                  }
                  var wa=0,ca=0,time,score;
                  for(var i=0;i<problems.length;i++){
                    if(problems[i].correctSubmission) ca += 1;
                    if (problems[i].wrongSubmission) {
                      wa += problems[i].wrongSubmission;
                    }
                  }
                  if(updateTime){
                    time = moment().add(20 * wa,'m');
                  }
                  else {
                      time = data.time;
                    }
                    score = ca;
                    console.log(time);
                    Ranking.update({_userID,_contestID}, {$set: {score,time,problems}}).then((res) => {
                      console.log('Rank List updated');
                    });

              }
            }).catch((e) => {console.log(e);});

          }, (e) => {
            res.status(400).send(e);
          });
        });
      }
  });



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
    console.log(req.body);
    var body = _.pick(req.body, ['email'],['password'],['name'],['username']);
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

app.listen(3000,/* '192.168.43.189',*/() => {
  console.log('Server is up on port 3000');
});
