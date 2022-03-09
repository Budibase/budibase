"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getBabelError = getBabelError;
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
function getBabelError(fileName, err) {
    if (err.code !== 'BABEL_PARSE_ERROR') {
        return false;
    }
    // https://github.com/babel/babel/blob/34693d6024da3f026534dd8d569f97ac0109602e/packages/babel-core/src/parser/index.js
    if (err.loc) {
        const lineNumber = Math.max(1, err.loc.line);
        const column = Math.max(1, err.loc.column);
        let message = err.message// Remove file information, which instead is provided by webpack.
        .replace(/^.+?: /, '')// Remove column information from message
        .replace(new RegExp(`[^\\S\\r\\n]*\\(${lineNumber}:${column}\\)[^\\S\\r\\n]*`), '');
        return new _simpleWebpackError.SimpleWebpackError(`${chalk.cyan(fileName)}:${chalk.yellow(lineNumber.toString())}:${chalk.yellow(column.toString())}`, chalk.red.bold('Syntax error').concat(`: ${message}`));
    }
    return false;
}

//# sourceMappingURL=parseBabel.js.map