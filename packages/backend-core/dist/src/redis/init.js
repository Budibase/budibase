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
const Client = require("./index");
const utils = require("./utils");
const { getRedlock } = require("./redlock");
let userClient, sessionClient, appClient, cacheClient, writethroughClient;
let migrationsRedlock;
// turn retry off so that only one instance can ever hold the lock
const migrationsRedlockConfig = { retryCount: 0 };
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        userClient = yield new Client(utils.Databases.USER_CACHE).init();
        sessionClient = yield new Client(utils.Databases.SESSIONS).init();
        appClient = yield new Client(utils.Databases.APP_METADATA).init();
        cacheClient = yield new Client(utils.Databases.GENERIC_CACHE).init();
        writethroughClient = yield new Client(utils.Databases.WRITE_THROUGH, utils.SelectableDatabases.WRITE_THROUGH).init();
        // pass the underlying ioredis client to redlock
        migrationsRedlock = getRedlock(cacheClient.getClient(), migrationsRedlockConfig);
    });
}
process.on("exit", () => __awaiter(void 0, void 0, void 0, function* () {
    if (userClient)
        yield userClient.finish();
    if (sessionClient)
        yield sessionClient.finish();
    if (appClient)
        yield appClient.finish();
    if (cacheClient)
        yield cacheClient.finish();
    if (writethroughClient)
        yield writethroughClient.finish();
}));
module.exports = {
    getUserClient: () => __awaiter(void 0, void 0, void 0, function* () {
        if (!userClient) {
            yield init();
        }
        return userClient;
    }),
    getSessionClient: () => __awaiter(void 0, void 0, void 0, function* () {
        if (!sessionClient) {
            yield init();
        }
        return sessionClient;
    }),
    getAppClient: () => __awaiter(void 0, void 0, void 0, function* () {
        if (!appClient) {
            yield init();
        }
        return appClient;
    }),
    getCacheClient: () => __awaiter(void 0, void 0, void 0, function* () {
        if (!cacheClient) {
            yield init();
        }
        return cacheClient;
    }),
    getWritethroughClient: () => __awaiter(void 0, void 0, void 0, function* () {
        if (!writethroughClient) {
            yield init();
        }
        return writethroughClient;
    }),
    getMigrationsRedlock: () => __awaiter(void 0, void 0, void 0, function* () {
        if (!migrationsRedlock) {
            yield init();
        }
        return migrationsRedlock;
    }),
};
//# sourceMappingURL=init.js.map