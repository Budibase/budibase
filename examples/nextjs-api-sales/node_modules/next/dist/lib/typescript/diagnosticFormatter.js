"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getFormattedDiagnostic = getFormattedDiagnostic;
exports.DiagnosticCategory = void 0;
var _codeFrame = require("next/dist/compiled/babel/code-frame");
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var DiagnosticCategory;
exports.DiagnosticCategory = DiagnosticCategory;
(function(DiagnosticCategory) {
    DiagnosticCategory[DiagnosticCategory["Warning"] = 0] = "Warning";
    DiagnosticCategory[DiagnosticCategory["Error"] = 1] = "Error";
    DiagnosticCategory[DiagnosticCategory["Suggestion"] = 2] = "Suggestion";
    DiagnosticCategory[DiagnosticCategory["Message"] = 3] = "Message";
})(DiagnosticCategory || (exports.DiagnosticCategory = DiagnosticCategory = {
}));
async function getFormattedDiagnostic(ts, baseDir, diagnostic) {
    let message = '';
    const reason = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    const category = diagnostic.category;
    switch(category){
        // Warning
        case DiagnosticCategory.Warning:
            {
                message += _chalk.default.yellow.bold('Type warning') + ': ';
                break;
            }
        // Error
        case DiagnosticCategory.Error:
            {
                message += _chalk.default.red.bold('Type error') + ': ';
                break;
            }
        // 2 = Suggestion, 3 = Message
        case DiagnosticCategory.Suggestion:
        case DiagnosticCategory.Message:
        default:
            {
                message += _chalk.default.cyan.bold(category === 2 ? 'Suggestion' : 'Info') + ': ';
                break;
            }
    }
    message += reason + '\n';
    if (diagnostic.file) {
        const pos = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        const line = pos.line + 1;
        const character = pos.character + 1;
        let fileName = _path.default.posix.normalize(_path.default.relative(baseDir, diagnostic.file.fileName).replace(/\\/g, '/'));
        if (!fileName.startsWith('.')) {
            fileName = './' + fileName;
        }
        message = _chalk.default.cyan(fileName) + ':' + _chalk.default.yellow(line.toString()) + ':' + _chalk.default.yellow(character.toString()) + '\n' + message;
        message += '\n' + (0, _codeFrame).codeFrameColumns(diagnostic.file.getFullText(diagnostic.file.getSourceFile()), {
            start: {
                line: line,
                column: character
            }
        }, {
            forceColor: true
        });
    }
    return message;
}

//# sourceMappingURL=diagnosticFormatter.js.map