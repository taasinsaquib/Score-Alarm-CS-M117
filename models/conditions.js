var mongoose = require('mongoose');
var Schema = mongoose.Schema;


/*
Conditions:

1. Goal difference + At Time
2. Goals Scored + For Team [At Time]
3. Team X is Winning/Losing at Time

*/

var conditionSchema = new Schema({
	type: {type: Number},
	satisfied: {type: Boolean},
	game_id: {type: String},
	time: {type: Number},
	goals: {type: Number},
	team: {
		type: Number,
		required: function(){
			return this.type === 2
		}
	}
});

mongoose.model('conditionSchema', conditionSchema);
