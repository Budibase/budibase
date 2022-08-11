"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logWarn = exports.logAlertWithInfo = exports.logAlert = void 0;
const NonErrors = ["AccountError"];
function isSuppressed(e) {
    return e && e["suppressAlert"];
}
function logAlert(message, e) {
    if (e && NonErrors.includes(e.name) && isSuppressed(e)) {
        return;
    }
    let errorJson = "";
    if (e) {
        errorJson = ": " + JSON.stringify(e, Object.getOwnPropertyNames(e));
    }
    console.error(`bb-alert: ${message} ${errorJson}`);
}
exports.logAlert = logAlert;
function logAlertWithInfo(message, db, id, error) {
    message = `${message} - db: ${db} - doc: ${id} - error: `;
    logAlert(message, error);
}
exports.logAlertWithInfo = logAlertWithInfo;
function logWarn(message) {
    console.warn(`bb-warn: ${message}`);
}
exports.logWarn = logWarn;
exports.default = {
    logAlert,
    logAlertWithInfo,
    logWarn,
};
//# sourceMappingURL=logging.js.map