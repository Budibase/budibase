"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getCustomDocumentImageError = getCustomDocumentImageError;
var _chalk = _interopRequireDefault(require("next/dist/compiled/chalk"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function getCustomDocumentImageError() {
    return `Images ${_chalk.default.bold('cannot')} be imported within ${_chalk.default.cyan('pages/_document.js')}. Please move image imports that need to be displayed on every page into ${_chalk.default.cyan('pages/_app.js')}.\nRead more: https://nextjs.org/docs/messages/custom-document-image-import`;
}

//# sourceMappingURL=messages.js.map