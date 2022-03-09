"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getCssError = getCssError;
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _simpleWebpackError = require("./simpleWebpackError");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const chalk = new _chalk.default.constructor({
    enabled: true
});
const regexCssError = /^(?:CssSyntaxError|SyntaxError)\n\n\((\d+):(\d*)\) (.*)$/s;
function getCssError(fileName, err) {
    if (!((err.name === 'CssSyntaxError' || err.name === 'SyntaxError') && err.stack === false && !(err instanceof SyntaxError))) {
        return false;
    }
    // https://github.com/postcss/postcss-loader/blob/d6931da177ac79707bd758436e476036a55e4f59/src/Error.js
    const res = regexCssError.exec(err.message);
    if (res) {
        const [, _lineNumer, _column, reason] = res;
        const lineNumber = Math.max(1, parseInt(_lineNumer, 10));
        const column = Math.max(1, parseInt(_column, 10));
        return new _simpleWebpackError.SimpleWebpackError(`${chalk.cyan(fileName)}:${chalk.yellow(lineNumber.toString())}:${chalk.yellow(column.toString())}`, chalk.red.bold('Syntax error').concat(`: ${reason}`));
    }
    return false;
}

//# sourceMappingURL=parseCss.js.map