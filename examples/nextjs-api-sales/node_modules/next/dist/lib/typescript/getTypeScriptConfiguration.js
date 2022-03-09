"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getTypeScriptConfiguration = getTypeScriptConfiguration;
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
var _os = _interopRequireDefault(require("os"));
var _path = _interopRequireDefault(require("path"));
var _fatalError = require("../fatal-error");
var _isError = _interopRequireDefault(require("../is-error"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function getTypeScriptConfiguration(ts, tsConfigPath, metaOnly) {
    try {
        var ref;
        const formatDiagnosticsHost = {
            getCanonicalFileName: (fileName)=>fileName
            ,
            getCurrentDirectory: ts.sys.getCurrentDirectory,
            getNewLine: ()=>_os.default.EOL
        };
        const { config , error  } = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
        if (error) {
            throw new _fatalError.FatalError(ts.formatDiagnostic(error, formatDiagnosticsHost));
        }
        let configToParse = config;
        const result = ts.parseJsonConfigFileContent(configToParse, // When only interested in meta info,
        // avoid enumerating all files (for performance reasons)
        metaOnly ? {
            ...ts.sys,
            readDirectory (_path, extensions, _excludes, _includes, _depth) {
                return [
                    extensions ? `file${extensions[0]}` : `file.ts`
                ];
            }
        } : ts.sys, _path.default.dirname(tsConfigPath));
        if (result.errors) {
            result.errors = result.errors.filter(({ code  })=>// No inputs were found in config file
                code !== 18003
            );
        }
        if ((ref = result.errors) === null || ref === void 0 ? void 0 : ref.length) {
            throw new _fatalError.FatalError(ts.formatDiagnostic(result.errors[0], formatDiagnosticsHost));
        }
        return result;
    } catch (err) {
        if ((0, _isError).default(err) && err.name === 'SyntaxError') {
            var _message;
            const reason = '\n' + ((_message = err.message) !== null && _message !== void 0 ? _message : '');
            throw new _fatalError.FatalError(_chalk.default.red.bold('Could not parse', _chalk.default.cyan('tsconfig.json') + '.' + ' Please make sure it contains syntactically correct JSON.') + reason);
        }
        throw err;
    }
}

//# sourceMappingURL=getTypeScriptConfiguration.js.map