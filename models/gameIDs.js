var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var gameIdSchema = new Schema({
	game_id: {type: Number},
	active: {type: Boolean}
});

mongoose.model('gameIdSchema', gameIdSchema);
