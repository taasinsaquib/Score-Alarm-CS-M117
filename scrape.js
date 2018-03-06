const rp = require('request-promise');
const cheerio = require('cheerio');
const mongoose = require('mongoose');

require('./models/db');                   // schema
const gameSchema = mongoose.model('gameSchema');

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

function getLive(id){
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

            saveGame(teams, id, scores, time, "0", "Live");
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
            var scores = []
            var date = 0
            var time = 0
            $('.short-name').each(function(i, elem) {
                teams.push($(this).text())
            });

            var div = $('.subdued').html().replace(/\s/g, "")
            div = div.split('"')[1]

            var d = new Date(div)
            var date = d.toString()

            $('.score').each(function(i, elem) {
                var txt = $(this).text()
                scores.push(txt.replace(/\s/g, ""))
            });

            saveGame(teams, id, scores, date, "0", "Future");

      })
      .catch((err) => {
        console.log(err);
      });
}

// save game data to database
function saveGame(teams, id, scores, time, gameTime, status){
    var game = new gameSchema({
        "teams": teams,
        "game_id": id,
        "goals": scores,
        "start_details": time,
        "game_time": gameTime,
        "active": status
    });

  game.save();
}

module.exports = {getCompleted, getLive, getFuture}

