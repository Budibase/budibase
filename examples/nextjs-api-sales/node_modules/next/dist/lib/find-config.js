"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.findConfig = findConfig;
var _findUp = _interopRequireDefault(require("next/dist/compiled/find-up"));
var _fs = _interopRequireDefault(require("fs"));
var _json5 = _interopRequireDefault(require("next/dist/compiled/json5"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function findConfig(directory, key) {
    // `package.json` configuration always wins. Let's check that first.
    const packageJsonPath = await (0, _findUp).default('package.json', {
        cwd: directory
    });
    if (packageJsonPath) {
        const packageJson = require(packageJsonPath);
        if (packageJson[key] != null && typeof packageJson[key] === 'object') {
            return packageJson[key];
        }
    }
    // If we didn't find the configuration in `package.json`, we should look for
    // known filenames.
    const filePath = await (0, _findUp).default([
        `.${key}rc.json`,
        `${key}.config.json`,
        `.${key}rc.js`,
        `${key}.config.js`, 
    ], {
        cwd: directory
    });
    if (filePath) {
        if (filePath.endsWith('.js')) {
            return require(filePath);
        }
        // We load JSON contents with JSON5 to allow users to comment in their
        // configuration file. This pattern was popularized by TypeScript.
        const fileContents = _fs.default.readFileSync(filePath, 'utf8');
        return _json5.default.parse(fileContents);
    }
    return null;
}

//# sourceMappingURL=find-config.js.map