"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionSource = exports.PermissionType = exports.BuiltinPermissionID = exports.PermissionLevel = void 0;
// used in resource permissions - permissions can be at one of these levels
// endpoints will set what type of permission they require (e.g. searching requires READ)
var PermissionLevel;
(function (PermissionLevel) {
    PermissionLevel["READ"] = "read";
    PermissionLevel["WRITE"] = "write";
    PermissionLevel["EXECUTE"] = "execute";
    PermissionLevel["ADMIN"] = "admin";
})(PermissionLevel || (exports.PermissionLevel = PermissionLevel = {}));
// used within the role, specifies base permissions
var BuiltinPermissionID;
(function (BuiltinPermissionID) {
    BuiltinPermissionID["PUBLIC"] = "public";
    BuiltinPermissionID["READ_ONLY"] = "read_only";
    BuiltinPermissionID["WRITE"] = "write";
    BuiltinPermissionID["ADMIN"] = "admin";
    BuiltinPermissionID["POWER"] = "power";
})(BuiltinPermissionID || (exports.BuiltinPermissionID = BuiltinPermissionID = {}));
// these are the global types, that govern the underlying default behaviour
var PermissionType;
(function (PermissionType) {
    PermissionType["APP"] = "app";
    PermissionType["TABLE"] = "table";
    PermissionType["USER"] = "user";
    PermissionType["AUTOMATION"] = "automation";
    PermissionType["WEBHOOK"] = "webhook";
    PermissionType["BUILDER"] = "builder";
    PermissionType["CREATOR"] = "creator";
    PermissionType["GLOBAL_BUILDER"] = "globalBuilder";
    PermissionType["QUERY"] = "query";
    PermissionType["VIEW"] = "view";
    PermissionType["LEGACY_VIEW"] = "legacy_view";
})(PermissionType || (exports.PermissionType = PermissionType = {}));
var PermissionSource;
(function (PermissionSource) {
    PermissionSource["EXPLICIT"] = "EXPLICIT";
    PermissionSource["INHERITED"] = "INHERITED";
    PermissionSource["BASE"] = "BASE";
})(PermissionSource || (exports.PermissionSource = PermissionSource = {}));
