"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserGroup = void 0;
const UserGroup = () => {
    let group = {
        apps: [],
        color: "var(--spectrum-global-color-blue-600)",
        icon: "UserGroup",
        name: "New group",
        roles: {},
        users: [],
    };
    return group;
};
exports.UserGroup = UserGroup;
