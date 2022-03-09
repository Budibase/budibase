"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.detectLocaleCookie = detectLocaleCookie;
function detectLocaleCookie(req, locales) {
    const { NEXT_LOCALE  } = req.cookies || {
    };
    return NEXT_LOCALE ? locales.find((locale)=>NEXT_LOCALE.toLowerCase() === locale.toLowerCase()
    ) : undefined;
}

//# sourceMappingURL=detect-locale-cookie.js.map