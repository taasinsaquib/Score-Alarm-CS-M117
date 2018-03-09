const mongoose = require('mongoose');
var funcs = require('./scrape.js');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const rp = require('request-promise');
const cheerio = require('cheerio');
const utils = require('./utils');

const keys = require('./keys/keys');      // key for mLab
// condition data
require('./models/conditions');
const conditionSchema = mongoose.model('conditionSchema');

function testCondition(){
    console.log("hi");
    conditionSchema.find({"satisfied": false}, (err, conditions) => {
        console.log(conditions);
    });
}

// function testCondition(){
//     console.log("in the func");
//     conditionSchema.find({satisfied: false}, (err, conditions) => {
//         console.log("Conditions: ", conditions.length);
//         conditions.forEach((condition) => {
//             var gameId = condition.game_id

//             if (condition.type === 1){
//                 var goalDiff = condition.goals
//                 var timeCondition = condition.time
//                 funcs.getLive(gameId, (scores, time) => {
//                     if (time != 0 && time >= timeCondition) {
//                         if (scores[0] - scores[1] === goalDiff || scores[1] - scores[0] === goalDiff){
//                             // TODO: Set condition to satisfied and update db
//                             console.log("SATISFIED", condition)
//                             console.log("Time", Date.now());
//                             // TODO: call(mobile phone)
//                         }
//                         else {
//                             console.log("Goal condition not met");
//                         }
//                     }
//                     else {
//                         console.log("Time condition not met");
//                     }
//                 })
//             }

//             // gameSchema.findOne({game_id: gameId})
//             //     .then((game) => {
//             //         if (!game) {
//             //             console.log("Game not found...");
//             //             return
//             //         }
//             //         else {
//             //             console.log("Found", game.game_id);
//             //         }
//             //
//             //         var prevState = game
//             //     })
//         })
//     })
//      .catch((e) => console.log(e));
// }

testCondition();

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

// setInterval(function testCondition(){
//     conditionSchema.find({satisfied: false}, (err, conditions) => {
//         console.log("Conditions: ", conditions.length);
//         conditions.forEach((condition) => {
//             var gameId = condition.game_id

//             if (condition.type === 1){
//                 var goalDiff = condition.goals
//                 var timeCondition = condition.time
//                 funcs.getLive(gameId, (scores, time) => {
//                     if (time != 0 && time >= timeCondition) {
//                         if (scores[0] - scores[1] === goalDiff || scores[1] - scores[0] === goalDiff){
//                             // TODO: Set condition to satisfied and update db
//                             console.log("SATISFIED", condition)
//                             console.log("Time", Date.now());
//                             // TODO: call(mobile phone)
//                         }
//                         else {
//                             console.log("Goal condition not met");
//                         }
//                     }
//                     else {
//                         console.log("Time condition not met");
//                     }
//                 })
//             }

//             // gameSchema.findOne({game_id: gameId})
//             //     .then((game) => {
//             //         if (!game) {
//             //             console.log("Game not found...");
//             //             return
//             //         }
//             //         else {
//             //             console.log("Found", game.game_id);
//             //         }
//             //
//             //         var prevState = game
//             //     })
//         })
//     })
// }, .15 * 60 * 1000)