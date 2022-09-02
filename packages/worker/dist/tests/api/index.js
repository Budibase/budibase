"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accounts_1 = require("./accounts");
const auth_1 = require("./auth");
const configs_1 = require("./configs");
const email_1 = require("./email");
const self_1 = require("./self");
const users_1 = require("./users");
class API {
    constructor(config) {
        this.accounts = new accounts_1.AccountAPI(config);
        this.auth = new auth_1.AuthAPI(config);
        this.configs = new configs_1.ConfigAPI(config);
        this.emails = new email_1.EmailAPI(config);
        this.self = new self_1.SelfAPI(config);
        this.users = new users_1.UserAPI(config);
    }
}
exports.default = API;
