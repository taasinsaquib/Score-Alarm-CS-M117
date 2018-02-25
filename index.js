const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const rp = require('request-promise');
const cheerio = require('cheerio');

const keys = require('./keys/keys');      // key for mLab

require('./models/db');                   // schema
const gameSchema = mongoose.model('gameSchema');

// array of game IDs
var gameArr = ["480634", "480626", "505600", "490463"];

// connect to mLab
mongoose.connect(keys.mongoURI);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var app = express();

app.get('/', (req,res) => {
  res.send("Hello");
})

app.get('/test', (req,res) =>{

  var game = new gameSchema({
      teams: ["FC Barcelona", "Real Madrid"],
      game_id: "1111",
      time_start: "12:00 PST",
      goals: [1, 1],
      current_time: "12:30 PST",
      active: "In progress",
  });

  game.save();

  res.send("saved fake game");
});

app.listen( 3000, () => {
  console.log("listening on 3000");
});

// saveGames(gameArr);


for(var i = 0; i < gameArr.length; i++){
    // console.log(arr[i]);
    getDetails(gameArr[i]);

  //   var game = new gameSchema({
  //     teams: ["FC Barcelona", "Real Madrid"],
  //     game_id: "1111",
  //     time_start: "12:00 PST",
  //     goals: [1, 1],
  //     current_time: "12:30 PST",
  //     active: "In progress",
  // });

    // console.log(res);

}


function getDetails(id){
    const options = {
      uri: 'http://www.espn.com/soccer/match?gameId=' + id,
      transform: function (body) {
        return cheerio.load(body);
      }
    }

    rp(options)
      .then(($) => {
            var teams = []
            var scores = []
            var time = 0
            $('.short-name').each(function(i, elem) {
                teams.push($(this).text())
            });

            time = $('.game-time').text()

            $('.score').each(function(i, elem) {
                var txt = $(this).text()
                scores.push(txt.replace(/\s/g, ""))
            });

            var obj = {
                teams,
                scores,
                time
            }

            console.log(obj);

            var game = new gameSchema({
              teams: [teams[0], teams[1]],
              game_id: id,
              start_time: time,
              start_date: "2/25",
              goals: [scores[0], scores[1] ],
              game_time: "0",
              active: "N/A",
            })

            game.save();
      })
      .catch((err) => {
        console.log(err);
      });
}