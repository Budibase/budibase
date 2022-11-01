import { License, PlanType, Quotas } from "@budibase/types";
export declare const newLicense: (opts: {
    quotas: Quotas;
    planType?: PlanType;
}) => License;
