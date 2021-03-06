var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var EventModel = require('./event').Model;

var SwitchSchema = new mongoose.Schema({
	_id: false,
	name: {
		type: String,
		required: true
	},
	deviceId: {
		type: String,
		required: true
	},
	additionalInfo: {
		type: Object,
		required: false,
		default: {}
	},
	capabilities: {

		on: {
			type: Boolean,
			default: false,
			eventName: 'on',
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"on": {
						"type": "boolean"
					}
				},
				"required": [
					"on"
				]
			}
		},

		off: {
			type: Boolean,
			default: false,
			eventName: 'on',
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"on": {
						"type": "boolean"
					}
				},
				"required": [
					"on"
				]
			}
		}
	}
});


var Switch = mongoose.model('Switch', SwitchSchema);
var deviceEventEmitter = new EventEmitter2();

deviceEventEmitter.on('on', function(driverId, deviceId, value) {
	console.log('switch turned', driverId, deviceId);
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'switch',
		driverId: driverId,
		deviceId: deviceId,
		event: 'on',
		value: value.on
	});
	eventObj.save().catch(function(err) {
		console.log('Unable to save event..', eventObj, err);
	});
});


module.exports = {
	Model: Switch,
	DeviceEventEmitter: deviceEventEmitter
};