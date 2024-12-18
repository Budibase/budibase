"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanModel = exports.PriceDuration = exports.PlanType = void 0;
var PlanType;
(function (PlanType) {
    PlanType["FREE"] = "free";
    /** @deprecated */
    PlanType["PRO"] = "pro";
    /** @deprecated */
    PlanType["TEAM"] = "team";
    /** @deprecated */
    PlanType["PREMIUM"] = "premium";
    PlanType["PREMIUM_PLUS"] = "premium_plus";
    PlanType["PREMIUM_PLUS_TRIAL"] = "premium_plus_trial";
    /** @deprecated */
    PlanType["BUSINESS"] = "business";
    PlanType["ENTERPRISE_BASIC"] = "enterprise_basic";
    PlanType["ENTERPRISE_BASIC_TRIAL"] = "enterprise_basic_trial";
    PlanType["ENTERPRISE"] = "enterprise";
})(PlanType || (exports.PlanType = PlanType = {}));
var PriceDuration;
(function (PriceDuration) {
    PriceDuration["MONTHLY"] = "monthly";
    PriceDuration["YEARLY"] = "yearly";
})(PriceDuration || (exports.PriceDuration = PriceDuration = {}));
var PlanModel;
(function (PlanModel) {
    PlanModel["PER_USER"] = "perUser";
    PlanModel["PER_CREATOR_PER_USER"] = "per_creator_per_user";
})(PlanModel || (exports.PlanModel = PlanModel = {}));
