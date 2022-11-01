"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAppBackupMetadata = exports.ScheduleRepeatPeriod = exports.ScheduleType = void 0;
var ScheduleType;
(function (ScheduleType) {
    ScheduleType["APP_BACKUP"] = "app_backup";
})(ScheduleType = exports.ScheduleType || (exports.ScheduleType = {}));
var ScheduleRepeatPeriod;
(function (ScheduleRepeatPeriod) {
    ScheduleRepeatPeriod["DAILY"] = "daily";
    ScheduleRepeatPeriod["WEEKLY"] = "weekly";
    ScheduleRepeatPeriod["MONTHLY"] = "monthly";
})(ScheduleRepeatPeriod = exports.ScheduleRepeatPeriod || (exports.ScheduleRepeatPeriod = {}));
const isAppBackupMetadata = (type, metadata) => {
    return type === ScheduleType.APP_BACKUP;
};
exports.isAppBackupMetadata = isAppBackupMetadata;
//# sourceMappingURL=schedule.js.map