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
exports.getAllDbs = exports.getPouch = void 0;
const pouchdb_1 = __importDefault(require("pouchdb"));
const utils_1 = require("../utils");
const node_fetch_1 = __importDefault(require("node-fetch"));
/**
 * Fully qualified URL including username and password, or nothing for local
 */
function getPouch(url) {
    let POUCH_DB_DEFAULTS;
    if (!url) {
        POUCH_DB_DEFAULTS = {
            prefix: undefined,
            adapter: "leveldb",
        };
    }
    else {
        POUCH_DB_DEFAULTS = {
            prefix: url,
        };
    }
    const replicationStream = require("pouchdb-replication-stream");
    pouchdb_1.default.plugin(replicationStream.plugin);
    // @ts-ignore
    pouchdb_1.default.adapter("writableStream", replicationStream.adapters.writableStream);
    return pouchdb_1.default.defaults(POUCH_DB_DEFAULTS);
}
exports.getPouch = getPouch;
function getAllDbs(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield (0, node_fetch_1.default)((0, utils_1.checkSlashesInUrl)(encodeURI(`${url}/_all_dbs`)), {
            method: "GET",
        });
        if (response.status === 200) {
            return yield response.json();
        }
        else {
            throw "Cannot connect to CouchDB instance";
        }
    });
}
exports.getAllDbs = getAllDbs;
