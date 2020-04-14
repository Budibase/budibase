"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.newView = void 0;var _shortid = require("shortid");

var newView = function newView() {var modelId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;return {
    id: (0, _shortid.generate)(),
    name: "",
    modelId: modelId };};exports.newView = newView;
//# sourceMappingURL=views.js.map