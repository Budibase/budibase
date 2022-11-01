"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppBackupTrigger = exports.AppBackupStatus = exports.AppBackupType = void 0;
var AppBackupType;
(function (AppBackupType) {
    AppBackupType["BACKUP"] = "backup";
    AppBackupType["RESTORE"] = "restore";
})(AppBackupType = exports.AppBackupType || (exports.AppBackupType = {}));
var AppBackupStatus;
(function (AppBackupStatus) {
    AppBackupStatus["STARTED"] = "started";
    AppBackupStatus["PENDING"] = "pending";
    AppBackupStatus["COMPLETE"] = "complete";
    AppBackupStatus["FAILED"] = "failed";
})(AppBackupStatus = exports.AppBackupStatus || (exports.AppBackupStatus = {}));
var AppBackupTrigger;
(function (AppBackupTrigger) {
    AppBackupTrigger["PUBLISH"] = "publish";
    AppBackupTrigger["MANUAL"] = "manual";
    AppBackupTrigger["SCHEDULED"] = "scheduled";
    AppBackupTrigger["RESTORING"] = "restoring";
})(AppBackupTrigger = exports.AppBackupTrigger || (exports.AppBackupTrigger = {}));
//# sourceMappingURL=backup.js.map