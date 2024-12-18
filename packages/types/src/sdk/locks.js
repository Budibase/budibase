"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockName = exports.LockType = void 0;
var LockType;
(function (LockType) {
    /**
     * If this lock is already held the attempted operation will not be performed.
     * No retries will take place and no error will be thrown.
     */
    LockType["TRY_ONCE"] = "try_once";
    LockType["TRY_TWICE"] = "try_twice";
    LockType["DEFAULT"] = "default";
    LockType["DELAY_500"] = "delay_500";
    LockType["CUSTOM"] = "custom";
    LockType["AUTO_EXTEND"] = "auto_extend";
})(LockType || (exports.LockType = LockType = {}));
var LockName;
(function (LockName) {
    LockName["MIGRATIONS"] = "migrations";
    LockName["TRIGGER_QUOTA"] = "trigger_quota";
    LockName["SYNC_ACCOUNT_LICENSE"] = "sync_account_license";
    LockName["UPDATE_TENANTS_DOC"] = "update_tenants_doc";
    LockName["PERSIST_WRITETHROUGH"] = "persist_writethrough";
    LockName["QUOTA_USAGE_EVENT"] = "quota_usage_event";
    LockName["APP_MIGRATION"] = "app_migrations";
    LockName["PROCESS_USER_INVITE"] = "process_user_invite";
})(LockName || (exports.LockName = LockName = {}));
