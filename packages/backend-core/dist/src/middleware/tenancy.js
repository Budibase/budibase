"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { doInTenant, isMultiTenant, DEFAULT_TENANT_ID } = require("../tenancy");
const { buildMatcherRegex, matches } = require("./matchers");
const { Headers } = require("../constants");
const getTenantID = (ctx, opts = { allowQs: false, allowNoTenant: false }) => {
    // exit early if not multi-tenant
    if (!isMultiTenant()) {
        return DEFAULT_TENANT_ID;
    }
    let tenantId;
    const allowQs = opts && opts.allowQs;
    const allowNoTenant = opts && opts.allowNoTenant;
    const header = ctx.request.headers[Headers.TENANT_ID];
    const user = ctx.user || {};
    if (allowQs) {
        const query = ctx.request.query || {};
        tenantId = query.tenantId;
    }
    // override query string (if allowed) by user, or header
    // URL params cannot be used in a middleware, as they are
    // processed later in the chain
    tenantId = user.tenantId || header || tenantId;
    // Set the tenantId from the subdomain
    if (!tenantId) {
        tenantId = ctx.subdomains && ctx.subdomains[0];
    }
    if (!tenantId && !allowNoTenant) {
        ctx.throw(403, "Tenant id not set");
    }
    return tenantId;
};
module.exports = (allowQueryStringPatterns, noTenancyPatterns, opts = { noTenancyRequired: false }) => {
    const allowQsOptions = buildMatcherRegex(allowQueryStringPatterns);
    const noTenancyOptions = buildMatcherRegex(noTenancyPatterns);
    return function (ctx, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const allowNoTenant = opts.noTenancyRequired || !!matches(ctx, noTenancyOptions);
            const allowQs = !!matches(ctx, allowQsOptions);
            const tenantId = getTenantID(ctx, { allowQs, allowNoTenant });
            return doInTenant(tenantId, next);
        });
    };
};
//# sourceMappingURL=tenancy.js.map