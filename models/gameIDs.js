var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameArrSchema = new Schema({
	game_ids: [{type: String}]
});

mongoose.model('gameArrSchema', gameArrSchema);