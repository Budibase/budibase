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
exports.directCouchQuery = exports.directCouchCall = void 0;
const connections_1 = require("./connections");
const node_fetch_1 = __importDefault(require("node-fetch"));
const helpers_1 = require("../../helpers");
function directCouchCall(path, method = "GET", body) {
    return __awaiter(this, void 0, void 0, function* () {
        let { url, cookie } = (0, connections_1.getCouchInfo)();
        const couchUrl = `${url}/${path}`;
        const params = {
            method: method,
            headers: {
                Authorization: cookie,
            },
        };
        if (body && method !== "GET") {
            params.body = JSON.stringify(body);
            params.headers["Content-Type"] = "application/json";
        }
        return yield (0, node_fetch_1.default)((0, helpers_1.checkSlashesInUrl)(encodeURI(couchUrl)), params);
    });
}
exports.directCouchCall = directCouchCall;
function directCouchQuery(path, method = "GET", body) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield directCouchCall(path, method, body);
        if (response.status < 300) {
            return yield response.json();
        }
        else {
            throw "Cannot connect to CouchDB instance";
        }
    });
}
exports.directCouchQuery = directCouchQuery;
//# sourceMappingURL=utils.js.map