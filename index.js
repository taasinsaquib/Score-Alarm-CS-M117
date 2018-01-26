const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const moment = require('moment');
const schedule = require('node-schedule');
const live_score_api = require('sports-live');

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname));

//some endpoint.
// Desired Inputs: players, score we want to alert at (user enters this)
//Desired Outputs: if the match is close, we want to return true, else false
app.get('/tennis', (req, res) => {
  live_score_api.getAllMatches("tennis",function(err,matches) {
    if (err) {
      console.log(err.message);
    } else {
      console.log(matches);
    }
  });
})


const port = 8000;
app.listen(port, () => {
  console.log('We are live on ' + port);
});
