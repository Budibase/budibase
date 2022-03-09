"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.writeAppTypeDeclarations = writeAppTypeDeclarations;
var _os = _interopRequireDefault(require("os"));
var _path = _interopRequireDefault(require("path"));
var _fs = require("fs");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function writeAppTypeDeclarations(baseDir, imageImportsEnabled) {
    // Reference `next` types
    const appTypeDeclarations = _path.default.join(baseDir, 'next-env.d.ts');
    // Defaults EOL to system default
    let eol = _os.default.EOL;
    let currentContent;
    try {
        currentContent = await _fs.promises.readFile(appTypeDeclarations, 'utf8');
        // If file already exists then preserve its line ending
        const lf = currentContent.indexOf('\n', /* skip first so we can lf - 1 */ 1);
        if (lf !== -1) {
            if (currentContent[lf - 1] === '\r') {
                eol = '\r\n';
            } else {
                eol = '\n';
            }
        }
    } catch (err) {
    }
    const content = '/// <reference types="next" />' + eol + (imageImportsEnabled ? '/// <reference types="next/image-types/global" />' + eol : '') + eol + '// NOTE: This file should not be edited' + eol + '// see https://nextjs.org/docs/basic-features/typescript for more information.' + eol;
    // Avoids an un-necessary write on read-only fs
    if (currentContent === content) {
        return;
    }
    await _fs.promises.writeFile(appTypeDeclarations, content);
}

//# sourceMappingURL=writeAppTypeDeclarations.js.map