"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const utils_1 = require("../utils");
const redis_1 = require("../redis");
const debug = utils_1.Debug("cluster:subscriber");
class ClusterSubscriber {
    constructor(connectionPool, emitter) {
        this.connectionPool = connectionPool;
        this.emitter = emitter;
        this.started = false;
        this.subscriber = null;
        this.connectionPool.on("-node", (_, key) => {
            if (!this.started || !this.subscriber) {
                return;
            }
            if (util_1.getNodeKey(this.subscriber.options) === key) {
                debug("subscriber has left, selecting a new one...");
                this.selectSubscriber();
            }
        });
        this.connectionPool.on("+node", () => {
            if (!this.started || this.subscriber) {
                return;
            }
            debug("a new node is discovered and there is no subscriber, selecting a new one...");
            this.selectSubscriber();
        });
    }
    getInstance() {
        return this.subscriber;
    }
    selectSubscriber() {
        const lastActiveSubscriber = this.lastActiveSubscriber;
        // Disconnect the previous subscriber even if there
        // will not be a new one.
        if (lastActiveSubscriber) {
            lastActiveSubscriber.disconnect();
        }
        if (this.subscriber) {
            this.subscriber.disconnect();
        }
        const sampleNode = utils_1.sample(this.connectionPool.getNodes());
        if (!sampleNode) {
            debug("selecting subscriber failed since there is no node discovered in the cluster yet");
            this.subscriber = null;
            return;
        }
        const { options } = sampleNode;
        debug("selected a subscriber %s:%s", options.host, options.port);
        /*
         * Create a specialized Redis connection for the subscription.
         * Note that auto reconnection is enabled here.
         *
         * `enableReadyCheck` is also enabled because although subscription is allowed
         * while redis is loading data from the disk, we can check if the password
         * provided for the subscriber is correct, and if not, the current subscriber
         * will be disconnected and a new subscriber will be selected.
         */
        this.subscriber = new redis_1.default({
            port: options.port,
            host: options.host,
            username: options.username,
            password: options.password,
            enableReadyCheck: true,
            connectionName: util_1.getConnectionName("subscriber", options.connectionName),
            lazyConnect: true,
            tls: options.tls,
        });
        // Ignore the errors since they're handled in the connection pool.
        this.subscriber.on("error", utils_1.noop);
        // Re-subscribe previous channels
        const previousChannels = { subscribe: [], psubscribe: [] };
        if (lastActiveSubscriber) {
            const condition = lastActiveSubscriber.condition || lastActiveSubscriber.prevCondition;
            if (condition && condition.subscriber) {
                previousChannels.subscribe = condition.subscriber.channels("subscribe");
                previousChannels.psubscribe = condition.subscriber.channels("psubscribe");
            }
        }
        if (previousChannels.subscribe.length ||
            previousChannels.psubscribe.length) {
            let pending = 0;
            for (const type of ["subscribe", "psubscribe"]) {
                const channels = previousChannels[type];
                if (channels.length) {
                    pending += 1;
                    debug("%s %d channels", type, channels.length);
                    this.subscriber[type](channels)
                        .then(() => {
                        if (!--pending) {
                            this.lastActiveSubscriber = this.subscriber;
                        }
                    })
                        .catch(() => {
                        // TODO: should probably disconnect the subscriber and try again.
                        debug("failed to %s %d channels", type, channels.length);
                    });
                }
            }
        }
        else {
            this.lastActiveSubscriber = this.subscriber;
        }
        for (const event of ["message", "messageBuffer"]) {
            this.subscriber.on(event, (arg1, arg2) => {
                this.emitter.emit(event, arg1, arg2);
            });
        }
        for (const event of ["pmessage", "pmessageBuffer"]) {
            this.subscriber.on(event, (arg1, arg2, arg3) => {
                this.emitter.emit(event, arg1, arg2, arg3);
            });
        }
    }
    start() {
        this.started = true;
        this.selectSubscriber();
        debug("started");
    }
    stop() {
        this.started = false;
        if (this.subscriber) {
            this.subscriber.disconnect();
            this.subscriber = null;
        }
        debug("stopped");
    }
}
exports.default = ClusterSubscriber;
