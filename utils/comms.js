'use strict';

var fs = require('fs');

var utils = {
	loadInterfaces: function() {
		var interfacesArr = {
			http: 'http'
		};
		fs.readdirSync('./node_modules').forEach(function(file) {
			if (file.match(/thinglator-interface-/) !== null) {
				var name = file.replace('thinglator-interface-', '');
				var interfaceObj = require('thinglator-interface-' + name);

				if (!interfacesArr[interfaceObj.type]) {
					interfacesArr[interfaceObj.type] = name;
				}
			}
		});
		return interfacesArr;
	},
	loadComms: function(availableInterfaces, interfaceConfig) {
		var interfacesArr = {};

		fs.readdirSync('./comms').forEach(function(file) {
			var commsId = file.slice(0, -3);
			//if there's an interface for this particular communication protocol, initialise it
			if (availableInterfaces[commsId]) {
				var commsClass = require('../comms/' + file);
				if (typeof interfaceConfig[commsId] === "undefined") {
					interfaceConfig[commsId] = {};
				}
				interfacesArr[commsId] = new commsClass(availableInterfaces[commsId], interfaceConfig[commsId]);
			}
		});

		return interfacesArr;
	}
};

module.exports = utils;