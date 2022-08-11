/// <reference types="pouchdb-find" />
/// <reference types="pouchdb-core" />
/// <reference types="pouchdb-mapreduce" />
/// <reference types="pouchdb-replication" />
export declare function put(db: PouchDB.Database, doc: any, writeRateMs?: number): Promise<{
    ok: boolean;
    id: any;
    rev: any;
}>;
export declare function get(db: PouchDB.Database, id: string): Promise<any>;
export declare function remove(db: PouchDB.Database, docOrId: any, rev?: any): Promise<void>;
export declare class Writethrough {
    db: PouchDB.Database;
    writeRateMs: number;
    constructor(db: PouchDB.Database, writeRateMs?: number);
    put(doc: any): Promise<{
        ok: boolean;
        id: any;
        rev: any;
    }>;
    get(id: string): Promise<any>;
    remove(docOrId: any, rev?: any): Promise<void>;
}
