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
const context_1 = require("../../context");
const init_1 = __importDefault(require("../../redis/init"));
function generateTenantKey(key) {
    const tenantId = (0, context_1.getTenantId)();
    return `${key}:${tenantId}`;
}
module.exports = class BaseCache {
    constructor(client = undefined) {
        this.client = client;
    }
    getClient() {
        return __awaiter(this, void 0, void 0, function* () {
            return !this.client ? yield init_1.default.getCacheClient() : this.client;
        });
    }
    keys(pattern) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.getClient();
            return client.keys(pattern);
        });
    }
    /**
     * Read only from the cache.
     */
    get(key, opts = { useTenancy: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            key = opts.useTenancy ? generateTenantKey(key) : key;
            const client = yield this.getClient();
            return client.get(key);
        });
    }
    /**
     * Write to the cache.
     */
    store(key, value, ttl = null, opts = { useTenancy: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            key = opts.useTenancy ? generateTenantKey(key) : key;
            const client = yield this.getClient();
            yield client.store(key, value, ttl);
        });
    }
    /**
     * Remove from cache.
     */
    delete(key, opts = { useTenancy: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            key = opts.useTenancy ? generateTenantKey(key) : key;
            const client = yield this.getClient();
            return client.delete(key);
        });
    }
    /**
     * Read from the cache. Write to the cache if not exists.
     */
    withCache(key, ttl, fetchFn, opts = { useTenancy: true }) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedValue = yield this.get(key, opts);
            if (cachedValue) {
                return cachedValue;
            }
            try {
                const fetchedValue = yield fetchFn();
                yield this.store(key, fetchedValue, ttl, opts);
                return fetchedValue;
            }
            catch (err) {
                console.error("Error fetching before cache - ", err);
                throw err;
            }
        });
    }
    bustCache(key, opts = { client: null }) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield this.getClient();
            try {
                yield client.delete(generateTenantKey(key));
            }
            catch (err) {
                console.error("Error busting cache - ", err);
                throw err;
            }
        });
    }
};
//# sourceMappingURL=index.js.map