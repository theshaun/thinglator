'use strict';

var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var mockery = require('mockery');

var moduleToBeTested;

describe('controllers/authenticate', () => {
	afterEach((done) => {
		mockery.deregisterMock('../models');
		mockery.deregisterMock('../utils/driver');
		mockery.deregisterMock('jsonschema');
		mockery.disable();
		done();
	});

	describe('getAuthenticationProcess', () => {
		it('should get the authentication process for the specified driver', () => {
			
			var driverUtilsMock = {
				doesDriverExist: function() {},
			};
			var doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', function() {
				return Promise.resolve(true);
			});

			var modelsMock = {
				authenticationSchemas: {
					requested: {
						RequestData: {
							"$schema": "http://json-schema.org/draft-04/schema#",
							"type": "object"
						}
					}
				}
			};

			var jsonValidatorMock = {
				Validator: class {
					validate() {}
				}
			};

			var jsonValidatorStub = sinon.stub(jsonValidatorMock.Validator.prototype, 'validate', function() {
				return {
					errors: []
				};
			});

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('../utils/driver', driverUtilsMock);
			mockery.registerMock('jsonschema', jsonValidatorMock);

			moduleToBeTested = require('../../../controllers/authenticate');


			var drivers = {
				driverA: new class DriverADriver {
					getName() {
						return 'driverA';
					}
					getType() {
						return 'foo';
					}
					getAuthenticationProcess() {

					}
				}
			};
			var getAuthenticationProcessMock = sinon.stub(drivers.driverA,'getAuthenticationProcess', function() {
				return Promise.resolve([{
		            type: 'RequestData',
		            message: 'In order to use this app you need an access token',
		            button: {
		                url: 'https://foobar.com/settings',
		                label: 'Get access token'
		            },
		            dataLabel: 'Access token',
		            next: '/authenticate/foo/deviceA/0'
		        }]);
			});

			expect(moduleToBeTested.getAuthenticationProcess).to.be.a.function;
			return moduleToBeTested.getAuthenticationProcess('driverA','foo', drivers)
				.then(function(result) {
					expect(JSON.stringify(result)).to.equal(JSON.stringify([{
			            type: 'RequestData',
			            message: 'In order to use this app you need an access token',
			            button: {
			                url: 'https://foobar.com/settings',
			                label: 'Get access token'
			            },
			            dataLabel: 'Access token',
			            next: '/authenticate/foo/deviceA/0'
			        }]));

					expect(doesDriverExistMock).to.have.been.calledOnce;
					expect(doesDriverExistMock).to.have.been.calledWith('driverA','foo');

					expect(getAuthenticationProcessMock).to.have.been.calledOnce;
					expect(jsonValidatorStub).to.have.been.calledOnce;
					expect(jsonValidatorStub).to.have.been.calledWith({
			            type: 'RequestData',
			            message: 'In order to use this app you need an access token',
			            button: {
			                url: 'https://foobar.com/settings',
			                label: 'Get access token'
			            },
			            dataLabel: 'Access token',
			            next: '/authenticate/foo/deviceA/0'
			        },{
							"$schema": "http://json-schema.org/draft-04/schema#",
							"type": "object"
					});
				});
		});


		it('should get the authentication process for the specified driver, where the authentication process is empty', () => {
			
			var driverUtilsMock = {
				doesDriverExist: function() {},
			};
			var doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', function() {
				return Promise.resolve(true);
			});

			var modelsMock = {
				authenticationSchemas: {

				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('../utils/driver', driverUtilsMock);

			moduleToBeTested = require('../../../controllers/authenticate');


			var drivers = {
				driverA: new class DriverADriver {
					getName() {
						return 'driverA';
					}
					getType() {
						return 'foo';
					}
					getAuthenticationProcess() {

					}
				}
			};
			var getAuthenticationProcessMock = sinon.stub(drivers.driverA,'getAuthenticationProcess', function() {
				return Promise.resolve([]);
			});

			expect(moduleToBeTested.getAuthenticationProcess).to.be.a.function;
			return moduleToBeTested.getAuthenticationProcess('driverA','foo', drivers)
				.then(function(result) {
					expect(JSON.stringify(result)).to.equal(JSON.stringify([]));

					expect(doesDriverExistMock).to.have.been.calledOnce;
					expect(doesDriverExistMock).to.have.been.calledWith('driverA','foo');

					expect(getAuthenticationProcessMock).to.have.been.calledOnce;
				});
		});

		it('should throw an error when an invalid driver is specified', () => {
			
			var driverUtilsMock = {
				doesDriverExist: function() {},
			};
			var doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', function() {
				return Promise.resolve(false);
			});

			var modelsMock = {};

			var jsonValidatorMock = {
				Validator: class {
					validate() {}
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('../utils/driver', driverUtilsMock);
			mockery.registerMock('jsonschema', jsonValidatorMock);

			moduleToBeTested = require('../../../controllers/authenticate');


			var drivers = {
				driverA: new class DriverADriver {
					getName() {
						return 'driverA';
					}
					getType() {
						return 'foo';
					}
					getAuthenticationProcess() {

					}
				}
			};
			

			expect(moduleToBeTested.getAuthenticationProcess).to.be.a.function;
			return moduleToBeTested.getAuthenticationProcess('driverA','foo', drivers)
				.catch(function(err) {
					expect(err.message).to.equal('driver not found');
					expect(err.type).to.equal('NotFound');
				});
		});

		it('should throw an error when a \'requested\' validation schema doesn\'t exist', () => {
			
			var driverUtilsMock = {
				doesDriverExist: function() {},
			};
			var doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', function() {
				return Promise.resolve(true);
			});

			var modelsMock = {
				authenticationSchemas: {
					requested: {}
				}
			};

			var jsonValidatorMock = {
				Validator: class {
					validate() {}
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('../utils/driver', driverUtilsMock);
			mockery.registerMock('jsonschema', jsonValidatorMock);

			moduleToBeTested = require('../../../controllers/authenticate');


			var drivers = {
				driverA: new class DriverADriver {
					getName() {
						return 'driverA';
					}
					getType() {
						return 'foo';
					}
					getAuthenticationProcess() {

					}
				}
			};
			var getAuthenticationProcessMock = sinon.stub(drivers.driverA,'getAuthenticationProcess', function() {
				return Promise.resolve([{
		            type: 'RequestData',
		            message: 'In order to use this app you need an access token',
		            button: {
		                url: 'https://foobar.com/settings',
		                label: 'Get access token'
		            },
		            dataLabel: 'Access token',
		            next: '/authenticate/foo/deviceA/0'
		        }]);
			});

			expect(moduleToBeTested.getAuthenticationProcess).to.be.a.function;
			return moduleToBeTested.getAuthenticationProcess('driverA','foo', drivers)
				.catch(function(err) {
					expect(err.message).to.equal('validation schema not found');
					expect(err.type).to.equal('Driver');
					expect(err.driver).to.equal('driverA');
				});
		});

		it('should throw an error when the json doesn\'t match the \'requested\' validation schema', () => {
			
			var driverUtilsMock = {
				doesDriverExist: function() {},
			};
			var doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', function() {
				return Promise.resolve(true);
			});

			var modelsMock = {
				authenticationSchemas: {
					requested: {
						RequestData: {
							"$schema": "http://json-schema.org/draft-04/schema#",
							"type": "object"
						}
					}
				}
			};

			var jsonValidatorMock = {
				Validator: class {
					validate() {}
				}
			};

			var jsonValidatorStub = sinon.stub(jsonValidatorMock.Validator.prototype, 'validate', function() {
				return {
					errors: [{
						property: 'instance',
						message: 'is not of a type(s) string',
						schema: [Object],
						instance: 4,
						name: 'type',
						argument: [Object],
						stack: 'instance is not of a type(s) string'
					}]
				};
			});

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('../utils/driver', driverUtilsMock);
			mockery.registerMock('jsonschema', jsonValidatorMock);

			moduleToBeTested = require('../../../controllers/authenticate');


			var drivers = {
				driverA: new class DriverADriver {
					getName() {
						return 'driverA';
					}
					getType() {
						return 'foo';
					}
					getAuthenticationProcess() {

					}
				}
			};
			var getAuthenticationProcessMock = sinon.stub(drivers.driverA,'getAuthenticationProcess', function() {
				return Promise.resolve([{
		            type: 'RequestData',
		            message: 'In order to use this app you need an access token',
		            button: {
		                url: 'https://foobar.com/settings',
		                label: 'Get access token'
		            },
		            dataLabel: 'Access token',
		            next: '/authenticate/foo/deviceA/0'
		        }]);
			});

			expect(moduleToBeTested.getAuthenticationProcess).to.be.a.function;
			return moduleToBeTested.getAuthenticationProcess('driverA','foo', drivers)
				.catch(function(error) {
					expect(error.message).to.equal('the driver produced invalid json');
					expect(error.type).to.equal('Validation');
					expect(error.errors[0].message).to.equal('is not of a type(s) string');
				});
		});

		it('should catch generic errors', () => {
			
			var driverUtilsMock = {
				doesDriverExist: function() {},
			};
			var doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', function() {
				return Promise.resolve(true);
			});

			var modelsMock = {
				authenticationSchemas: {}
			};

			var jsonValidatorMock = {
				Validator: class {
					validate() {}
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('../utils/driver', driverUtilsMock);
			mockery.registerMock('jsonschema', jsonValidatorMock);

			moduleToBeTested = require('../../../controllers/authenticate');


			var drivers = {
				driverA: new class DriverADriver {
					getName() {
						return 'driverA';
					}
					getType() {
						return 'foo';
					}
					getAuthenticationProcess() {

					}
				}
			};
			var getAuthenticationProcessMock = sinon.stub(drivers.driverA,'getAuthenticationProcess', function() {
				var err = new Error('this is a generic error');
				return Promise.reject(err);
			});

			expect(moduleToBeTested.getAuthenticationProcess).to.be.a.function;
			return moduleToBeTested.getAuthenticationProcess('driverA','foo', drivers)
				.catch(function(error) {
					expect(error.message).to.equal('this is a generic error');
					expect(error.type).to.be.undefined;
					expect(error.driver).to.be.undefined;
				});
		});
		
	});


	describe('authenticationStep', () => {
		it('should handle an authentication step correctly', () => {
			var driverUtilsMock = {
				doesDriverExist: function() {},
			};
			var doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', function() {
				return Promise.resolve(true);
			});

			var modelsMock = {
				authenticationSchemas: {
					returned: {
						RequestData: {
							"$schema": "http://json-schema.org/draft-04/schema#",
							"type": "object"
						}
					}
				}
			};

			var jsonValidatorMock = {
				Validator: class {
					validate() {}
				}
			};

			var jsonValidatorStub = sinon.stub(jsonValidatorMock.Validator.prototype, 'validate', function() {
				return {
					errors: []
				};
			});

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('../utils/driver', driverUtilsMock);
			mockery.registerMock('jsonschema', jsonValidatorMock);

			moduleToBeTested = require('../../../controllers/authenticate');


			var drivers = {
				driverA: new class DriverADriver {
					getName() {
						return 'driverA';
					}
					getType() {
						return 'foo';
					}
					getAuthenticationProcess() {

					}
					setAuthenticationStep0() {

					}
				}
			};
			var getAuthenticationProcessMock = sinon.stub(drivers.driverA,'getAuthenticationProcess', function() {
				return Promise.resolve([{
		            type: 'RequestData',
		            message: 'In order to use this app you need an access token',
		            button: {
		                url: 'https://foobar.com/settings',
		                label: 'Get access token'
		            },
		            dataLabel: 'Access token',
		            next: '/authenticate/foo/deviceA/0'
		        }]);
			});

			var setAuthenticationStep0Mock = sinon.stub(drivers.driverA,'setAuthenticationStep0', function() {
				return Promise.resolve({success:true});
			});

			expect(moduleToBeTested.authenticationStep).to.be.a.function;
			return moduleToBeTested.authenticationStep('driverA','foo', drivers, 0, {"foo":"bar"})
				.then(function(result) {
					expect(JSON.stringify(result)).to.equal(JSON.stringify({"success":true}));

					expect(doesDriverExistMock).to.have.been.calledOnce;
					expect(doesDriverExistMock).to.have.been.calledWith('driverA','foo');

					expect(getAuthenticationProcessMock).to.have.been.calledOnce;

					expect(jsonValidatorStub).to.have.been.calledTwice;
					expect(jsonValidatorStub.firstCall).to.have.been.calledWith({ foo: "bar" },{
							"$schema": "http://json-schema.org/draft-04/schema#",
							"type": "object"
					});

					expect(setAuthenticationStep0Mock).to.have.been.calledOnce;
					expect(setAuthenticationStep0Mock).to.have.been.calledWith({foo: "bar"});

					expect(jsonValidatorStub.secondCall).to.have.been.calledWith({ success: true }, {
					  $schema: "http://json-schema.org/draft-04/schema#",
					  properties: { message: { type: "string" }, success: { type: "boolean" } },
					  required: ["success"],
					  type: "object"
					});
				});
		});

		it('should throw an error when the driver is not found', () => {
			var driverUtilsMock = {
				doesDriverExist: function() {},
			};
			var doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', function() {
				return Promise.resolve(false);
			});

			var modelsMock = {
				authenticationSchemas: {}
			};

			var jsonValidatorMock = {
				Validator: class {
					validate() {}
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('../utils/driver', driverUtilsMock);
			mockery.registerMock('jsonschema', jsonValidatorMock);

			moduleToBeTested = require('../../../controllers/authenticate');


			var drivers = {
				driverA: new class DriverADriver {
					getName() {
						return 'driverA';
					}
					getType() {
						return 'foo';
					}
				}
			};

			expect(moduleToBeTested.authenticationStep).to.be.a.function;
			return moduleToBeTested.authenticationStep('driverA','foo', drivers, 0, {"foo":"bar"})
				.catch(function(err) {
					expect(err.message).to.equal('driver not found');
					expect(err.type).to.equal('NotFound');
				});
		});

		it('should throw an error when the authentication step is not found', () => {
			var driverUtilsMock = {
				doesDriverExist: function() {},
			};
			var doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', function() {
				return Promise.resolve(true);
			});

			var modelsMock = {
				authenticationSchemas: {}
			};

			var jsonValidatorMock = {
				Validator: class {
					validate() {}
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('../utils/driver', driverUtilsMock);
			mockery.registerMock('jsonschema', jsonValidatorMock);

			moduleToBeTested = require('../../../controllers/authenticate');


			var drivers = {
				driverA: new class DriverADriver {
					getName() {
						return 'driverA';
					}
					getType() {
						return 'foo';
					}
					getAuthenticationProcess() {

					}
					setAuthenticationStep0() {

					}
				}
			};
			var getAuthenticationProcessMock = sinon.stub(drivers.driverA,'getAuthenticationProcess', function() {
				return Promise.resolve([{
		            type: 'RequestData',
		            message: 'In order to use this app you need an access token',
		            button: {
		                url: 'https://foobar.com/settings',
		                label: 'Get access token'
		            },
		            dataLabel: 'Access token',
		            next: '/authenticate/foo/deviceA/0'
		        }]);
			});

			expect(moduleToBeTested.authenticationStep).to.be.a.function;
			return moduleToBeTested.authenticationStep('driverA','foo', drivers, 1, {"foo":"bar"})
				.catch(function(err) {
					expect(err.message).to.equal('authentication step not found');
					expect(err.type).to.equal('NotFound');
				});
		});

		it('should throw an error when the json doesn\'t match the step schema', () => {
			var driverUtilsMock = {
				doesDriverExist: function() {},
			};
			var doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', function() {
				return Promise.resolve(true);
			});

			var modelsMock = {
				authenticationSchemas: {
					returned: {
						RequestData: {
							"$schema": "http://json-schema.org/draft-04/schema#",
							"type": "object"
						}
					}
				}
			};

			var jsonValidatorMock = {
				Validator: class {
					validate() {}
				}
			};

			var jsonValidatorStub = sinon.stub(jsonValidatorMock.Validator.prototype, 'validate', function() {
				return {
					errors: [{
						property: 'instance',
						message: 'is not of a type(s) string',
						schema: [Object],
						instance: 4,
						name: 'type',
						argument: [Object],
						stack: 'instance is not of a type(s) string'
					}]
				};
			});

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('../utils/driver', driverUtilsMock);
			mockery.registerMock('jsonschema', jsonValidatorMock);

			moduleToBeTested = require('../../../controllers/authenticate');


			var drivers = {
				driverA: new class DriverADriver {
					getName() {
						return 'driverA';
					}
					getType() {
						return 'foo';
					}
					getAuthenticationProcess() {

					}
					setAuthenticationStep0() {

					}
				}
			};
			var getAuthenticationProcessMock = sinon.stub(drivers.driverA,'getAuthenticationProcess', function() {
				return Promise.resolve([{
		            type: 'RequestData',
		            message: 'In order to use this app you need an access token',
		            button: {
		                url: 'https://foobar.com/settings',
		                label: 'Get access token'
		            },
		            dataLabel: 'Access token',
		            next: '/authenticate/foo/deviceA/0'
		        }]);
			});

			var setAuthenticationStep0Mock = sinon.stub(drivers.driverA,'setAuthenticationStep0', function() {
				return Promise.resolve({success:true});
			});

			expect(moduleToBeTested.authenticationStep).to.be.a.function;
			return moduleToBeTested.authenticationStep('driverA','foo', drivers, 0, {"foo":"bar"})
				.catch(function(error) {
					expect(error.message).to.equal('the body is invalid');
					expect(error.type).to.equal('Validation');
					expect(error.errors[0].message).to.equal('is not of a type(s) string');
				});
		});

		it('should handle unsuccessful authentication steps', () => {
			var driverUtilsMock = {
				doesDriverExist: function() {},
			};
			var doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', function() {
				return Promise.resolve(true);
			});

			var modelsMock = {
				authenticationSchemas: {
					returned: {
						RequestData: {
							"$schema": "http://json-schema.org/draft-04/schema#",
							"type": "object"
						}
					}
				}
			};

			var jsonValidatorMock = {
				Validator: class {
					validate() {}
				}
			};

			var jsonValidatorStub = sinon.stub(jsonValidatorMock.Validator.prototype, 'validate', function() {
				return {
					errors: []
				};
			});

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('../utils/driver', driverUtilsMock);
			mockery.registerMock('jsonschema', jsonValidatorMock);

			moduleToBeTested = require('../../../controllers/authenticate');


			var drivers = {
				driverA: new class DriverADriver {
					getName() {
						return 'driverA';
					}
					getType() {
						return 'foo';
					}
					getAuthenticationProcess() {

					}
					setAuthenticationStep0() {

					}
				}
			};
			var getAuthenticationProcessMock = sinon.stub(drivers.driverA,'getAuthenticationProcess', function() {
				return Promise.resolve([{
		            type: 'RequestData',
		            message: 'In order to use this app you need an access token',
		            button: {
		                url: 'https://foobar.com/settings',
		                label: 'Get access token'
		            },
		            dataLabel: 'Access token',
		            next: '/authenticate/foo/deviceA/0'
		        }]);
			});

			var setAuthenticationStep0Mock = sinon.stub(drivers.driverA,'setAuthenticationStep0', function() {
				return Promise.resolve({success:false,message:'The reason for the failure'});
			});

			expect(moduleToBeTested.authenticationStep).to.be.a.function;
			return moduleToBeTested.authenticationStep('driverA','foo', drivers, 0, {"foo":"bar"})
				.then(function(result) {
					expect(JSON.stringify(result)).to.equal(JSON.stringify({"success":false,"message":"The reason for the failure"}));
					expect(jsonValidatorStub.secondCall).to.have.been.calledWith({
					  message: "The reason for the failure", success: false
					}, {
					  $schema: "http://json-schema.org/draft-04/schema#",
					  properties: { message: { type: "string" }, success: { type: "boolean" } },
					  required: ["success", "message"],
					  type: "object"
					});
				});
		});

		it('should catch driver errors', () => {
			var driverUtilsMock = {
				doesDriverExist: function() {},
			};
			var doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', function() {
				var err = new Error('this is a driver error');
				err.type = 'Driver';
				return Promise.reject(err);
			});

			var modelsMock = {
				authenticationSchemas: {
					
				}
			};

			var jsonValidatorMock = {
				Validator: class {
					validate() {}
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('../utils/driver', driverUtilsMock);
			mockery.registerMock('jsonschema', jsonValidatorMock);

			moduleToBeTested = require('../../../controllers/authenticate');


			var drivers = {
				driverA: new class DriverADriver {
					getName() {
						return 'driverA';
					}
					getType() {
						return 'foo';
					}
					getAuthenticationProcess() {

					}
					setAuthenticationStep0() {

					}
				}
			};
			
			expect(moduleToBeTested.authenticationStep).to.be.a.function;
			return moduleToBeTested.authenticationStep('driverA','foo', drivers, 0, {"foo":"bar"})
				.catch(function(err) {
					expect(err.message).to.equal('this is a driver error');;
					expect(err.type).to.equal('Driver');
					expect(err.driver).to.equal('driverA');
				});
		});

		it('should catch generic errors', () => {
			var driverUtilsMock = {
				doesDriverExist: function() {},
			};
			var doesDriverExistMock = sinon.stub(driverUtilsMock, 'doesDriverExist', function() {
				var err = new Error('this is a generic error');
				return Promise.reject(err);
			});

			var modelsMock = {
				authenticationSchemas: {
					
				}
			};

			var jsonValidatorMock = {
				Validator: class {
					validate() {}
				}
			};

			mockery.enable({
				useCleanCache: true,
				warnOnUnregistered: false
			});
			mockery.registerMock('../models', modelsMock);
			mockery.registerMock('../utils/driver', driverUtilsMock);
			mockery.registerMock('jsonschema', jsonValidatorMock);

			moduleToBeTested = require('../../../controllers/authenticate');


			var drivers = {
				driverA: new class DriverADriver {
					getName() {
						return 'driverA';
					}
					getType() {
						return 'foo';
					}
					getAuthenticationProcess() {

					}
					setAuthenticationStep0() {

					}
				}
			};
			
			expect(moduleToBeTested.authenticationStep).to.be.a.function;
			return moduleToBeTested.authenticationStep('driverA','foo', drivers, 0, {"foo":"bar"})
				.catch(function(err) {
					expect(err.message).to.equal('this is a generic error');;
					expect(err.type).to.be.undefined;
					expect(err.driver).to.be.undefined;
				});
		});
	});

});