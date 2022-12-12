"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCookieHeaderValue = createCookieHeaderValue;

var _toughCookie = require("tough-cookie");

function createCookieHeaderValue({
  cookieOptions,
  passedValues,
  requestUrl
}) {
  const {
    async_UNSTABLE = false,
    jar
  } = cookieOptions;
  const getCookiesSync = async_UNSTABLE ? // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('deasync')(jar.getCookies.bind(jar)) : jar.getCookiesSync.bind(jar);
  const cookies = getCookiesSync(requestUrl);
  const cookiesMap = new Map(cookies.map(cookie => [cookie.key, cookie]));

  for (const passedValue of passedValues) {
    if (typeof passedValue !== 'string') {
      continue;
    }

    for (const str of passedValue.split(';')) {
      const cookie = _toughCookie.Cookie.parse(str.trim());

      if (cookie != null) {
        cookiesMap.set(cookie.key, cookie);
      }
    }
  }

  const cookieHeaderValue = Array.from(cookiesMap.values()).map(cookie => cookie.cookieString()).join(';\x20');
  return cookieHeaderValue;
}