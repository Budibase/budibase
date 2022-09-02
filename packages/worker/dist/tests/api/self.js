"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfAPI = void 0;
class SelfAPI {
    constructor(config) {
        this.updateSelf = (user) => {
            return this.request
                .post(`/api/global/self`)
                .send(user)
                .set(this.config.authHeaders(user))
                .expect("Content-Type", /json/)
                .expect(200);
        };
        this.config = config;
        this.request = config.request;
    }
}
exports.SelfAPI = SelfAPI;
