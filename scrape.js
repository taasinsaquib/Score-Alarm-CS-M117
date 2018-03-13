// TODO: Function to check if game has gone live, then start testing condition

const rp = require('request-promise');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

require('./models/db');                   // schema
const gameSchema = mongoose.model('gameSchema');

require('./models/gameIds');
const gameIdSchema = mongoose.model('gameIdSchema');

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
          else if (game_time === "FT"){
              active = "COMPLETED"
          }
          else {
              active = "LIVE"
              game_time = game_time.replace(/\'/, "")
          }

          saveGame(teams, id, goals, start_details, game_time, active)

      })
      .catch((err) => {
        console.log(err);
      });
}

// save game data to database
function saveGame(teams, game_id, goals, start_details, game_time, active){
    var game = {
        teams, game_id, goals, start_details, game_time, active
    }

    if (active === "COMPLETED"){
        var gid = {
            game_id,
            active: false
        }
        gameIdSchema.findOneAndUpdate({game_id: game_id}, gid, (err,g) => {
            if (err) console.log(err);
            else {
                // console.log("Game finished, will no longer update:", g);
            }
        })
    }

    gameSchema.findOneAndUpdate({game_id: game_id}, game, {upsert: true, new: true}, (err, g) => {
        if (err) console.log(err);
        else {
            // console.log("Game update success:", g);
        }
    })
}

module.exports = {getGame}
