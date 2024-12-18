"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceType = exports.ServiceType = void 0;
var ServiceType;
(function (ServiceType) {
    ServiceType["WORKER"] = "worker";
    ServiceType["APPS"] = "apps";
})(ServiceType || (exports.ServiceType = ServiceType = {}));
var MaintenanceType;
(function (MaintenanceType) {
    MaintenanceType["SQS_MISSING"] = "sqs_missing";
})(MaintenanceType || (exports.MaintenanceType = MaintenanceType = {}));
