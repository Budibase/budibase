"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isWriteable = isWriteable;
var _fs = _interopRequireDefault(require("fs"));
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
async function isWriteable(directory) {
    try {
        await _fs.default.promises.access(directory, (_fs.default.constants || _fs.default).W_OK);
        return true;
    } catch (err) {
        return false;
    }
}

//# sourceMappingURL=is-writeable.js.map