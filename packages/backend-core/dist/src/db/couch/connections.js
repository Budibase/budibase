"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUrlInfo = exports.getCouchInfo = void 0;
const environment_1 = __importDefault(require("../../environment"));
const getCouchInfo = () => {
    const urlInfo = (0, exports.getUrlInfo)();
    let username;
    let password;
    if (environment_1.default.COUCH_DB_USERNAME) {
        // set from env
        username = environment_1.default.COUCH_DB_USERNAME;
    }
    else if (urlInfo.auth.username) {
        // set from url
        username = urlInfo.auth.username;
    }
    else if (!environment_1.default.isTest()) {
        throw new Error("CouchDB username not set");
    }
    if (environment_1.default.COUCH_DB_PASSWORD) {
        // set from env
        password = environment_1.default.COUCH_DB_PASSWORD;
    }
    else if (urlInfo.auth.password) {
        // set from url
        password = urlInfo.auth.password;
    }
    else if (!environment_1.default.isTest()) {
        throw new Error("CouchDB password not set");
    }
    const authCookie = Buffer.from(`${username}:${password}`).toString("base64");
    return {
        url: urlInfo.url,
        auth: {
            username: username,
            password: password,
        },
        cookie: `Basic ${authCookie}`,
    };
};
exports.getCouchInfo = getCouchInfo;
const getUrlInfo = (url = environment_1.default.COUCH_DB_URL) => {
    let cleanUrl, username, password, host;
    if (url) {
        // Ensure the URL starts with a protocol
        const protoRegex = /^https?:\/\//i;
        if (!protoRegex.test(url)) {
            url = `http://${url}`;
        }
        // Split into protocol and remainder
        const split = url.split("://");
        const protocol = split[0];
        const rest = split.slice(1).join("://");
        // Extract auth if specified
        if (url.includes("@")) {
            // Split into host and remainder
            let parts = rest.split("@");
            host = parts[parts.length - 1];
            let auth = parts.slice(0, -1).join("@");
            // Split auth into username and password
            if (auth.includes(":")) {
                const authParts = auth.split(":");
                username = authParts[0];
                password = authParts.slice(1).join(":");
            }
            else {
                username = auth;
            }
        }
        else {
            host = rest;
        }
        cleanUrl = `${protocol}://${host}`;
    }
    return {
        url: cleanUrl,
        auth: {
            username,
            password,
        },
    };
};
exports.getUrlInfo = getUrlInfo;
//# sourceMappingURL=connections.js.map