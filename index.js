const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const rp = require('request-promise');
const cheerio = require('cheerio');
const utils = require('./utils');
const keys = require('./keys/keys');      // key for mLab
const caller = require('./caller');

const PORT = process.env.PORT ? process.env.PORT : 3000

/********* Schemas ***********/

// game data
require('./models/db');
const gameSchema = mongoose.model('gameSchema');

// condition data
require('./models/conditions');
const conditionSchema = mongoose.model('conditionSchema');

require('./models/gameIds');
const gameIdSchema = mongoose.model('gameIdSchema');

// array of game IDs
var gameArr = ["480610", "502734", "490429", "502729", "490430", "502728", "480611", "499888", "487025"];

// connect to mLab
mongoose.connect(keys.mongoURI);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var funcs = require('./scrape.js');		// helper functions

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req,res) => {
  res.send("Hello");
})

app.get('/message', (req, res) => {
  var msg = req.query.msg;
  res.set('Content-Type', 'text/xml');
  res.send(utils.generateXML(msg));
});

app.get('/future', (req, res) => {
    gameSchema.find({active: "FUTURE"}).then((games) => {
        res.send(games)
    })
})

app.get('/live', (req, res) => {
    gameSchema.find({active: "LIVE"}).then((games) => {
        res.send(games)
    })
})

app.get('/completed', (req, res) => {
    gameSchema.find({active: "COMPLETED"}).then((games) => {
        res.send(games)
    })
})

app.get('/all', (req, res) => {
    gameSchema.find({}).then((games) => {
        res.send(games)
    })
})

// delete conditions for games that have COMPLETED
app.get('/cleanConditions', (req,res) => {
    gameSchema.find({active: "COMPLETED"}).then((games) => {
    	games.forEach(function(game){
    		conditionSchema.find({game_id: game.game_id})
    			.then((conditions) => {
    				res.send(conditions);
    				conditions.forEach((condition) => {
    					condition.remove();
    				})

    			})
    			.catch((e) => {
    				console.log(e);
    			});
    	});
    });

});

setInterval(function(){
    gameIdSchema.find({active: true}).then((game_ids) => {
        game_ids.forEach((g) => {
            funcs.getGame(g.game_id)
        })
    })
}, 1 * 60 * 1000)

/********* POST ***********/

app.post('/addGames', (req,res) => {
    var gameIds = req.body.game_ids
    gameIds.forEach((game_id) => {
        var g = new gameIdSchema({
            game_id,
            active: true
        })
        g.save()
    })
})

// save conditions to db
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
    res.send(req.body);
});

// make call
// params: number, msg
// example: /call?number=14088321289&msg=Hello
app.post('/call', (req,res) => {
  var number = '+' + req.query.number;
  var msg = req.query.msg;
  caller.make_call(number, msg, resp => {
    res.send(`Made call to ${number} with message:\n${msg}`);
  });
})

// make sms text
// params: number, msg
// example: /text?number=14088321289&msg=Hello
app.post('/text', (req,res) => {
  var number = '+' + req.query.number;
  var msg = req.query.msg;
  caller.make_sms(number, msg, resp => {
    res.send(`Made SMS text to ${number} with message:\n${msg}`);
  })
});

// var idk = new gameArrSchema({game_ids: ["111111"]})
// idk.save();

/********* POST ***********/

app.listen( PORT, () => {
  console.log("listening on ", PORT);
});

// loops through conditions in db and checks if they've been satisfied
function testCondition(){

    conditionSchema.find({satisfied: false})

        .then((conditions) => {

            // loop through each condition
            conditions.forEach(function(condition){

                // find game that condition corresponds to
                gameSchema.findOne({game_id: condition.game_id})
                    .then((game) => {

                        var conditionType = parseInt(condition.type);       // get the condition type

                        switch(conditionType){              // handle each type of condition

                            case 1:                         // goal difference at time
                                var desiredGoalDiff = condition.goals;
                                var currGoalDiff = Math.abs(game.goals[0] - game.goals[1]);

                                var desiredTime = condition.time;
                                var currTime = game.game_time

                                if((currGoalDiff == desiredGoalDiff)  && (desiredTime == -1 || currTime >= desiredTime)){
                                    alertUser(conditionType, game.teams[0], game.teams[1], desiredGoalDiff, null, null, null, null);
                                    conditionSchema.update({game_id: condition.game_id}, { $set: { "satisfied": true }}, function(err,condition){
                                        if (err) console.log(err) ;
                                        // res.send(condition);
                                    });
                                }
                                else{
                                    console.log("Condition Type 1 NOT Satisfied", condition);
                                }
                                break;

                            case 2:                         // goals scored for a team [at a time]

                                var teamIndex = condition.team;
                                var desiredGoals = condition.goals;
                                var currGoals = game.goals[teamIndex];

                                var desiredTime = condition.time;
                                var currTime = game.game_time                             

                                if(currGoals == desiredGoals && (desiredTime == -1 || currTime >= desiredTime)){
                                    alertUser(conditionType, null, null, null, game.teams[teamIndex], desiredGoals, null, null);
                                    conditionSchema.update({game_id: condition.game_id}, { $set: { "satisfied": true }}, function(err,condition){
                                        if (err) console.log(err) ;
                                        // res.send(condition);
                                    });                                
                                }
                                else{
                                    console.log("Condition of Type 2 not satisfied", condition);
                                }
                                break;

                            case 3:
                                var desiredTime = condition.time;
                                var currTime = game.game_time;

                                if(desiredTime == -1 || currTime >= desiredTime){
                                    var teamIndex = condition.team;
                                    var oppositionIndex;
                                    if(teamIndex == 0)
                                        oppositionIndex = 1;
                                    else
                                        oppositionIndex = 0;

                                    var goalDiff = game.goals[teamIndex] - game.goals[oppositionIndex];

                                    var gameStatus;
                                    if(goalDiff == 0)
                                        gameStatus = -1;
                                    else if(goalDiff < 0)
                                        gameStatus = 0;
                                    else
                                        gameStatus = 1;

                                    alertUser(conditionType, null, null, null, game.teams[teamIndex], null, gameStatus, currTime);                                  
                                    conditionSchema.update({game_id: condition.game_id}, { $set: { "satisfied": true }}, function(err,condition){
                                        if (err) console.log(err) ;
                                        // res.send(condition);
                                    });
                                }
                                else{
                                    console.log("Condition of Type 3 not satisfied", condition);
                                }

                                break;

                            default:
                                console.log("invalid condition type");
                                break;
                        }
                    })
                    .catch((e) => {
                        console.log(e);
                    });
            });
        })

        .catch((e) => {
            console.log(e);
        });

}

// format alert to user
function alertUser(type, team1, team2, goalDiff, team, goals, status, time){


	switch(type){
		case 1:
			console.log("ALERT: Type 1");
			console.log("The game: " + team1 + " vs. " + team2 + " has a goal difference of " + goalDiff + "!");
			break;

		case 2:
			console.log("ALERT: Type 2");
			console.log(team + " has scored " + goals + " goals!");
			break;

		case 3:
			console.log("ALERT: Type 3");

			var str = team + " ";
			if(status == 0)
				str += "is losing";
			else if(status == 1)
				str += "is winning"
			else if(status == -1)
				str += "The game is tied"

			console.log(str + " at time " + time +"'");
			break;

		default:
			break;
	}
}

// check conditions every minute
setInterval(function(){
    testCondition();
}, 1 * 60 * 1000)

// testCondition();


// function to create condition
// function addCondition(type, game_id, team, time, goals){
//     var condition = new conditionSchema({
//         type,
//         satisfied: false,
//         game_id,
//         team,
//         time,
//         goals
//     })
//     condition.save();
// }
