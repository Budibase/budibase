/// <reference types="pouchdb-core" />
/**
 * This is designed to replicate Bull (https://github.com/OptimalBits/bull) in memory as a sort of mock.
 * It is relatively simple, using an event emitter internally to register when messages are available
 * to the consumers - in can support many inputs and many consumers.
 */
declare class InMemoryQueue {
    _name: string;
    _opts?: any;
    _messages: any[];
    _emitter: EventEmitter;
    /**
     * The constructor the queue, exactly the same as that of Bulls.
     * @param {string} name The name of the queue which is being configured.
     * @param {object|null} opts This is not used by the in memory queue as there is no real use
     * case when in memory, but is the same API as Bull
     */
    constructor(name: string, opts?: null);
    /**
     * Same callback API as Bull, each callback passed to this will consume messages as they are
     * available. Please note this is a queue service, not a notification service, so each
     * consumer will receive different messages.
     * @param {function<object>} func The callback function which will return a "Job", the same
     * as the Bull API, within this job the property "data" contains the JSON message. Please
     * note this is incredibly limited compared to Bull as in reality the Job would contain
     * a lot more information about the queue and current status of Bull cluster.
     */
    process(func: any): void;
    /**
     * Simple function to replicate the add message functionality of Bull, putting
     * a new message on the queue. This then emits an event which will be used to
     * return the message to a consumer (if one is attached).
     * @param {object} msg A message to be transported over the queue, this should be
     * a JSON message as this is required by Bull.
     * @param {boolean} repeat serves no purpose for the import queue.
     */
    add(msg: any, repeat: boolean): void;
    /**
     * replicating the close function from bull, which waits for jobs to finish.
     */
    close(): Promise<never[]>;
    /**
     * This removes a cron which has been implemented, this is part of Bull API.
     * @param {string} cronJobId The cron which is to be removed.
     */
    removeRepeatableByKey(cronJobId: string): void;
    /**
     * Implemented for tests
     */
    getRepeatableJobs(): never[];
    removeJobs(pattern: string): void;
    /**
     * Implemented for tests
     */
    clean(): Promise<never[]>;
    getJob(): Promise<{}>;
    on(): void;
}
export = InMemoryQueue;
