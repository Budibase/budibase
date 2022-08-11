declare class Replication {
    source: any;
    target: any;
    replication: any;
    /**
     *
     * @param {String} source - the DB you want to replicate or rollback to
     * @param {String} target - the DB you want to replicate to, or rollback from
     */
    constructor({ source, target }: any);
    close(): Promise<[any, any]>;
    promisify(operation: any, opts?: {}): Promise<unknown>;
    /**
     * Two way replication operation, intended to be promise based.
     * @param {Object} opts - PouchDB replication options
     */
    sync(opts?: {}): any;
    /**
     * One way replication operation, intended to be promise based.
     * @param {Object} opts - PouchDB replication options
     */
    replicate(opts?: {}): any;
    /**
     * Rollback the target DB back to the state of the source DB
     */
    rollback(): Promise<void>;
    cancel(): void;
}
export default Replication;
