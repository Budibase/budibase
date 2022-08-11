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
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class Replication {
    /**
     *
     * @param {String} source - the DB you want to replicate or rollback to
     * @param {String} target - the DB you want to replicate to, or rollback from
     */
    constructor({ source, target }) {
        this.source = (0, _1.dangerousGetDB)(source);
        this.target = (0, _1.dangerousGetDB)(target);
    }
    close() {
        return Promise.all([(0, _1.closeDB)(this.source), (0, _1.closeDB)(this.target)]);
    }
    promisify(operation, opts = {}) {
        return new Promise(resolve => {
            operation(this.target, opts)
                .on("denied", function (err) {
                // a document failed to replicate (e.g. due to permissions)
                throw new Error(`Denied: Document failed to replicate ${err}`);
            })
                .on("complete", function (info) {
                return resolve(info);
            })
                .on("error", function (err) {
                throw new Error(`Replication Error: ${err}`);
            });
        });
    }
    /**
     * Two way replication operation, intended to be promise based.
     * @param {Object} opts - PouchDB replication options
     */
    sync(opts = {}) {
        this.replication = this.promisify(this.source.sync, opts);
        return this.replication;
    }
    /**
     * One way replication operation, intended to be promise based.
     * @param {Object} opts - PouchDB replication options
     */
    replicate(opts = {}) {
        this.replication = this.promisify(this.source.replicate.to, opts);
        return this.replication;
    }
    /**
     * Rollback the target DB back to the state of the source DB
     */
    rollback() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.target.destroy();
            // Recreate the DB again
            this.target = (0, _1.dangerousGetDB)(this.target.name);
            yield this.replicate();
        });
    }
    cancel() {
        this.replication.cancel();
    }
}
exports.default = Replication;
//# sourceMappingURL=Replication.js.map