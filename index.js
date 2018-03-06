const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const rp = require('request-promise');
const cheerio = require('cheerio');
const utils = require('./utils');

const keys = require('./keys/keys');      // key for mLab

require('./models/db');                   // schema
const gameSchema = mongoose.model('gameSchema');

// array of game IDs
var gameArr = ["499530", "499532", "508496", "508495"];

// connect to mLab
mongoose.connect(keys.mongoURI);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var funcs = require('./scrape.js');

var app = express();

app.get('/', (req,res) => {
  res.send("Hello");
})

// app.get('/test', (req,res) =>{

//   var game = new gameSchema({
//       teams: ["FC Barcelona", "Real Madrid"],
//       game_id: "1111",
//       time_start: "12:00 PST",
//       goals: [1, 1],
//       current_time: "12:30 PST",
//       active: "In progress",
//   });

//   game.save();

//   res.send("saved fake game");
// });

// route to scrape and save future games
// app.get('/saveGames', (req,res) => {

// });

app.get('/message', (req, res) => {
  var msg = req.query.msg;
  res.set('Content-Type', 'text/xml');
  res.send(utils.generateXML(msg));
});

app.listen( 3000, () => {
  console.log("listening on 3000");
});


for(var i = 0; i < gameArr.length; i++){

    var currGame = funcs.getFuture(gameArr[i]);

}