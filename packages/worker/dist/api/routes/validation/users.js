"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildUserBulkSaveValidation = exports.buildUserSaveValidation = void 0;
const { joiValidator } = require("@budibase/backend-core/auth");
const joi_1 = __importDefault(require("joi"));
let schema = {
    email: joi_1.default.string().allow(null, ""),
    password: joi_1.default.string().allow(null, ""),
    forceResetPassword: joi_1.default.boolean().optional(),
    firstName: joi_1.default.string().allow(null, ""),
    lastName: joi_1.default.string().allow(null, ""),
    builder: joi_1.default.object({
        global: joi_1.default.boolean().optional(),
        apps: joi_1.default.array().optional(),
    })
        .unknown(true)
        .optional(),
    // maps appId -> roleId for the user
    roles: joi_1.default.object().pattern(/.*/, joi_1.default.string()).required().unknown(true),
};
const buildUserSaveValidation = (isSelf = false) => {
    if (!isSelf) {
        schema = Object.assign(Object.assign({}, schema), { _id: joi_1.default.string(), _rev: joi_1.default.string() });
    }
    return joiValidator.body(joi_1.default.object(schema).required().unknown(true));
};
exports.buildUserSaveValidation = buildUserSaveValidation;
const buildUserBulkSaveValidation = (isSelf = false) => {
    if (!isSelf) {
        schema = Object.assign(Object.assign({}, schema), { _id: joi_1.default.string(), _rev: joi_1.default.string() });
    }
    let bulkSaveSchema = {
        groups: joi_1.default.array().optional(),
        users: joi_1.default.array().items(joi_1.default.object(schema).required().unknown(true)),
    };
    return joiValidator.body(joi_1.default.object(bulkSaveSchema).required().unknown(true));
};
exports.buildUserBulkSaveValidation = buildUserBulkSaveValidation;
