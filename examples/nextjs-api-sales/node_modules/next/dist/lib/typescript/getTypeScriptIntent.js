"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getTypeScriptIntent = getTypeScriptIntent;
var _fs = require("fs");
var _path = _interopRequireDefault(require("path"));
var _fileExists = require("../file-exists");
var _recursiveReaddir = require("../recursive-readdir");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function getTypeScriptIntent(baseDir, pagesDir, config) {
    const tsConfigPath = _path.default.join(baseDir, config.typescript.tsconfigPath);
    // The integration turns on if we find a `tsconfig.json` in the user's
    // project.
    const hasTypeScriptConfiguration = await (0, _fileExists).fileExists(tsConfigPath);
    if (hasTypeScriptConfiguration) {
        const content = await _fs.promises.readFile(tsConfigPath, {
            encoding: 'utf8'
        }).then((txt)=>txt.trim()
        , ()=>null
        );
        return {
            firstTimeSetup: content === '' || content === '{}'
        };
    }
    // Next.js also offers a friendly setup mode that bootstraps a TypeScript
    // project for the user when we detect TypeScript files. So, we need to check
    // the `pages/` directory for a TypeScript file.
    // Checking all directories is too slow, so this is a happy medium.
    const typescriptFiles = await (0, _recursiveReaddir).recursiveReadDir(pagesDir, /.*\.(ts|tsx)$/, /(node_modules|.*\.d\.ts)/);
    if (typescriptFiles.length) {
        return {
            firstTimeSetup: true
        };
    }
    return false;
}

//# sourceMappingURL=getTypeScriptIntent.js.map