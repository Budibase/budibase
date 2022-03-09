"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getScssError = getScssError;
var _codeFrame = require("next/dist/compiled/babel/code-frame");
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
const regexScssError = /SassError: (.+)\n\s+on line (\d+) [\s\S]*?>> (.+)\n\s*(-+)\^$/m;
function getScssError(fileName, fileContent, err) {
    if (err.name !== 'SassError') {
        return false;
    }
    const res = regexScssError.exec(err.message);
    if (res) {
        const [, reason, _lineNumer, backupFrame, columnString] = res;
        const lineNumber = Math.max(1, parseInt(_lineNumer, 10));
        var ref;
        const column = (ref = columnString === null || columnString === void 0 ? void 0 : columnString.length) !== null && ref !== void 0 ? ref : 1;
        let frame;
        if (fileContent) {
            try {
                frame = (0, _codeFrame).codeFrameColumns(fileContent, {
                    start: {
                        line: lineNumber,
                        column
                    }
                }, {
                    forceColor: true
                });
            } catch  {
            }
        }
        return new _simpleWebpackError.SimpleWebpackError(`${chalk.cyan(fileName)}:${chalk.yellow(lineNumber.toString())}:${chalk.yellow(column.toString())}`, chalk.red.bold('Syntax error').concat(`: ${reason}\n\n${frame !== null && frame !== void 0 ? frame : backupFrame}`));
    }
    return false;
}

//# sourceMappingURL=parseScss.js.map