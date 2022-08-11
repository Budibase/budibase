"use strict";
const http = require("./http");
const licensing = require("./licensing");
const codes = Object.assign({}, licensing.codes);
const types = [licensing.type];
const context = Object.assign({}, licensing.context);
const getPublicError = err => {
    let error;
    if (err.code || err.type) {
        // add generic error information
        error = {
            code: err.code,
            type: err.type,
        };
        if (err.code && context[err.code]) {
            error = Object.assign(Object.assign({}, error), context[err.code](err));
        }
    }
    return error;
};
module.exports = {
    codes,
    types,
    errors: {
        UsageLimitError: licensing.UsageLimitError,
        FeatureDisabledError: licensing.FeatureDisabledError,
        HTTPError: http.HTTPError,
    },
    getPublicError,
};
//# sourceMappingURL=index.js.map