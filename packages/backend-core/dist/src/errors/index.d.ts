export const codes: {
    USAGE_LIMIT_EXCEEDED: string;
    FEATURE_DISABLED: string;
};
export const types: string[];
import licensing = require("./licensing");
import http = require("./http");
export function getPublicError(err: any): {
    code: any;
    type: any;
} | {
    limitName: any;
    code: any;
    type: any;
} | {
    featureName: any;
    code: any;
    type: any;
} | undefined;
export declare namespace errors {
    const UsageLimitError: typeof licensing.UsageLimitError;
    const FeatureDisabledError: typeof licensing.FeatureDisabledError;
    const HTTPError: typeof http.HTTPError;
}
