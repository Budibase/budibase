"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailAPI = void 0;
class EmailAPI {
    constructor(config) {
        this.sendEmail = (purpose) => {
            return this.request
                .post(`/api/global/email/send`)
                .send({
                email: "test@test.com",
                purpose,
                tenantId: this.config.getTenantId(),
            })
                .set(this.config.defaultHeaders())
                .expect("Content-Type", /json/)
                .expect(200);
        };
        this.config = config;
        this.request = config.request;
    }
}
exports.EmailAPI = EmailAPI;
