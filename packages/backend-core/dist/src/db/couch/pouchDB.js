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
exports.closePouchDB = exports.getPouchDB = exports.init = exports.getPouch = void 0;
const pouchdb_1 = __importDefault(require("pouchdb"));
const environment_1 = __importDefault(require("../../environment"));
const connections_1 = require("./connections");
let Pouch;
let initialised = false;
/**
 * Return a constructor for PouchDB.
 * This should be rarely used outside of the main application config.
 * Exposed for exceptional cases such as in-memory views.
 */
const getPouch = (opts = {}) => {
    let { url, cookie } = (0, connections_1.getCouchInfo)();
    let POUCH_DB_DEFAULTS = {
        prefix: url,
        fetch: (url, opts) => {
            // use a specific authorization cookie - be very explicit about how we authenticate
            opts.headers.set("Authorization", cookie);
            return pouchdb_1.default.fetch(url, opts);
        },
    };
    if (opts.inMemory) {
        const inMemory = require("pouchdb-adapter-memory");
        pouchdb_1.default.plugin(inMemory);
        POUCH_DB_DEFAULTS = {
            // @ts-ignore
            adapter: "memory",
        };
    }
    if (opts.onDisk) {
        POUCH_DB_DEFAULTS = {
            // @ts-ignore
            adapter: "leveldb",
        };
    }
    if (opts.replication) {
        const replicationStream = require("pouchdb-replication-stream");
        pouchdb_1.default.plugin(replicationStream.plugin);
        // @ts-ignore
        pouchdb_1.default.adapter("writableStream", replicationStream.adapters.writableStream);
    }
    if (opts.find) {
        const find = require("pouchdb-find");
        pouchdb_1.default.plugin(find);
    }
    return pouchdb_1.default.defaults(POUCH_DB_DEFAULTS);
};
exports.getPouch = getPouch;
function init(opts) {
    Pouch = (0, exports.getPouch)(opts);
    initialised = true;
}
exports.init = init;
const checkInitialised = () => {
    if (!initialised) {
        throw new Error("init has not been called");
    }
};
function getPouchDB(dbName, opts) {
    checkInitialised();
    const db = new Pouch(dbName, opts);
    const dbPut = db.put;
    db.put = (doc, options = {}) => __awaiter(this, void 0, void 0, function* () {
        if (!doc.createdAt) {
            doc.createdAt = new Date().toISOString();
        }
        doc.updatedAt = new Date().toISOString();
        return dbPut(doc, options);
    });
    db.exists = () => __awaiter(this, void 0, void 0, function* () {
        const info = yield db.info();
        return !info.error;
    });
    return db;
}
exports.getPouchDB = getPouchDB;
// use this function if you have called getPouchDB - close
// the databases you've opened once finished
function closePouchDB(db) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!db || environment_1.default.isTest()) {
            return;
        }
        try {
            // specifically await so that if there is an error, it can be ignored
            return yield db.close();
        }
        catch (err) {
            // ignore error, already closed
        }
    });
}
exports.closePouchDB = closePouchDB;
//# sourceMappingURL=pouchDB.js.map