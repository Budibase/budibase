"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CookieAgent = void 0;

var _undici = require("undici");

var _validate_cookie_options = require("../utils/validate_cookie_options");

var _cookie_client = require("./cookie_client");

class CookieAgent extends _undici.Agent {
  constructor({
    cookies: cookieOpts,
    ...agentOpts
  } = {}) {
    if (agentOpts.factory) {
      throw new _undici.errors.InvalidArgumentError('factory function cannot set via CookieAgent');
    }

    if (cookieOpts) {
      (0, _validate_cookie_options.validateCookieOptions)(cookieOpts);
    }

    function factory(origin, opts) {
      if (opts && opts.connections === 1) {
        return new _cookie_client.CookieClient(origin, { ...opts,
          cookies: cookieOpts
        });
      } else {
        return new _undici.Pool(origin, { ...opts,
          factory: (origin, opts) => {
            return new _cookie_client.CookieClient(origin, { ...opts,
              cookies: cookieOpts
            });
          }
        });
      }
    }

    super({ ...agentOpts,
      factory
    });
  }

}

exports.CookieAgent = CookieAgent;