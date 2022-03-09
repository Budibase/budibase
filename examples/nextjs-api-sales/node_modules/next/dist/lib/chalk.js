"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = void 0;
let chalk;
if (!process.browser) {
    chalk = require('next/dist/compiled/chalk');
} else {
    chalk = require('./web/chalk').default;
}
var _default = chalk;
exports.default = _default;

//# sourceMappingURL=chalk.js.map