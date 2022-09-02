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
exports.AuthAPI = void 0;
class AuthAPI {
    constructor(config) {
        this.updatePassword = (code) => {
            return this.request
                .post(`/api/global/auth/${this.config.getTenantId()}/reset/update`)
                .send({
                password: "newpassword",
                resetCode: code,
            })
                .expect("Content-Type", /json/)
                .expect(200);
        };
        this.logout = () => {
            return this.request
                .post("/api/global/auth/logout")
                .set(this.config.defaultHeaders())
                .expect(200);
        };
        this.requestPasswordReset = (sendMailMock) => __awaiter(this, void 0, void 0, function* () {
            yield this.config.saveSmtpConfig();
            yield this.config.saveSettingsConfig();
            yield this.config.createUser();
            const res = yield this.request
                .post(`/api/global/auth/${this.config.getTenantId()}/reset`)
                .send({
                email: "test@test.com",
            })
                .expect("Content-Type", /json/)
                .expect(200);
            const emailCall = sendMailMock.mock.calls[0][0];
            const parts = emailCall.html.split(`http://localhost:10000/builder/auth/reset?code=`);
            const code = parts[1].split('"')[0].split("&")[0];
            return { code, res };
        });
        this.config = config;
        this.request = config.request;
    }
}
exports.AuthAPI = AuthAPI;
