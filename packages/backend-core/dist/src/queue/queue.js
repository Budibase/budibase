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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueue = void 0;
const environment_1 = __importDefault(require("../environment"));
const utils_1 = require("../redis/utils");
const inMemoryQueue_1 = __importDefault(require("./inMemoryQueue"));
const bull_1 = __importDefault(require("bull"));
const listeners_1 = require("./listeners");
const { opts: redisOpts, redisProtocolUrl } = (0, utils_1.getRedisOptions)();
const CLEANUP_PERIOD_MS = 60 * 1000;
let QUEUES = [];
let cleanupInterval;
function cleanup() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let queue of QUEUES) {
            yield queue.clean(CLEANUP_PERIOD_MS, "completed");
        }
    });
}
function createQueue(jobQueue, opts = {}) {
    const queueConfig = redisProtocolUrl || { redis: redisOpts };
    let queue;
    if (!environment_1.default.isTest()) {
        queue = new bull_1.default(jobQueue, queueConfig);
    }
    else {
        queue = new inMemoryQueue_1.default(jobQueue, queueConfig);
    }
    (0, listeners_1.addListeners)(queue, jobQueue, opts === null || opts === void 0 ? void 0 : opts.removeStalledCb);
    QUEUES.push(queue);
    if (!cleanupInterval) {
        cleanupInterval = setInterval(cleanup, CLEANUP_PERIOD_MS);
        // fire off an initial cleanup
        cleanup().catch(err => {
            console.error(`Unable to cleanup automation queue initially - ${err}`);
        });
    }
    return queue;
}
exports.createQueue = createQueue;
exports.shutdown = () => __awaiter(void 0, void 0, void 0, function* () {
    if (QUEUES.length) {
        clearInterval(cleanupInterval);
        for (let queue of QUEUES) {
            yield queue.close();
        }
        QUEUES = [];
    }
    console.log("Queues shutdown");
});
//# sourceMappingURL=queue.js.map