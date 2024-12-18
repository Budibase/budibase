"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMethod = exports.BodyType = void 0;
var BodyType;
(function (BodyType) {
    BodyType["NONE"] = "none";
    BodyType["FORM_DATA"] = "form";
    BodyType["XML"] = "xml";
    BodyType["ENCODED"] = "encoded";
    BodyType["JSON"] = "json";
    BodyType["TEXT"] = "text";
})(BodyType || (exports.BodyType = BodyType = {}));
var HttpMethod;
(function (HttpMethod) {
    HttpMethod["GET"] = "GET";
    HttpMethod["POST"] = "POST";
    HttpMethod["PATCH"] = "PATCH";
    HttpMethod["PUT"] = "PUT";
    HttpMethod["HEAD"] = "HEAD";
    HttpMethod["DELETE"] = "DELETE";
})(HttpMethod || (exports.HttpMethod = HttpMethod = {}));
