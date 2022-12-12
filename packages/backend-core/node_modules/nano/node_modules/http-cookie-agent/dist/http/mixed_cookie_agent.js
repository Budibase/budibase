"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MixedCookieAgent = void 0;

var _agentBase = _interopRequireDefault(require("agent-base"));

var _http_cookie_agent = require("./http_cookie_agent");

var _https_cookie_agent = require("./https_cookie_agent");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class MixedCookieAgent extends _agentBase.default.Agent {
  constructor(options) {
    super();
    this._httpAgent = new _http_cookie_agent.HttpCookieAgent(options);
    this._httpsAgent = new _https_cookie_agent.HttpsCookieAgent(options);
  }

  callback(_req, options) {
    return options.secureEndpoint ? this._httpsAgent : this._httpAgent;
  }

}

exports.MixedCookieAgent = MixedCookieAgent;