import { __read, __spread } from "tslib";
import * as fs from 'fs';
import * as path from 'path';
/**
 * Recursively read the contents of a directory.
 *
 * @param targetDir Absolute or relative path of the directory to scan. All returned paths will be relative to this
 * directory.
 * @returns Array holding all relative paths
 */
export function deepReadDirSync(targetDir) {
    var targetDirAbsPath = path.resolve(targetDir);
    if (!fs.existsSync(targetDirAbsPath)) {
        throw new Error("Cannot read contents of " + targetDirAbsPath + ". Directory does not exist.");
    }
    if (!fs.statSync(targetDirAbsPath).isDirectory()) {
        throw new Error("Cannot read contents of " + targetDirAbsPath + ", because it is not a directory.");
    }
    // This does the same thing as its containing function, `deepReadDirSync` (except that - purely for convenience - it
    // deals in absolute paths rather than relative ones). We need this to be separate from the outer function to preserve
    // the difference between `targetDirAbsPath` and `currentDirAbsPath`.
    var deepReadCurrentDir = function (currentDirAbsPath) {
        return fs.readdirSync(currentDirAbsPath).reduce(function (absPaths, itemName) {
            var itemAbsPath = path.join(currentDirAbsPath, itemName);
            if (fs.statSync(itemAbsPath).isDirectory()) {
                return __spread(absPaths, deepReadCurrentDir(itemAbsPath));
            }
            return __spread(absPaths, [itemAbsPath]);
        }, []);
    };
    return deepReadCurrentDir(targetDirAbsPath).map(function (absPath) { return path.relative(targetDirAbsPath, absPath); });
}
//# sourceMappingURL=utils.js.map