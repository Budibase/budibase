"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.recursiveReadDirSync = recursiveReadDirSync;
var _fs = _interopRequireDefault(require("fs"));
var _path = require("path");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function recursiveReadDirSync(dir, arr = [], rootDir = dir) {
    const result = _fs.default.readdirSync(dir);
    result.forEach((part)=>{
        const absolutePath = (0, _path).join(dir, part);
        const pathStat = _fs.default.statSync(absolutePath);
        if (pathStat.isDirectory()) {
            recursiveReadDirSync(absolutePath, arr, rootDir);
            return;
        }
        arr.push(absolutePath.replace(rootDir, ''));
    });
    return arr;
}

//# sourceMappingURL=recursive-readdir-sync.js.map