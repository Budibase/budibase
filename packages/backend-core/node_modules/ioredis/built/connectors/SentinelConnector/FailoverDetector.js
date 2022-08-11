"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
const debug = utils_1.Debug("FailoverDetector");
const CHANNEL_NAME = "+switch-master";
class FailoverDetector {
    // sentinels can't be used for regular commands after this
    constructor(connector, sentinels) {
        this.isDisconnected = false;
        this.connector = connector;
        this.sentinels = sentinels;
    }
    cleanup() {
        this.isDisconnected = true;
        for (const sentinel of this.sentinels) {
            sentinel.client.disconnect();
        }
    }
    subscribe() {
        return __awaiter(this, void 0, void 0, function* () {
            debug("Starting FailoverDetector");
            const promises = [];
            for (const sentinel of this.sentinels) {
                const promise = sentinel.client.subscribe(CHANNEL_NAME).catch((err) => {
                    debug("Failed to subscribe to failover messages on sentinel %s:%s (%s)", sentinel.address.host || "127.0.0.1", sentinel.address.port || 26739, err.message);
                });
                promises.push(promise);
                sentinel.client.on("message", (channel) => {
                    if (!this.isDisconnected && channel === CHANNEL_NAME) {
                        this.disconnect();
                    }
                });
            }
            yield Promise.all(promises);
        });
    }
    disconnect() {
        // Avoid disconnecting more than once per failover.
        // A new FailoverDetector will be created after reconnecting.
        this.isDisconnected = true;
        debug("Failover detected, disconnecting");
        // Will call this.cleanup()
        this.connector.disconnect();
    }
}
exports.FailoverDetector = FailoverDetector;
