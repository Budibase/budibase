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
require("./mocks");
require("../db").init();
const env = require("../environment");
const controllers = require("./controllers");
const supertest = require("supertest");
const { jwt } = require("@budibase/backend-core/auth");
const { Cookies, Headers } = require("@budibase/backend-core/constants");
const { Configs } = require("../constants");
const { users } = require("@budibase/backend-core");
const { createASession } = require("@budibase/backend-core/sessions");
const { TENANT_ID, CSRF_TOKEN } = require("./structures");
const structures = require("./structures");
const { doInTenant } = require("@budibase/backend-core/tenancy");
const { groups } = require("@budibase/pro");
class TestConfiguration {
    constructor(openServer = true) {
        if (openServer) {
            env.PORT = "0"; // random port
            this.server = require("../index");
            // we need the request for logging in, involves cookies, hard to fake
            this.request = supertest(this.server);
        }
    }
    getRequest() {
        return this.request;
    }
    // UTILS
    _req(config, params, controlFunc) {
        return __awaiter(this, void 0, void 0, function* () {
            const request = {};
            // fake cookies, we don't need them
            request.cookies = { set: () => { }, get: () => { } };
            request.config = { jwtSecret: env.JWT_SECRET };
            request.appId = this.appId;
            request.user = { appId: this.appId, tenantId: TENANT_ID };
            request.query = {};
            request.request = {
                body: config,
            };
            request.throw = (status, err) => {
                throw { status, message: err };
            };
            if (params) {
                request.params = params;
            }
            yield doInTenant(TENANT_ID, () => {
                return controlFunc(request);
            });
            return request.body;
        });
    }
    // SETUP / TEARDOWN
    beforeAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.login();
        });
    }
    afterAll() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.server) {
                yield this.server.close();
            }
        });
    }
    // USER / AUTH
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            // create a test user
            yield this._req({
                email: "test@test.com",
                password: "test",
                _id: "us_uuid1",
                builder: {
                    global: true,
                },
                admin: {
                    global: true,
                },
            }, null, controllers.users.save);
            yield createASession("us_uuid1", {
                sessionId: "sessionid",
                tenantId: TENANT_ID,
                csrfToken: CSRF_TOKEN,
            });
        });
    }
    cookieHeader(cookies) {
        return {
            Cookie: [cookies],
        };
    }
    defaultHeaders() {
        const user = {
            _id: "us_uuid1",
            userId: "us_uuid1",
            sessionId: "sessionid",
            tenantId: TENANT_ID,
        };
        const authToken = jwt.sign(user, env.JWT_SECRET);
        return Object.assign(Object.assign({ Accept: "application/json" }, this.cookieHeader([`${Cookies.Auth}=${authToken}`])), { [Headers.CSRF_TOKEN]: CSRF_TOKEN });
    }
    getUser(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return doInTenant(TENANT_ID, () => {
                return users.getGlobalUserByEmail(email);
            });
        });
    }
    getGroup(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return doInTenant(TENANT_ID, () => {
                return groups.get(id);
            });
        });
    }
    saveGroup(group) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.getRequest()
                .post(`/api/global/groups`)
                .send(group)
                .set(this.defaultHeaders())
                .expect("Content-Type", /json/)
                .expect(200);
            return res.body;
        });
    }
    createUser(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUser(structures.users.email);
            if (user) {
                return user;
            }
            yield this._req(structures.users.user({ email, password }), null, controllers.users.save);
        });
    }
    saveAdminUser() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._req(structures.users.user({ tenantId: TENANT_ID }), null, controllers.users.adminUser);
        });
    }
    // CONFIGS
    deleteConfig(type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cfg = yield this._req(null, {
                    type,
                }, controllers.config.find);
                if (cfg) {
                    yield this._req(null, {
                        id: cfg._id,
                        rev: cfg._rev,
                    }, controllers.config.destroy);
                }
            }
            catch (err) {
                // don't need to handle error
            }
        });
    }
    // CONFIGS - SETTINGS
    saveSettingsConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.deleteConfig(Configs.SETTINGS);
            yield this._req(structures.configs.settings(), null, controllers.config.save);
        });
    }
    // CONFIGS - GOOGLE
    saveGoogleConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.deleteConfig(Configs.GOOGLE);
            yield this._req(structures.configs.google(), null, controllers.config.save);
        });
    }
    // CONFIGS - OIDC
    getOIDConfigCookie(configId) {
        const token = jwt.sign(configId, env.JWT_SECRET);
        return this.cookieHeader([[`${Cookies.OIDC_CONFIG}=${token}`]]);
    }
    saveOIDCConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.deleteConfig(Configs.OIDC);
            const config = structures.configs.oidc();
            yield this._req(config, null, controllers.config.save);
            return config;
        });
    }
    // CONFIGS - SMTP
    saveSmtpConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.deleteConfig(Configs.SMTP);
            yield this._req(structures.configs.smtp(), null, controllers.config.save);
        });
    }
    saveEtherealSmtpConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.deleteConfig(Configs.SMTP);
            yield this._req(structures.configs.smtpEthereal(), null, controllers.config.save);
        });
    }
}
module.exports = TestConfiguration;
