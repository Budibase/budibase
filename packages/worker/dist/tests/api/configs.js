"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigAPI = void 0;
class ConfigAPI {
    constructor(config) {
        this.getConfigChecklist = () => {
            return this.request
                .get(`/api/global/configs/checklist`)
                .set(this.config.defaultHeaders())
                .expect("Content-Type", /json/)
                .expect(200);
        };
        this.saveConfig = (data) => {
            return this.request
                .post(`/api/global/configs`)
                .send(data)
                .set(this.config.defaultHeaders())
                .expect("Content-Type", /json/)
                .expect(200);
        };
        this.OIDCCallback = (configId) => {
            return this.request
                .get(`/api/global/auth/${this.config.getTenantId()}/oidc/callback`)
                .set(this.config.getOIDConfigCookie(configId));
        };
        this.getOIDCConfig = (configId) => {
            return this.request.get(`/api/global/auth/${this.config.getTenantId()}/oidc/configs/${configId}`);
        };
        this.config = config;
        this.request = config.request;
    }
}
exports.ConfigAPI = ConfigAPI;
