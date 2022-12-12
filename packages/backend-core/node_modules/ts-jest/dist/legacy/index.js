"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_jest_transformer_1 = require("./ts-jest-transformer");
exports.default = {
    createTransformer: function () { return new ts_jest_transformer_1.TsJestTransformer(); },
};
