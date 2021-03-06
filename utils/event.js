'use strict';
var EventEmitter2 = require('eventemitter2').EventEmitter2;

var newEventEmitter = new EventEmitter2();


//this event emitter will gets used when new event db records are created (models/events.js) and is
//subscribed to by the socket.io handler (socketApi.js). This allows us to send any new events to any
//websocket clients
var utils = {
	newEventCreated: function(event) {
		newEventEmitter.emit('newEvent', event);
	},
	getEventEmitter: function() {
		return newEventEmitter;
	}
};

module.exports = utils;