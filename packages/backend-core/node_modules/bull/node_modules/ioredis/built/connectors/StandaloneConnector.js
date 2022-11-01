"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const tls_1 = require("tls");
const utils_1 = require("../utils");
const AbstractConnector_1 = require("./AbstractConnector");
function isIIpcConnectionOptions(value) {
    return value.path;
}
exports.isIIpcConnectionOptions = isIIpcConnectionOptions;
class StandaloneConnector extends AbstractConnector_1.default {
    constructor(options) {
        super(options.disconnectTimeout);
        this.options = options;
    }
    connect(_) {
        const { options } = this;
        this.connecting = true;
        let connectionOptions;
        if (isIIpcConnectionOptions(options)) {
            connectionOptions = {
                path: options.path,
            };
        }
        else {
            connectionOptions = {};
            if (options.port != null) {
                connectionOptions.port = options.port;
            }
            if (options.host != null) {
                connectionOptions.host = options.host;
            }
            if (options.family != null) {
                connectionOptions.family = options.family;
            }
        }
        if (options.tls) {
            Object.assign(connectionOptions, options.tls);
        }
        // TODO:
        // We use native Promise here since other Promise
        // implementation may use different schedulers that
        // cause issue when the stream is resolved in the
        // next tick.
        // Should use the provided promise in the next major
        // version and do not connect before resolved.
        return new Promise((resolve, reject) => {
            process.nextTick(() => {
                if (!this.connecting) {
                    reject(new Error(utils_1.CONNECTION_CLOSED_ERROR_MSG));
                    return;
                }
                try {
                    if (options.tls) {
                        this.stream = tls_1.connect(connectionOptions);
                    }
                    else {
                        this.stream = net_1.createConnection(connectionOptions);
                    }
                }
                catch (err) {
                    reject(err);
                    return;
                }
                this.stream.once("error", (err) => {
                    this.firstError = err;
                });
                resolve(this.stream);
            });
        });
    }
}
exports.default = StandaloneConnector;
