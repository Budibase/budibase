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
const env = require("../../../environment");
exports.fetch = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.body = {
        multiTenancy: !!env.MULTI_TENANCY,
        cloud: !env.SELF_HOSTED,
        accountPortalUrl: env.ACCOUNT_PORTAL_URL,
        disableAccountPortal: env.DISABLE_ACCOUNT_PORTAL,
        // in test need to pretend its in production for the UI (Cypress)
        isDev: env.isDev() && !env.isTest(),
    };
});
