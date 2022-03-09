"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.serveStatic = serveStatic;
exports.getContentType = getContentType;
exports.getExtension = getExtension;
var _send = _interopRequireDefault(require("next/dist/compiled/send"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function serveStatic(req, res, path) {
    return new Promise((resolve, reject)=>{
        (0, _send).default(req, path).on('directory', ()=>{
            // We don't allow directories to be read.
            const err = new Error('No directory access');
            err.code = 'ENOENT';
            reject(err);
        }).on('error', reject).pipe(res).on('finish', resolve);
    });
}
function getContentType(extWithoutDot) {
    if (extWithoutDot === 'avif') {
        // TODO: update "mime" package
        return 'image/avif';
    }
    const { mime  } = _send.default;
    if ('getType' in mime) {
        // 2.0
        return mime.getType(extWithoutDot);
    }
    // 1.0
    return mime.lookup(extWithoutDot);
}
function getExtension(contentType) {
    if (contentType === 'image/avif') {
        // TODO: update "mime" package
        return 'avif';
    }
    const { mime  } = _send.default;
    if ('getExtension' in mime) {
        // 2.0
        return mime.getExtension(contentType);
    }
    // 1.0
    return mime.extension(contentType);
}

//# sourceMappingURL=serve-static.js.map