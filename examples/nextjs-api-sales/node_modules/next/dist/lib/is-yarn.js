"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isYarn = void 0;
var _path = require("path");
var _fileExists = require("./file-exists");
const isYarn = async (dir)=>await (0, _fileExists).fileExists((0, _path).join(dir, 'yarn.lock')).catch(()=>false
    )
;
exports.isYarn = isYarn;

//# sourceMappingURL=is-yarn.js.map