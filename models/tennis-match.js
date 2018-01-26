const mongoose = require('mongoose')
const { Schema } = mongoose

const tennis_match_schema = new Schema({
    elapsed_time: Number,
    sets_played: Number,
    twitter_sentiment: Number,
})

mongoose.model('tennis_match', tennis_match_schema)
