"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextKeys = void 0;
var ContextKeys;
(function (ContextKeys) {
    ContextKeys["TENANT_ID"] = "tenantId";
    ContextKeys["GLOBAL_DB"] = "globalDb";
    ContextKeys["APP_ID"] = "appId";
    ContextKeys["IDENTITY"] = "identity";
    // whatever the request app DB was
    ContextKeys["CURRENT_DB"] = "currentDb";
    // get the prod app DB from the request
    ContextKeys["PROD_DB"] = "prodDb";
    // get the dev app DB from the request
    ContextKeys["DEV_DB"] = "devDb";
    ContextKeys["DB_OPTS"] = "dbOpts";
    // check if something else is using the context, don't close DB
    ContextKeys["TENANCY_IN_USE"] = "tenancyInUse";
    ContextKeys["APP_IN_USE"] = "appInUse";
    ContextKeys["IDENTITY_IN_USE"] = "identityInUse";
})(ContextKeys = exports.ContextKeys || (exports.ContextKeys = {}));
//# sourceMappingURL=constants.js.map