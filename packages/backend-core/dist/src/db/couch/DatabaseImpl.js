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
exports.DatabaseImpl = void 0;
const nano_1 = __importDefault(require("nano"));
const types_1 = require("@budibase/types");
const connections_1 = require("./connections");
const utils_1 = require("./utils");
const pouchDB_1 = require("./pouchDB");
class DatabaseImpl {
    constructor(dbName, opts) {
        if (dbName == null) {
            throw new Error("Database name cannot be undefined.");
        }
        this.name = dbName;
        this.pouchOpts = opts || {};
        if (!DatabaseImpl.nano) {
            DatabaseImpl.init();
        }
    }
    static init() {
        const couchInfo = (0, connections_1.getCouchInfo)();
        DatabaseImpl.nano = (0, nano_1.default)({
            url: couchInfo.url,
            requestDefaults: {
                headers: {
                    Authorization: couchInfo.cookie,
                },
            },
            parseUrl: false,
        });
    }
    exists() {
        return __awaiter(this, void 0, void 0, function* () {
            let response = yield (0, utils_1.directCouchCall)(`/${this.name}`, "HEAD");
            return response.status === 200;
        });
    }
    checkSetup() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let shouldCreate = !((_a = this.pouchOpts) === null || _a === void 0 ? void 0 : _a.skip_setup);
            // check exists in a lightweight fashion
            let exists = yield this.exists();
            if (!shouldCreate && !exists) {
                throw new Error("DB does not exist");
            }
            if (!exists) {
                yield DatabaseImpl.nano.db.create(this.name);
            }
            return DatabaseImpl.nano.db.use(this.name);
        });
    }
    updateOutput(fnc) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield fnc();
            }
            catch (err) {
                if (err.statusCode) {
                    err.status = err.statusCode;
                }
                throw err;
            }
        });
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.checkSetup();
            if (!id) {
                throw new Error("Unable to get doc without a valid _id.");
            }
            return this.updateOutput(() => db.get(id));
        });
    }
    remove(idOrDoc, rev) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.checkSetup();
            let _id;
            let _rev;
            if ((0, types_1.isDocument)(idOrDoc)) {
                _id = idOrDoc._id;
                _rev = idOrDoc._rev;
            }
            else {
                _id = idOrDoc;
                _rev = rev;
            }
            if (!_id || !_rev) {
                throw new Error("Unable to remove doc without a valid _id and _rev.");
            }
            return this.updateOutput(() => db.destroy(_id, _rev));
        });
    }
    put(document, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!document._id) {
                throw new Error("Cannot store document without _id field.");
            }
            const db = yield this.checkSetup();
            if (!document.createdAt) {
                document.createdAt = new Date().toISOString();
            }
            document.updatedAt = new Date().toISOString();
            if ((opts === null || opts === void 0 ? void 0 : opts.force) && document._id) {
                try {
                    const existing = yield this.get(document._id);
                    if (existing) {
                        document._rev = existing._rev;
                    }
                }
                catch (err) {
                    if (err.status !== 404) {
                        throw err;
                    }
                }
            }
            return this.updateOutput(() => db.insert(document));
        });
    }
    bulkDocs(documents) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.checkSetup();
            return this.updateOutput(() => db.bulk({ docs: documents }));
        });
    }
    allDocs(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.checkSetup();
            return this.updateOutput(() => db.list(params));
        });
    }
    query(viewName, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.checkSetup();
            const [database, view] = viewName.split("/");
            return this.updateOutput(() => db.view(database, view, params));
        });
    }
    destroy() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield DatabaseImpl.nano.db.destroy(this.name);
            }
            catch (err) {
                // didn't exist, don't worry
                if (err.statusCode === 404) {
                    return;
                }
                else {
                    throw Object.assign(Object.assign({}, err), { status: err.statusCode });
                }
            }
        });
    }
    compact() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.checkSetup();
            return this.updateOutput(() => db.compact());
        });
    }
    // All below functions are in-frequently called, just utilise PouchDB
    // for them as it implements them better than we can
    dump(stream, opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const pouch = (0, pouchDB_1.getPouchDB)(this.name);
            // @ts-ignore
            return pouch.dump(stream, opts);
        });
    }
    load(stream) {
        return __awaiter(this, void 0, void 0, function* () {
            const pouch = (0, pouchDB_1.getPouchDB)(this.name);
            // @ts-ignore
            return pouch.load(stream);
        });
    }
    createIndex(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const pouch = (0, pouchDB_1.getPouchDB)(this.name);
            return pouch.createIndex(opts);
        });
    }
    deleteIndex(opts) {
        return __awaiter(this, void 0, void 0, function* () {
            const pouch = (0, pouchDB_1.getPouchDB)(this.name);
            return pouch.deleteIndex(opts);
        });
    }
    getIndexes() {
        return __awaiter(this, void 0, void 0, function* () {
            const pouch = (0, pouchDB_1.getPouchDB)(this.name);
            return pouch.getIndexes();
        });
    }
}
exports.DatabaseImpl = DatabaseImpl;
//# sourceMappingURL=DatabaseImpl.js.map