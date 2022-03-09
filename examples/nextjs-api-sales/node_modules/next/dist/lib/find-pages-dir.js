"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.findPagesDir = findPagesDir;
exports.existsSync = void 0;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const existsSync = (f)=>{
    try {
        _fs.default.accessSync(f, _fs.default.constants.F_OK);
        return true;
    } catch (_) {
        return false;
    }
};
exports.existsSync = existsSync;
function findPagesDir(dir) {
    // prioritize ./pages over ./src/pages
    let curDir = _path.default.join(dir, 'pages');
    if (existsSync(curDir)) return curDir;
    curDir = _path.default.join(dir, 'src/pages');
    if (existsSync(curDir)) return curDir;
    // Check one level up the tree to see if the pages directory might be there
    if (existsSync(_path.default.join(dir, '..', 'pages'))) {
        throw new Error('> No `pages` directory found. Did you mean to run `next` in the parent (`../`) directory?');
    }
    throw new Error("> Couldn't find a `pages` directory. Please create one under the project root");
}

//# sourceMappingURL=find-pages-dir.js.map