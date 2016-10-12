var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EventEmitter2 = require('eventemitter2').EventEmitter2;
var EventModel = require('./event').Model;

var SensorSchema = new mongoose.Schema({
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


	}
});


var Sensor = mongoose.model('Sensor', SensorSchema);
var deviceEventEmitter = new EventEmitter2();

deviceEventEmitter.on('on', function(driverId, deviceId, value) {
	console.log('sensor turned', driverId, deviceId);
	var eventObj = EventModel({
		eventType: 'device',
		driverType: 'sensor',
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
	Model: Sensor,
	DeviceEventEmitter: deviceEventEmitter
};