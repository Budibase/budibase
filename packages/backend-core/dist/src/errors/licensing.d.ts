export const type: "license_error";
export namespace codes {
    const USAGE_LIMIT_EXCEEDED: string;
    const FEATURE_DISABLED: string;
}
export const context: {
    [x: string]: ((err: any) => {
        limitName: any;
    }) | ((err: any) => {
        featureName: any;
    });
};
export class UsageLimitError extends HTTPError {
    constructor(message: any, limitName: any);
    limitName: any;
}
export class FeatureDisabledError extends HTTPError {
    constructor(message: any, featureName: any);
    featureName: any;
}
import { HTTPError } from "./http";
