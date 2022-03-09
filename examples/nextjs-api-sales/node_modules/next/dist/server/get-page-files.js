"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPageFiles = getPageFiles;
var _normalizePagePath = require("./normalize-page-path");
function getPageFiles(buildManifest, page) {
    const normalizedPage = (0, _normalizePagePath).denormalizePagePath((0, _normalizePagePath).normalizePagePath(page));
    let files = buildManifest.pages[normalizedPage];
    if (!files) {
        console.warn(`Could not find files for ${normalizedPage} in .next/build-manifest.json`);
        return [];
    }
    return files;
}

//# sourceMappingURL=get-page-files.js.map