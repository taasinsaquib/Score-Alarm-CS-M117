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
var gameArr = ["508493"];

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
        type: req.body.type,
        satisfied: false,
        game_id: req.body.game_id,
        team: req.body.team ? req.body.team : null,
        time: req.body.time ? req.body.time : null,
        goals: req.body.goals
    })
    condition.save();
})

app.listen( 3000, () => {
  console.log("listening on 3000");
});

setInterval(function testCondition(){
    conditionSchema.find({satisfied: false}, (err, conditions) => {
        console.log("Conditions: ", conditions.length);
        conditions.forEach((condition) => {
            var gameId = condition.game_id

            if (condition.type === 1){
                var goalDiff = condition.goals
                var timeCondition = condition.time
                funcs.getLive(gameId, (scores, time) => {
                    if (time != 0 && time >= timeCondition) {
                        if (scores[0] - scores[1] === goalDiff || scores[1] - scores[0] === goalDiff){
                            // TODO: Set condition to satisfied and update db
                            console.log("SATISFIED", condition)
                            console.log("Time", Date.now());
                            // TODO: call(mobile phone)
                        }
                        else {
                            console.log("Goal condition not met");
                        }
                    }
                    else {
                        console.log("Time condition not met");
                    }
                })
            }

            // gameSchema.findOne({game_id: gameId})
            //     .then((game) => {
            //         if (!game) {
            //             console.log("Game not found...");
            //             return
            //         }
            //         else {
            //             console.log("Found", game.game_id);
            //         }
            //
            //         var prevState = game
            //     })
        })
    })
}, 5 * 60 * 1000)

function addCondition(type, game_id, team, time, goals){
    var condition = new conditionSchema({
        type,
        satisfied: false,
        game_id,
        team,
        time,
        goals
    })
    condition.save();
}

// addCondition(1, 508493, 0, 10, 1)
// for(var i = 0; i < gameArr.length; i++){
//     var currGame = funcs.getFuture(gameArr[i]);
// }
