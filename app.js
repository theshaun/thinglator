'use strict';
var chalk = require('chalk');
console.log(chalk.yellow('Starting Thinglator'));
//load and initialise express
var express = require('express');
var app = express();

//connect to the database
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/thinglator');

var interfaceConfig = {
	zwave: {
		hardwareLocation: '/dev/cu.usbmodem1411',
		debug: true
	}
};

var commsUtils = require('./utils/comms');
//get a list of all potential interfaces (one for each communication protocol)
var availableInterfaces = commsUtils.loadInterfaces();

//load the comms using the available interfaces and their configs
var comms = commsUtils.loadComms(availableInterfaces, interfaceConfig);
//loop through the comms and connect them
var commsConnectPromises = [];
for (var i in comms) {
	console.log(chalk.blue('Connecting to comms: ' + chalk.white(i)));
	commsConnectPromises.push(comms[i].connect());
}

Promise.all(commsConnectPromises).then(function(results) {
	console.log(chalk.blue('All comms connected!'));
	//Get the drivers and initialise them
	var driverUtils = require('./utils/driver');
	var drivers = driverUtils.loadDrivers(comms);

	//setup the HTTP API
	var httpApi = require('./httpApi')(app, drivers);

	//Initialise the webserver
	var httpServer = app.listen(3007, function() {
		console.log(chalk.blue('Web server listening on port 3007'));
	});

	// //setup the websocket API
	var socketApi = require('./socketApi').socketApi(httpServer, drivers);
	console.log(chalk.blue('WebSocket server listening on port 3007'));

}).catch(function(err) {
	console.log(chalk.red(err));
	process.emit('SIGINT');
});


process.on('SIGINT', function() {
	var commsDisconnectPromises = [];
	for (var i in comms) {
		console.log(chalk.blue('Disconnecting from comms: ' + chalk.white(i)));
		commsDisconnectPromises.push(comms[i].disconnect());
	}

	Promise.all(commsDisconnectPromises).then(() => {
		console.log(chalk.blue('All comms disconnected!'));
		console.log(chalk.yellow('Stopping Thinglator'));
		process.exit();
	}).catch(function(e) {
		console.log(chalk.red(err));
		console.log(chalk.yellow('Stopping Thinglator'));
		process.exit();
	});

});