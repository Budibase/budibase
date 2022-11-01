"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Tiny class to simplify dealing with subscription set
 *
 * @export
 * @class SubscriptionSet
 */
class SubscriptionSet {
    constructor() {
        this.set = {
            subscribe: {},
            psubscribe: {},
        };
    }
    add(set, channel) {
        this.set[mapSet(set)][channel] = true;
    }
    del(set, channel) {
        delete this.set[mapSet(set)][channel];
    }
    channels(set) {
        return Object.keys(this.set[mapSet(set)]);
    }
    isEmpty() {
        return (this.channels("subscribe").length === 0 &&
            this.channels("psubscribe").length === 0);
    }
}
exports.default = SubscriptionSet;
function mapSet(set) {
    if (set === "unsubscribe") {
        return "subscribe";
    }
    if (set === "punsubscribe") {
        return "psubscribe";
    }
    return set;
}
