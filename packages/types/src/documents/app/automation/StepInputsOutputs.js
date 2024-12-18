"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
var Model;
(function (Model) {
    Model["GPT_35_TURBO"] = "gpt-3.5-turbo";
    // will only work with api keys that have access to the GPT4 API
    Model["GPT_4"] = "gpt-4";
    Model["GPT_4O"] = "gpt-4o";
    Model["GPT_4O_MINI"] = "gpt-4o-mini";
})(Model || (exports.Model = Model = {}));
var RequestType;
(function (RequestType) {
    RequestType["POST"] = "POST";
    RequestType["GET"] = "GET";
    RequestType["PUT"] = "PUT";
    RequestType["DELETE"] = "DELETE";
    RequestType["PATCH"] = "PATCH";
})(RequestType || (RequestType = {}));
