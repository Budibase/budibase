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
})(LockType = exports.LockType || (exports.LockType = {}));
var LockName;
(function (LockName) {
    LockName["MIGRATIONS"] = "migrations";
    LockName["TRIGGER_QUOTA"] = "trigger_quota";
})(LockName = exports.LockName || (exports.LockName = {}));
//# sourceMappingURL=locks.js.map