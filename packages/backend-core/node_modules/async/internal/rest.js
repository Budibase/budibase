'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = rest;

var _overRest2 = require('lodash/_overRest');

var _overRest3 = _interopRequireDefault(_overRest2);

var _identity = require('lodash/identity');

var _identity2 = _interopRequireDefault(_identity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Lodash rest function without function.toString()
// remappings
function rest(func, start) {
    return (0, _overRest3.default)(func, start, _identity2.default);
}
module.exports = exports['default'];