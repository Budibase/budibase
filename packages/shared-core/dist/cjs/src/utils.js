"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unreachable = void 0;
function unreachable(value, message = `No such case in exhaustive switch: ${value}`) {
    throw new Error(message);
}
exports.unreachable = unreachable;
//# sourceMappingURL=utils.js.map