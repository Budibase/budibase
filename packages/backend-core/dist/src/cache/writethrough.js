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
exports.Writethrough = exports.remove = exports.get = exports.put = void 0;
const base_1 = __importDefault(require("./base"));
const init_1 = require("../redis/init");
const logging_1 = require("../logging");
const DEFAULT_WRITE_RATE_MS = 10000;
let CACHE = null;
function getCache() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!CACHE) {
            const client = yield (0, init_1.getWritethroughClient)();
            CACHE = new base_1.default(client);
        }
        return CACHE;
    });
}
function makeCacheKey(db, key) {
    return db.name + key;
}
function makeCacheItem(doc, lastWrite = null) {
    return { doc, lastWrite: lastWrite || Date.now() };
}
function put(db, doc, writeRateMs = DEFAULT_WRITE_RATE_MS) {
    return __awaiter(this, void 0, void 0, function* () {
        const cache = yield getCache();
        const key = doc._id;
        let cacheItem = yield cache.get(makeCacheKey(db, key));
        const updateDb = !cacheItem || cacheItem.lastWrite < Date.now() - writeRateMs;
        let output = doc;
        if (updateDb) {
            const writeDb = (toWrite) => __awaiter(this, void 0, void 0, function* () {
                // doc should contain the _id and _rev
                const response = yield db.put(toWrite);
                output = Object.assign(Object.assign({}, doc), { _id: response.id, _rev: response.rev });
            });
            try {
                yield writeDb(doc);
            }
            catch (err) {
                if (err.status !== 409) {
                    throw err;
                }
                else {
                    // Swallow 409s but log them
                    (0, logging_1.logWarn)(`Ignoring conflict in write-through cache`);
                }
            }
        }
        // if we are updating the DB then need to set the lastWrite to now
        cacheItem = makeCacheItem(output, updateDb ? null : cacheItem === null || cacheItem === void 0 ? void 0 : cacheItem.lastWrite);
        yield cache.store(makeCacheKey(db, key), cacheItem);
        return { ok: true, id: output._id, rev: output._rev };
    });
}
exports.put = put;
function get(db, id) {
    return __awaiter(this, void 0, void 0, function* () {
        const cache = yield getCache();
        const cacheKey = makeCacheKey(db, id);
        let cacheItem = yield cache.get(cacheKey);
        if (!cacheItem) {
            const doc = yield db.get(id);
            cacheItem = makeCacheItem(doc);
            yield cache.store(cacheKey, cacheItem);
        }
        return cacheItem.doc;
    });
}
exports.get = get;
function remove(db, docOrId, rev) {
    return __awaiter(this, void 0, void 0, function* () {
        const cache = yield getCache();
        if (!docOrId) {
            throw new Error("No ID/Rev provided.");
        }
        const id = typeof docOrId === "string" ? docOrId : docOrId._id;
        rev = typeof docOrId === "string" ? rev : docOrId._rev;
        try {
            yield cache.delete(makeCacheKey(db, id));
        }
        finally {
            yield db.remove(id, rev);
        }
    });
}
exports.remove = remove;
class Writethrough {
    constructor(db, writeRateMs = DEFAULT_WRITE_RATE_MS) {
        this.db = db;
        this.writeRateMs = writeRateMs;
    }
    put(doc) {
        return __awaiter(this, void 0, void 0, function* () {
            return put(this.db, doc, this.writeRateMs);
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return get(this.db, id);
        });
    }
    remove(docOrId, rev) {
        return __awaiter(this, void 0, void 0, function* () {
            return remove(this.db, docOrId, rev);
        });
    }
}
exports.Writethrough = Writethrough;
//# sourceMappingURL=writethrough.js.map