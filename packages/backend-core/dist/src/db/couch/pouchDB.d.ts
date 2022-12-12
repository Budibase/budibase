/// <reference types="pouchdb-core" />
/// <reference types="pouchdb-find" />
/// <reference types="pouchdb-mapreduce" />
/// <reference types="pouchdb-replication" />
import { PouchOptions } from "@budibase/types";
/**
 * Return a constructor for PouchDB.
 * This should be rarely used outside of the main application config.
 * Exposed for exceptional cases such as in-memory views.
 */
export declare const getPouch: (opts?: PouchOptions) => new <Content extends {} = {}>(name?: string | undefined, options?: PouchDB.Configuration.DatabaseConfiguration | undefined) => PouchDB.Database<Content>;
export declare function init(opts?: PouchOptions): void;
export declare function getPouchDB(dbName: string, opts?: any): PouchDB.Database;
export declare function closePouchDB(db: PouchDB.Database): Promise<void>;
