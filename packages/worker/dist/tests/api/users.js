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
exports.UserAPI = void 0;
class UserAPI {
    constructor(config) {
        // INVITE
        this.sendUserInvite = (sendMailMock, email, status = 200) => __awaiter(this, void 0, void 0, function* () {
            yield this.config.saveSmtpConfig();
            yield this.config.saveSettingsConfig();
            const res = yield this.request
                .post(`/api/global/users/invite`)
                .send({
                email,
            })
                .set(this.config.defaultHeaders())
                .expect("Content-Type", /json/)
                .expect(status);
            if (status !== 200) {
                return { code: undefined, res };
            }
            const emailCall = sendMailMock.mock.calls[0][0];
            // after this URL there should be a code
            const parts = emailCall.html.split("http://localhost:10000/builder/invite?code=");
            const code = parts[1].split('"')[0].split("&")[0];
            return { code, res };
        });
        this.acceptInvite = (code) => {
            return this.request
                .post(`/api/global/users/invite/accept`)
                .send({
                password: "newpassword",
                inviteCode: code,
            })
                .expect("Content-Type", /json/)
                .expect(200);
        };
        this.sendMultiUserInvite = (request, status = 200) => __awaiter(this, void 0, void 0, function* () {
            yield this.config.saveSmtpConfig();
            yield this.config.saveSettingsConfig();
            return this.request
                .post(`/api/global/users/multi/invite`)
                .send(request)
                .set(this.config.defaultHeaders())
                .expect("Content-Type", /json/)
                .expect(status);
        });
        // BULK
        this.bulkCreateUsers = (users, groups = []) => __awaiter(this, void 0, void 0, function* () {
            const body = { users, groups };
            const res = yield this.request
                .post(`/api/global/users/bulkCreate`)
                .send(body)
                .set(this.config.defaultHeaders())
                .expect("Content-Type", /json/)
                .expect(200);
            return res.body;
        });
        this.bulkDeleteUsers = (body, status) => {
            return this.request
                .post(`/api/global/users/bulkDelete`)
                .send(body)
                .set(this.config.defaultHeaders())
                .expect("Content-Type", /json/)
                .expect(status ? status : 200);
        };
        // USER
        this.saveUser = (user, status) => {
            return this.request
                .post(`/api/global/users`)
                .send(user)
                .set(this.config.defaultHeaders())
                .expect("Content-Type", /json/)
                .expect(status ? status : 200);
        };
        this.deleteUser = (userId, status) => {
            return this.request
                .delete(`/api/global/users/${userId}`)
                .set(this.config.defaultHeaders())
                .expect("Content-Type", /json/)
                .expect(status ? status : 200);
        };
        this.config = config;
        this.request = config.request;
    }
}
exports.UserAPI = UserAPI;
