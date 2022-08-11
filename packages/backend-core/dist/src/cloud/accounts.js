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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatus = exports.getAccountByTenantId = exports.getAccount = void 0;
const api_1 = __importDefault(require("./api"));
const environment_1 = __importDefault(require("../environment"));
const constants_1 = require("../constants");
const api = new api_1.default(environment_1.default.ACCOUNT_PORTAL_URL);
const getAccount = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        email,
    };
    const response = yield api.post(`/api/accounts/search`, {
        body: payload,
        headers: {
            [constants_1.Headers.API_KEY]: environment_1.default.ACCOUNT_PORTAL_API_KEY,
        },
    });
    if (response.status !== 200) {
        throw new Error(`Error getting account by email ${email}`);
    }
    const json = yield response.json();
    return json[0];
});
exports.getAccount = getAccount;
const getAccountByTenantId = (tenantId) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = {
        tenantId,
    };
    const response = yield api.post(`/api/accounts/search`, {
        body: payload,
        headers: {
            [constants_1.Headers.API_KEY]: environment_1.default.ACCOUNT_PORTAL_API_KEY,
        },
    });
    if (response.status !== 200) {
        throw new Error(`Error getting account by tenantId ${tenantId}`);
    }
    const json = yield response.json();
    return json[0];
});
exports.getAccountByTenantId = getAccountByTenantId;
const getStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield api.get(`/api/status`, {
        headers: {
            [constants_1.Headers.API_KEY]: environment_1.default.ACCOUNT_PORTAL_API_KEY,
        },
    });
    const json = yield response.json();
    if (response.status !== 200) {
        throw new Error(`Error getting status`);
    }
    return json;
});
exports.getStatus = getStatus;
//# sourceMappingURL=accounts.js.map