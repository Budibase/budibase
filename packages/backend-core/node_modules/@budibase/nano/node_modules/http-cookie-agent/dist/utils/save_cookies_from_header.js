"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveCookiesFromHeader = saveCookiesFromHeader;

function saveCookiesFromHeader({
  cookieOptions,
  cookies,
  requestUrl
}) {
  const {
    async_UNSTABLE = false,
    jar
  } = cookieOptions;
  const setCookieSync = async_UNSTABLE ? // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('deasync')(jar.setCookie.bind(jar)) : jar.setCookieSync.bind(jar);

  for (const cookie of [cookies].flat()) {
    if (cookie == null) {
      continue;
    }

    setCookieSync(cookie, requestUrl, {
      ignoreError: true
    });
  }
}