const rp = require('request-promise');
const cheerio = require('cheerio');

export function getCompleted(id){
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

            return obj
      })
      .catch((err) => {
        console.log(err);
      });
}

export function getLive(id){
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

            var obj = {
                teams,
                scores,
                time
            }

            console.log(obj);

            return obj
      })
      .catch((err) => {
        console.log(err);
      });
}


export function getFuture(id){
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

            var obj = {
                teams,
                score: [0,0],
                date
            }

            console.log(obj)

            return obj
      })
      .catch((err) => {
        console.log(err);
      });
}
