// TODO: Function to check if game has gone live, then start testing condition
// TODO: Function that does getLive, but instead of creating new game in db, updates original entry
// TODO: Separate js files to dump into db, evaluate conditions and handle routes

const rp = require('request-promise');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

require('./models/db');                   // schema
const gameSchema = mongoose.model('gameSchema');

function getGame(id) {
    const options = {
      uri: 'http://www.espn.com/soccer/match?gameId=' + id,
      transform: function (body) {
        return cheerio.load(body);
      }
    }

    rp(options)
      .then(($) => {
          var teams = []
          var goals = []
          var active = "LIVE"
          var start_details = ""
          var game_time = ""

          $('.short-name').each(function(i, elem) {
              teams.push($(this).text())
          });

          var div = $('.subdued').html().replace(/\s/g, "")
          div = div.split('"')[1]
          var d = new Date(div)
          var start_details = d.toString()

          $('.score').each(function(i, elem) {
              var txt = $(this).text()
              goals.push(txt.replace(/\s/g, ""))
          });

          game_time = $('.game-time').text()

          if (!game_time){
              active = "FUTURE"
              goals = [0,0]
              game_time = '0'
          }
          else {
              game_time = game_time.replace(/\'/, "")
          }

          saveGame(teams, id, goals, start_details, game_time, active)

      })
      .catch((err) => {
        console.log(err);
      });
}

function getCompleted(id){
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

            saveGame(teams, id, scores, time, "0", "Completed");

      })
      .catch((err) => {
        console.log(err);
      });
}
function getLive(id, conditionHandler){
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
            time = time.replace(/\'/, "")

            $('.score').each(function(i, elem) {
                var txt = $(this).text()
                scores.push(txt.replace(/\s/g, ""))
            });

            conditionHandler(scores, time)

            if (save)
                saveGame(teams, id, scores, "Started", time, "Live");
      })
      .catch((err) => {
        console.log(err);
      });
}
function getFuture(id){
    const options = {
      uri: 'http://www.espn.com/soccer/match?gameId=' + id,
      transform: function (body) {
        return cheerio.load(body);
      }
    }

    rp(options)
      .then(($) => {
            var teams = []
            var date = 0
            var time = 0
            $('.short-name').each(function(i, elem) {
                teams.push($(this).text())
            });

            var div = $('.subdued').html().replace(/\s/g, "")
            div = div.split('"')[1]

            var d = new Date(div)
            var date = d.toString()

            saveGame(teams, id, [0,0], date, "0", "Future");

      })
      .catch((err) => {
        console.log(err);
      });
}

// save game data to database
function saveGame(teams, game_id, goals, start_details, game_time, active){
    //TODO: if found by id, update... else create
    var game = {
        teams, game_id, goals, start_details, game_time, active
    }

    gameSchema.findOneAndUpdate({game_id: game_id}, game, {upsert: true, new: true}, (err, g) => {
        if (err) console.log(err);
        else {
            console.log("Game update success", g);
        }
    })
}

module.exports = {getGame}
