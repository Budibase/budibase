Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("@sentry/utils");
/** Gets the module */
function getModule(filename) {
    if (!filename) {
        return;
    }
    // We could use optional chaining here but webpack does like that mixed with require
    var base = ((require && require.main && require.main.filename && utils_1.dirname(require.main.filename)) || global.process.cwd()) + "/";
    // It's specifically a module
    var file = utils_1.basename(filename, '.js');
    var path = utils_1.dirname(filename);
    var n = path.lastIndexOf('/node_modules/');
    if (n > -1) {
        // /node_modules/ is 14 chars
        return path.substr(n + 14).replace(/\//g, '.') + ":" + file;
    }
    // Let's see if it's a part of the main module
    // To be a part of main module, it has to share the same base
    n = (path + "/").lastIndexOf(base, 0);
    if (n === 0) {
        var moduleName = path.substr(base.length).replace(/\//g, '.');
        if (moduleName) {
            moduleName += ':';
        }
        moduleName += file;
        return moduleName;
    }
    return file;
}
var FILENAME_MATCH = /^\s*[-]{4,}$/;
var FULL_MATCH = /at (?:async )?(?:(.+?)\s+\()?(?:(.+?):(\d+)(?::(\d+))?|([^)]+))\)?/;
// eslint-disable-next-line complexity
var node = function (line) {
    var _a;
    if (line.match(FILENAME_MATCH)) {
        return {
            filename: line,
        };
    }
    var lineMatch = line.match(FULL_MATCH);
    if (!lineMatch) {
        return undefined;
    }
    var object;
    var method;
    var functionName;
    var typeName;
    var methodName;
    if (lineMatch[1]) {
        functionName = lineMatch[1];
        var methodStart = functionName.lastIndexOf('.');
        if (functionName[methodStart - 1] === '.') {
            // eslint-disable-next-line no-plusplus
            methodStart--;
        }
        if (methodStart > 0) {
            object = functionName.substr(0, methodStart);
            method = functionName.substr(methodStart + 1);
            var objectEnd = object.indexOf('.Module');
            if (objectEnd > 0) {
                functionName = functionName.substr(objectEnd + 1);
                object = object.substr(0, objectEnd);
            }
        }
        typeName = undefined;
    }
    if (method) {
        typeName = object;
        methodName = method;
    }
    if (method === '<anonymous>') {
        methodName = undefined;
        functionName = undefined;
    }
    if (functionName === undefined) {
        methodName = methodName || '<anonymous>';
        functionName = typeName ? typeName + "." + methodName : methodName;
    }
    var filename = ((_a = lineMatch[2]) === null || _a === void 0 ? void 0 : _a.startsWith('file://')) ? lineMatch[2].substr(7) : lineMatch[2];
    var isNative = lineMatch[5] === 'native';
    var isInternal = isNative || (filename && !filename.startsWith('/') && !filename.startsWith('.') && filename.indexOf(':\\') !== 1);
    // in_app is all that's not an internal Node function or a module within node_modules
    // note that isNative appears to return true even for node core libraries
    // see https://github.com/getsentry/raven-node/issues/176
    var in_app = !isInternal && filename !== undefined && !filename.includes('node_modules/');
    return {
        filename: filename,
        module: getModule(filename),
        function: functionName,
        lineno: parseInt(lineMatch[3], 10) || undefined,
        colno: parseInt(lineMatch[4], 10) || undefined,
        in_app: in_app,
    };
};
exports.nodeStackParser = [90, node];
//# sourceMappingURL=stack-parser.js.map