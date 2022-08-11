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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuotaUsage = exports.getInfo = exports.refresh = exports.activate = void 0;
const pro_1 = require("@budibase/pro");
const activate = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { licenseKey } = ctx.request.body;
    if (!licenseKey) {
        ctx.throw(400, "licenseKey is required");
    }
    yield pro_1.licensing.activateLicenseKey(licenseKey);
    ctx.status = 200;
});
exports.activate = activate;
const refresh = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    yield pro_1.licensing.cache.refresh();
    ctx.status = 200;
});
exports.refresh = refresh;
const getInfo = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const licenseInfo = yield pro_1.licensing.getLicenseInfo();
    if (licenseInfo) {
        licenseInfo.licenseKey = "*";
        ctx.body = licenseInfo;
    }
    ctx.status = 200;
});
exports.getInfo = getInfo;
const getQuotaUsage = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = yield pro_1.quotas.getQuotaUsage();
});
exports.getQuotaUsage = getQuotaUsage;
