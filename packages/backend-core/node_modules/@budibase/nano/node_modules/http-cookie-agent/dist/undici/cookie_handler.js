"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CookieHandler = void 0;

var _undici = require("undici");

var _save_cookies_from_header = require("../utils/save_cookies_from_header");

var _convert_to_headers_object = require("./utils/convert_to_headers_object");

const kRequestUrl = Symbol('requestUrl');
const kCookieOptions = Symbol('cookieOptions');
const kHandlers = Symbol('handlers');

class CookieHandler {
  constructor(requestUrl, cookieOptions, handlers) {
    this[kRequestUrl] = requestUrl;
    this[kCookieOptions] = cookieOptions;
    this[kHandlers] = handlers;
  }

  onConnect = abort => {
    var _this$kHandlers$onCon, _this$kHandlers;

    (_this$kHandlers$onCon = (_this$kHandlers = this[kHandlers]).onConnect) === null || _this$kHandlers$onCon === void 0 ? void 0 : _this$kHandlers$onCon.call(_this$kHandlers, abort);
  };
  onError = err => {
    var _this$kHandlers$onErr, _this$kHandlers2;

    (_this$kHandlers$onErr = (_this$kHandlers2 = this[kHandlers]).onError) === null || _this$kHandlers$onErr === void 0 ? void 0 : _this$kHandlers$onErr.call(_this$kHandlers2, err);
  };
  onUpgrade = (statusCode, headers, socket) => {
    var _this$kHandlers$onUpg, _this$kHandlers3;

    (_this$kHandlers$onUpg = (_this$kHandlers3 = this[kHandlers]).onUpgrade) === null || _this$kHandlers$onUpg === void 0 ? void 0 : _this$kHandlers$onUpg.call(_this$kHandlers3, statusCode, headers, socket);
  };
  onHeaders = (statusCode, _headers, resume) => {
    if (this[kHandlers].onHeaders == null) {
      throw new _undici.errors.InvalidArgumentError('invalid onHeaders method');
    }

    const headers = (0, _convert_to_headers_object.convertToHeadersObject)(_headers);
    (0, _save_cookies_from_header.saveCookiesFromHeader)({
      cookieOptions: this[kCookieOptions],
      cookies: headers['set-cookie'],
      requestUrl: this[kRequestUrl]
    }); // eslint-disable-next-line @typescript-eslint/no-non-null-assertion

    return this[kHandlers].onHeaders(statusCode, _headers, resume);
  };
  onData = chunk => {
    if (this[kHandlers].onData == null) {
      throw new _undici.errors.InvalidArgumentError('invalid onData method');
    } // eslint-disable-next-line @typescript-eslint/no-non-null-assertion


    return this[kHandlers].onData(chunk);
  };
  onComplete = trailers => {
    var _this$kHandlers$onCom, _this$kHandlers4;

    (_this$kHandlers$onCom = (_this$kHandlers4 = this[kHandlers]).onComplete) === null || _this$kHandlers$onCom === void 0 ? void 0 : _this$kHandlers$onCom.call(_this$kHandlers4, trailers);
  };
  onBodySent = (chunkSize, totalBytesSent) => {
    var _this$kHandlers$onBod, _this$kHandlers5;

    (_this$kHandlers$onBod = (_this$kHandlers5 = this[kHandlers]).onBodySent) === null || _this$kHandlers$onBod === void 0 ? void 0 : _this$kHandlers$onBod.call(_this$kHandlers5, chunkSize, totalBytesSent);
  };
}

exports.CookieHandler = CookieHandler;