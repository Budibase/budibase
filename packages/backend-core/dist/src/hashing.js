"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const bcrypt = require("bcrypt");
const env = require("./environment");
const { v4 } = require("uuid");
const SALT_ROUNDS = env.SALT_ROUNDS || 10;
exports.hash = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(data, salt);
});
exports.compare = (data, encrypted) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt.compare(data, encrypted);
});
exports.newid = function () {
    return v4().replace(/-/g, "");
};
//# sourceMappingURL=hashing.js.map