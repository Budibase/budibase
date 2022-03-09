"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = middlewareLoader;
var _stringifyRequest = require("../stringify-request");
function middlewareLoader() {
    const { absolutePagePath , page  } = this.getOptions();
    const stringifiedPagePath = (0, _stringifyRequest).stringifyRequest(this, absolutePagePath);
    return `
        import { adapter } from 'next/dist/server/web/adapter'

        var mod = require(${stringifiedPagePath})
        var handler = mod.middleware || mod.default;

        if (typeof handler !== 'function') {
          throw new Error('The Middleware "pages${page}" must export a \`middleware\` or a \`default\` function');
        }

        export default function (opts) {
          return adapter({
              ...opts,
              page: ${JSON.stringify(page)},
              handler,
          })
        }
    `;
}

//# sourceMappingURL=next-middleware-loader.js.map