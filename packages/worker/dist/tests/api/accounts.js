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
exports.AccountAPI = void 0;
class AccountAPI {
    constructor(config) {
        this.saveMetadata = (account) => __awaiter(this, void 0, void 0, function* () {
            const res = yield this.request
                .put(`/api/system/accounts/${account.accountId}/metadata`)
                .send(account)
                .set(this.config.defaultHeaders())
                .expect("Content-Type", /json/)
                .expect(200);
            return res.body;
        });
        this.destroyMetadata = (accountId) => {
            return this.request
                .del(`/api/system/accounts/${accountId}/metadata`)
                .set(this.config.defaultHeaders());
        };
        this.config = config;
        this.request = config.request;
    }
}
exports.AccountAPI = AccountAPI;
