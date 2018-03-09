var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameSchema = new Schema({
	teams: [{type: String}],
	game_id: {type: String},
	goals: [{type: Number}],
	start_details: {type: String},
	game_time: {type: String},
	active: {type: String},
});

mongoose.model('gameSchema', gameSchema);

	// teams: [{type: String, required: true}],
	// game_id: {type: String, required: true},
	// time_start: {type: String, required: true},
	// goals: [{type: Number, required: true}],
	// current_time: {type: String, required: true},
	// active: {type: String, required: true},
