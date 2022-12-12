"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newid = void 0;
const uuid_1 = require("uuid");
function newid() {
    return (0, uuid_1.v4)().replace(/-/g, "");
}
exports.newid = newid;
//# sourceMappingURL=newid.js.map