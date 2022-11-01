"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newLicense = void 0;
const types_1 = require("@budibase/types");
const newPlan = (type = types_1.PlanType.FREE) => {
    return {
        type,
    };
};
const newLicense = (opts) => {
    return {
        features: [],
        quotas: opts.quotas,
        plan: newPlan(opts.planType),
    };
};
exports.newLicense = newLicense;
//# sourceMappingURL=licenses.js.map