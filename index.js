const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const rp = require('request-promise');
const cheerio = require('cheerio');
const utils = require('./utils');

const keys = require('./keys/keys');      // key for mLab

// game data 
require('./models/db');                   
const gameSchema = mongoose.model('gameSchema');

// condition data
require('./models/conditions');                   
const conditionSchema = mongoose.model('conditionSchema');

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

app.get('/message', (req, res) => {
  var msg = req.query.msg;
  res.set('Content-Type', 'text/xml');
  res.send(utils.generateXML(msg));
});

app.post('/condition', (req,res) => {

    var condition = new conditionSchema({
        game_id: req.body.game_id,
        team: req.body.team,
        goals: req.body.goals
    })

    condition.save();
})

app.listen( 3000, () => {
  console.log("listening on 3000");
});


for(var i = 0; i < gameArr.length; i++){

    var currGame = funcs.getFuture(gameArr[i]);

}

// route to scrape and save future games
// app.get('/saveGames', (req,res) => {

// });