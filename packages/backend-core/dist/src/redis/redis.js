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
const environment_1 = __importDefault(require("../environment"));
// ioredis mock is all in memory
const Redis = environment_1.default.isTest() ? require("ioredis-mock") : require("ioredis");
const utils_1 = require("./utils");
const RETRY_PERIOD_MS = 2000;
const STARTUP_TIMEOUT_MS = 5000;
const CLUSTERED = false;
const DEFAULT_SELECT_DB = utils_1.SelectableDatabase.DEFAULT;
// for testing just generate the client once
let CLOSED = false;
let CLIENTS = {};
// if in test always connected
let CONNECTED = environment_1.default.isTest();
function pickClient(selectDb) {
    return CLIENTS[selectDb];
}
function connectionError(selectDb, timeout, err) {
    // manually shut down, ignore errors
    if (CLOSED) {
        return;
    }
    pickClient(selectDb).disconnect();
    CLOSED = true;
    // always clear this on error
    clearTimeout(timeout);
    CONNECTED = false;
    console.error("Redis connection failed - " + err);
    setTimeout(() => {
        init();
    }, RETRY_PERIOD_MS);
}
/**
 * Inits the system, will error if unable to connect to redis cluster (may take up to 10 seconds) otherwise
 * will return the ioredis client which will be ready to use.
 */
function init(selectDb = DEFAULT_SELECT_DB) {
    let timeout;
    CLOSED = false;
    let client = pickClient(selectDb);
    // already connected, ignore
    if (client && CONNECTED) {
        return;
    }
    // testing uses a single in memory client
    if (environment_1.default.isTest()) {
        CLIENTS[selectDb] = new Redis((0, utils_1.getRedisOptions)());
    }
    // start the timer - only allowed 5 seconds to connect
    timeout = setTimeout(() => {
        if (!CONNECTED) {
            connectionError(selectDb, timeout, "Did not successfully connect in timeout");
        }
    }, STARTUP_TIMEOUT_MS);
    // disconnect any lingering client
    if (client) {
        client.disconnect();
    }
    const { redisProtocolUrl, opts, host, port } = (0, utils_1.getRedisOptions)(CLUSTERED);
    if (CLUSTERED) {
        client = new Redis.Cluster([{ host, port }], opts);
    }
    else if (redisProtocolUrl) {
        client = new Redis(redisProtocolUrl);
    }
    else {
        client = new Redis(opts);
    }
    // attach handlers
    client.on("end", (err) => {
        connectionError(selectDb, timeout, err);
    });
    client.on("error", (err) => {
        connectionError(selectDb, timeout, err);
    });
    client.on("connect", () => {
        clearTimeout(timeout);
        CONNECTED = true;
    });
    CLIENTS[selectDb] = client;
}
function waitForConnection(selectDb = DEFAULT_SELECT_DB) {
    return new Promise(resolve => {
        if (pickClient(selectDb) == null) {
            init();
        }
        else if (CONNECTED) {
            resolve("");
            return;
        }
        // check if the connection is ready
        const interval = setInterval(() => {
            if (CONNECTED) {
                clearInterval(interval);
                resolve("");
            }
        }, 500);
    });
}
/**
 * Utility function, takes a redis stream and converts it to a promisified response -
 * this can only be done with redis streams because they will have an end.
 * @param stream A redis stream, specifically as this type of stream will have an end.
 * @param client The client to use for further lookups.
 * @return {Promise<object>} The final output of the stream
 */
function promisifyStream(stream, client) {
    return new Promise((resolve, reject) => {
        const outputKeys = new Set();
        stream.on("data", (keys) => {
            keys.forEach(key => {
                outputKeys.add(key);
            });
        });
        stream.on("error", (err) => {
            reject(err);
        });
        stream.on("end", () => __awaiter(this, void 0, void 0, function* () {
            const keysArray = Array.from(outputKeys);
            try {
                let getPromises = [];
                for (let key of keysArray) {
                    getPromises.push(client.get(key));
                }
                const jsonArray = yield Promise.all(getPromises);
                resolve(keysArray.map(key => ({
                    key: (0, utils_1.removeDbPrefix)(key),
                    value: JSON.parse(jsonArray.shift()),
                })));
            }
            catch (err) {
                reject(err);
            }
        }));
    });
}
class RedisWrapper {
    constructor(db, selectDb = null) {
        this._db = db;
        this._select = selectDb || DEFAULT_SELECT_DB;
    }
    getClient() {
        return pickClient(this._select);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            CLOSED = false;
            init(this._select);
            yield waitForConnection(this._select);
            return this;
        });
    }
    finish() {
        return __awaiter(this, void 0, void 0, function* () {
            CLOSED = true;
            this.getClient().disconnect();
        });
    }
    scan(key = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this._db;
            key = `${db}${utils_1.SEPARATOR}${key}`;
            let stream;
            if (CLUSTERED) {
                let node = this.getClient().nodes("master");
                stream = node[0].scanStream({ match: key + "*", count: 100 });
            }
            else {
                stream = this.getClient().scanStream({ match: key + "*", count: 100 });
            }
            return promisifyStream(stream, this.getClient());
        });
    }
    keys(pattern) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this._db;
            return this.getClient().keys((0, utils_1.addDbPrefix)(db, pattern));
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this._db;
            let response = yield this.getClient().get((0, utils_1.addDbPrefix)(db, key));
            // overwrite the prefixed key
            if (response != null && response.key) {
                response.key = key;
            }
            // if its not an object just return the response
            try {
                return JSON.parse(response);
            }
            catch (err) {
                return response;
            }
        });
    }
    bulkGet(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this._db;
            if (keys.length === 0) {
                return {};
            }
            const prefixedKeys = keys.map(key => (0, utils_1.addDbPrefix)(db, key));
            let response = yield this.getClient().mget(prefixedKeys);
            if (Array.isArray(response)) {
                let final = {};
                let count = 0;
                for (let result of response) {
                    if (result) {
                        let parsed;
                        try {
                            parsed = JSON.parse(result);
                        }
                        catch (err) {
                            parsed = result;
                        }
                        final[keys[count]] = parsed;
                    }
                    count++;
                }
                return final;
            }
            else {
                throw new Error(`Invalid response: ${response}`);
            }
        });
    }
    store(key, value, expirySeconds = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this._db;
            if (typeof value === "object") {
                value = JSON.stringify(value);
            }
            const prefixedKey = (0, utils_1.addDbPrefix)(db, key);
            yield this.getClient().set(prefixedKey, value);
            if (expirySeconds) {
                yield this.getClient().expire(prefixedKey, expirySeconds);
            }
        });
    }
    getTTL(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this._db;
            const prefixedKey = (0, utils_1.addDbPrefix)(db, key);
            return this.getClient().ttl(prefixedKey);
        });
    }
    setExpiry(key, expirySeconds) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this._db;
            const prefixedKey = (0, utils_1.addDbPrefix)(db, key);
            yield this.getClient().expire(prefixedKey, expirySeconds);
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = this._db;
            yield this.getClient().del((0, utils_1.addDbPrefix)(db, key));
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            let items = yield this.scan();
            yield Promise.all(items.map((obj) => this.delete(obj.key)));
        });
    }
}
module.exports = RedisWrapper;
//# sourceMappingURL=redis.js.map