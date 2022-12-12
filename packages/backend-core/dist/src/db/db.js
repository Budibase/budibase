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
exports.directCouchFind = exports.directCouchAllDbs = exports.allDbs = exports.doWithDB = exports.getDB = void 0;
const environment_1 = __importDefault(require("../environment"));
const couch_1 = require("./couch");
const db_1 = require("../db");
const dbList = new Set();
function getDB(dbName, opts) {
    // TODO: once using the test image, need to remove this
    if (environment_1.default.isTest()) {
        dbList.add(dbName);
        // @ts-ignore
        return (0, couch_1.getPouchDB)(dbName, opts);
    }
    return new db_1.DatabaseImpl(dbName, opts);
}
exports.getDB = getDB;
// we have to use a callback for this so that we can close
// the DB when we're done, without this manual requests would
// need to close the database when done with it to avoid memory leaks
function doWithDB(dbName, cb, opts = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const db = getDB(dbName, opts);
        // need this to be async so that we can correctly close DB after all
        // async operations have been completed
        return yield cb(db);
    });
}
exports.doWithDB = doWithDB;
function allDbs() {
    if (!environment_1.default.isTest()) {
        throw new Error("Cannot be used outside test environment.");
    }
    return [...dbList];
}
exports.allDbs = allDbs;
function directCouchAllDbs(queryString) {
    return __awaiter(this, void 0, void 0, function* () {
        let couchPath = "/_all_dbs";
        if (queryString) {
            couchPath += `?${queryString}`;
        }
        return yield (0, couch_1.directCouchQuery)(couchPath);
    });
}
exports.directCouchAllDbs = directCouchAllDbs;
function directCouchFind(dbName, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const json = yield (0, couch_1.directCouchQuery)(`${dbName}/_find`, "POST", opts);
        return { rows: json.docs, bookmark: json.bookmark };
    });
}
exports.directCouchFind = directCouchFind;
//# sourceMappingURL=db.js.map