'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArtistSchema = mongoose.Schema({
	name : String,
	description : String,
	image : String
});

module.exports = mongoose.model('Artists', ArtistSchema);
