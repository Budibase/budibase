"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = loadJsConfig;
var _path = _interopRequireDefault(require("path"));
var _fileExists = require("../lib/file-exists");
var Log = _interopRequireWildcard(require("./output/log"));
var _getTypeScriptConfiguration = require("../lib/typescript/getTypeScriptConfiguration");
var _fs = require("fs");
var _isError = _interopRequireDefault(require("../lib/is-error"));
var _codeFrame = require("next/dist/compiled/babel/code-frame");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {
        };
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {
                    };
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
let TSCONFIG_WARNED = false;
function parseJsonFile(filePath) {
    const JSON5 = require('next/dist/compiled/json5');
    const contents = (0, _fs).readFileSync(filePath, 'utf8');
    // Special case an empty file
    if (contents.trim() === '') {
        return {
        };
    }
    try {
        return JSON5.parse(contents);
    } catch (err) {
        if (!(0, _isError).default(err)) throw err;
        const codeFrame = (0, _codeFrame).codeFrameColumns(String(contents), {
            start: {
                line: err.lineNumber || 0,
                column: err.columnNumber || 0
            }
        }, {
            message: err.message,
            highlightCode: true
        });
        throw new Error(`Failed to parse "${filePath}":\n${codeFrame}`);
    }
}
async function loadJsConfig(dir, config) {
    var ref;
    let typeScriptPath;
    try {
        typeScriptPath = require.resolve('typescript', {
            paths: [
                dir
            ]
        });
    } catch (_) {
    }
    const tsConfigPath = _path.default.join(dir, config.typescript.tsconfigPath);
    const useTypeScript = Boolean(typeScriptPath && await (0, _fileExists).fileExists(tsConfigPath));
    let jsConfig;
    // jsconfig is a subset of tsconfig
    if (useTypeScript) {
        if (config.typescript.tsconfigPath !== 'tsconfig.json' && TSCONFIG_WARNED === false) {
            TSCONFIG_WARNED = true;
            Log.info(`Using tsconfig file: ${config.typescript.tsconfigPath}`);
        }
        const ts = await Promise.resolve(require(typeScriptPath));
        const tsConfig = await (0, _getTypeScriptConfiguration).getTypeScriptConfiguration(ts, tsConfigPath, true);
        jsConfig = {
            compilerOptions: tsConfig.options
        };
    }
    const jsConfigPath = _path.default.join(dir, 'jsconfig.json');
    if (!useTypeScript && await (0, _fileExists).fileExists(jsConfigPath)) {
        jsConfig = parseJsonFile(jsConfigPath);
    }
    let resolvedBaseUrl;
    if (jsConfig === null || jsConfig === void 0 ? void 0 : (ref = jsConfig.compilerOptions) === null || ref === void 0 ? void 0 : ref.baseUrl) {
        resolvedBaseUrl = _path.default.resolve(dir, jsConfig.compilerOptions.baseUrl);
    }
    return {
        useTypeScript,
        jsConfig,
        resolvedBaseUrl
    };
}

//# sourceMappingURL=load-jsconfig.js.map