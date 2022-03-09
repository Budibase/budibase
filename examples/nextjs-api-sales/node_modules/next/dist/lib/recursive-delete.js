"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.recursiveDelete = recursiveDelete;
var _fs = require("fs");
var _path = require("path");
var _util = require("util");
var _isError = _interopRequireDefault(require("./is-error"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
const sleep = (0, _util).promisify(setTimeout);
const unlinkPath = async (p, isDir = false, t = 1)=>{
    try {
        if (isDir) {
            await _fs.promises.rmdir(p);
        } else {
            await _fs.promises.unlink(p);
        }
    } catch (e) {
        const code = (0, _isError).default(e) && e.code;
        if ((code === 'EBUSY' || code === 'ENOTEMPTY' || code === 'EPERM' || code === 'EMFILE') && t < 3) {
            await sleep(t * 100);
            return unlinkPath(p, isDir, t++);
        }
        if (code === 'ENOENT') {
            return;
        }
        throw e;
    }
};
async function recursiveDelete(dir, exclude, previousPath = '') {
    let result;
    try {
        result = await _fs.promises.readdir(dir, {
            withFileTypes: true
        });
    } catch (e) {
        if ((0, _isError).default(e) && e.code === 'ENOENT') {
            return;
        }
        throw e;
    }
    await Promise.all(result.map(async (part)=>{
        const absolutePath = (0, _path).join(dir, part.name);
        // readdir does not follow symbolic links
        // if part is a symbolic link, follow it using stat
        let isDirectory = part.isDirectory();
        const isSymlink = part.isSymbolicLink();
        if (isSymlink) {
            const linkPath = await _fs.promises.readlink(absolutePath);
            try {
                const stats = await _fs.promises.stat((0, _path).isAbsolute(linkPath) ? linkPath : (0, _path).join((0, _path).dirname(absolutePath), linkPath));
                isDirectory = stats.isDirectory();
            } catch (_) {
            }
        }
        const pp = (0, _path).join(previousPath, part.name);
        const isNotExcluded = !exclude || !exclude.test(pp);
        if (isNotExcluded) {
            if (isDirectory) {
                await recursiveDelete(absolutePath, exclude, pp);
            }
            return unlinkPath(absolutePath, !isSymlink && isDirectory);
        }
    }));
}

//# sourceMappingURL=recursive-delete.js.map