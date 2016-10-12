'use strict';

var commsClass = class ZwaveComms {
	constructor(interfaceId, config) {
		this.interfaceId = interfaceId;
		this.config = config;
		this._loadInterface();
	}

	_loadInterface() {
		var interfaceObj = require('../node_modules/thinglator-interface-' + this.interfaceId);
		this.interface = new interfaceObj.interface(this.config);
	}

	getType() {
		return 'zwave';
	}

	getInterface() {
		return interfaceId;
	}

	connect() {
		return this.interface.connect();
	}

	disconnect() {
		return this.interface.disconnect();
	}

	addDevices() {
		return this.interface.addDevices();
	}

	getAllNodes() {
		return this.interface.getAllNodes();
	}

	getUnclaimedNodes() {
		return this.interface.getUnclaimedNodes();
	}

	getNodesClaimedByDriver(driverId) {
		return this.interface.getNodesClaimedByDriver(driverId);
	}

	claimNode(driverId, nodeId) {
		return this.interface.claimNode(driverId, nodeId);
	}

	setValue() {
		return this.interface.setValue();
	}
}

module.exports = commsClass;