global.assert = require('assert');
global.fs = require('fs');
global.Step = require('../lib/step');

// A mini expectations module to ensure expected callback fire at all.
var expectations = {};
global.expect = function expect(message) {
  expectations[message] = new Error("Missing expectation: " + message);
}
global.fulfill = function fulfill(message) {
  delete expectations[message];
}
process.addListener('exit', function () {
  Object.keys(expectations).forEach(function (message) {
    throw expectations[message];
  });
});
