"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
class DeprecationError extends Error {
    constructor({ page  }){
        super(`The middleware "${page}" accepts an async API directly with the form:
  
  export function middleware(request, event) {
    return new Response("Hello " + request.url)
  }
  
  Read more: https://nextjs.org/docs/messages/middleware-new-signature
  `);
    }
}
exports.DeprecationError = DeprecationError;

//# sourceMappingURL=error.js.map