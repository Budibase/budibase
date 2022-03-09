"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.findPageFile = findPageFile;
var _path = require("path");
var _chalk = _interopRequireDefault(require("../../lib/chalk"));
var _log = require("../../build/output/log");
var _fs = require("fs");
var _normalizePagePath = require("../normalize-page-path");
var _fileExists = require("../../lib/file-exists");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function isTrueCasePagePath(pagePath, pagesDir) {
    const pageSegments = (0, _path).normalize(pagePath).split(_path.sep).filter(Boolean);
    const segmentExistsPromises = pageSegments.map(async (segment, i)=>{
        const segmentParentDir = (0, _path).join(pagesDir, ...pageSegments.slice(0, i));
        const parentDirEntries = await _fs.promises.readdir(segmentParentDir);
        return parentDirEntries.includes(segment);
    });
    return (await Promise.all(segmentExistsPromises)).every(Boolean);
}
async function findPageFile(rootDir, normalizedPagePath, pageExtensions) {
    const foundPagePaths = [];
    const page = (0, _normalizePagePath).denormalizePagePath(normalizedPagePath);
    for (const extension of pageExtensions){
        if (!normalizedPagePath.endsWith('/index')) {
            const relativePagePath = `${page}.${extension}`;
            const pagePath = (0, _path).join(rootDir, relativePagePath);
            if (await (0, _fileExists).fileExists(pagePath)) {
                foundPagePaths.push(relativePagePath);
            }
        }
        const relativePagePathWithIndex = (0, _path).join(page, `index.${extension}`);
        const pagePathWithIndex = (0, _path).join(rootDir, relativePagePathWithIndex);
        if (await (0, _fileExists).fileExists(pagePathWithIndex)) {
            foundPagePaths.push(relativePagePathWithIndex);
        }
    }
    if (foundPagePaths.length < 1) {
        return null;
    }
    if (!await isTrueCasePagePath(foundPagePaths[0], rootDir)) {
        return null;
    }
    if (foundPagePaths.length > 1) {
        (0, _log).warn(`Duplicate page detected. ${_chalk.default.cyan((0, _path).join('pages', foundPagePaths[0]))} and ${_chalk.default.cyan((0, _path).join('pages', foundPagePaths[1]))} both resolve to ${_chalk.default.cyan(normalizedPagePath)}.`);
    }
    return foundPagePaths[0];
}

//# sourceMappingURL=find-page-file.js.map