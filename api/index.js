'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/curso_mean2', (err, res) =>{
	if(err){
		throw err;
	}else{
		console.log('Conectado a Mongodb DB');
		app.listen(port, function(){
			console.log('API REST server up and running at http://localhost:'+port);
		});
	}
});

