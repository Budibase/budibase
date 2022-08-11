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
const cls = require("../clshooked");
const { newid } = require("../hashing");
const REQUEST_ID_KEY = "requestId";
const MAIN_CTX = cls.createNamespace("main");
function getContextStorage(namespace) {
    if (namespace && namespace.active) {
        let contextData = namespace.active;
        delete contextData.id;
        delete contextData._ns_name;
        return contextData;
    }
    return {};
}
class FunctionContext {
    static run(callback) {
        return MAIN_CTX.runAndReturn(() => __awaiter(this, void 0, void 0, function* () {
            const namespaceId = newid();
            MAIN_CTX.set(REQUEST_ID_KEY, namespaceId);
            const namespace = cls.createNamespace(namespaceId);
            let response = yield namespace.runAndReturn(callback);
            cls.destroyNamespace(namespaceId);
            return response;
        }));
    }
    static setOnContext(key, value) {
        const namespaceId = MAIN_CTX.get(REQUEST_ID_KEY);
        const namespace = cls.getNamespace(namespaceId);
        namespace.set(key, value);
    }
    static getFromContext(key) {
        const namespaceId = MAIN_CTX.get(REQUEST_ID_KEY);
        const namespace = cls.getNamespace(namespaceId);
        const context = getContextStorage(namespace);
        if (context) {
            return context[key];
        }
        else {
            return null;
        }
    }
}
module.exports = FunctionContext;
//# sourceMappingURL=FunctionContext.js.map