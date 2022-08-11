"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const promiseContainer_1 = require("./promiseContainer");
const command_1 = require("./command");
const standard_as_callback_1 = require("standard-as-callback");
class Script {
    constructor(lua, numberOfKeys = null, keyPrefix = "", readOnly = false) {
        this.lua = lua;
        this.numberOfKeys = numberOfKeys;
        this.keyPrefix = keyPrefix;
        this.readOnly = readOnly;
        this.sha = crypto_1.createHash("sha1").update(lua).digest("hex");
    }
    execute(container, args, options, callback) {
        if (typeof this.numberOfKeys === "number") {
            args.unshift(this.numberOfKeys);
        }
        if (this.keyPrefix) {
            options.keyPrefix = this.keyPrefix;
        }
        if (this.readOnly) {
            options.readOnly = true;
        }
        const evalsha = new command_1.default("evalsha", [this.sha].concat(args), options);
        evalsha.isCustomCommand = true;
        const result = container.sendCommand(evalsha);
        if (promiseContainer_1.isPromise(result)) {
            return standard_as_callback_1.default(result.catch((err) => {
                if (err.toString().indexOf("NOSCRIPT") === -1) {
                    throw err;
                }
                return container.sendCommand(new command_1.default("eval", [this.lua].concat(args), options));
            }), callback);
        }
        // result is not a Promise--probably returned from a pipeline chain; however,
        // we still need the callback to fire when the script is evaluated
        standard_as_callback_1.default(evalsha.promise, callback);
        return result;
    }
}
exports.default = Script;
