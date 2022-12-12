"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async_hooks_1 = require("async_hooks");
class Context {
    static run(context, func) {
        return Context.storage.run(context, () => func());
    }
    static get() {
        return Context.storage.getStore();
    }
    static set(context) {
        Context.storage.enterWith(context);
    }
}
exports.default = Context;
Context.storage = new async_hooks_1.AsyncLocalStorage();
//# sourceMappingURL=Context.js.map