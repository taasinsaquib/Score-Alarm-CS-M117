var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var conditionSchema = new Schema({
	game_id: {type: String},
	team: {type: Number},
	goals: {type: Number}
});

mongoose.model('conditionSchema', conditionSchema);