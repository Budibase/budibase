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
const accounts = require("@budibase/backend-core/accounts");
const env = require("../../../environment");
exports.fetch = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (!env.SELF_HOSTED && !env.DISABLE_ACCOUNT_PORTAL) {
        const status = yield accounts.getStatus();
        ctx.body = status;
    }
    else {
        ctx.body = {
            health: {
                passing: true,
            },
        };
    }
});
