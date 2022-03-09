'use strict';

var hasOwn = require('../');
var test = require('tape');
var runTests = require('./tests');

test('as a function', function (t) {
	t.test('bad array/this value', function (st) {
		st['throws'](function () { hasOwn(undefined); }, TypeError, 'undefined is not an object');
		st['throws'](function () { hasOwn(null); }, TypeError, 'null is not an object');
		st.end();
	});

	runTests(hasOwn, t);

	t.end();
});
