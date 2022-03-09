"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hasNextSupport = exports.name = exports.isCI = void 0;
var _ciInfo = _interopRequireDefault(require("next/dist/compiled/ci-info"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const { isCI: _isCI , name: _name  } = _ciInfo.default;
const isZeitNow = !!process.env.NOW_BUILDER;
const envStack = process.env.STACK;
const isHeroku = typeof envStack === 'string' && envStack.toLowerCase().includes('heroku');
const isCI = isZeitNow || isHeroku || _isCI;
exports.isCI = isCI;
const name = isZeitNow ? 'ZEIT Now' : isHeroku ? 'Heroku' : _name;
exports.name = name;
const hasNextSupport = Boolean(isZeitNow);
exports.hasNextSupport = hasNextSupport;

//# sourceMappingURL=ci-info.js.map