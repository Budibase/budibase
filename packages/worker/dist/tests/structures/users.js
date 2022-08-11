"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.builderUser = exports.adminUser = exports.user = exports.email = void 0;
exports.email = "test@test.com";
const user = (userProps) => {
    return Object.assign({ email: "test@test.com", password: "test", roles: {} }, userProps);
};
exports.user = user;
const adminUser = (userProps) => {
    return Object.assign(Object.assign({}, (0, exports.user)(userProps)), { admin: {
            global: true,
        } });
};
exports.adminUser = adminUser;
const builderUser = (userProps) => {
    return Object.assign(Object.assign({}, (0, exports.user)(userProps)), { builder: {
            global: true,
        } });
};
exports.builderUser = builderUser;
