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
const fetch = require("node-fetch");
class API {
    constructor(host) {
        this.apiCall = method => (url = "", options = {}) => __awaiter(this, void 0, void 0, function* () {
            if (!options.headers) {
                options.headers = {};
            }
            if (!options.headers["Content-Type"]) {
                options.headers = Object.assign({ "Content-Type": "application/json", Accept: "application/json" }, options.headers);
            }
            let json = options.headers["Content-Type"] === "application/json";
            const requestOptions = {
                method: method,
                body: json ? JSON.stringify(options.body) : options.body,
                headers: options.headers,
                // TODO: See if this is necessary
                credentials: "include",
            };
            return yield fetch(`${this.host}${url}`, requestOptions);
        });
        this.post = this.apiCall("POST");
        this.get = this.apiCall("GET");
        this.patch = this.apiCall("PATCH");
        this.del = this.apiCall("DELETE");
        this.put = this.apiCall("PUT");
        this.host = host;
    }
}
module.exports = API;
//# sourceMappingURL=api.js.map