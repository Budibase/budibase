'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var lie = _interopDefault(require('lie'));

/* istanbul ignore next */
var PouchPromise = typeof Promise === 'function' ? Promise : lie;

module.exports = PouchPromise;
