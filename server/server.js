const express = require('express');

var app = express();

//for logging request
app.use((req,res,next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  next();
});

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
