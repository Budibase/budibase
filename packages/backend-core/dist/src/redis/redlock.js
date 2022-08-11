"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedlock = void 0;
const redlock_1 = __importDefault(require("redlock"));
const getRedlock = (redisClient, opts = { retryCount: 10 }) => {
    return new redlock_1.default([redisClient], {
        // the expected clock drift; for more details
        // see http://redis.io/topics/distlock
        driftFactor: 0.01,
        // the max number of times Redlock will attempt
        // to lock a resource before erroring
        retryCount: opts.retryCount,
        // the time in ms between attempts
        retryDelay: 200,
        // the max time in ms randomly added to retries
        // to improve performance under high contention
        // see https://www.awsarchitectureblog.com/2015/03/backoff.html
        retryJitter: 200, // time in ms
    });
};
exports.getRedlock = getRedlock;
//# sourceMappingURL=redlock.js.map