import { CouchFindOptions, Database } from "@budibase/types";
export declare function getDB(dbName?: string, opts?: any): Database;
export declare function doWithDB(dbName: string, cb: any, opts?: {}): Promise<any>;
export declare function allDbs(): unknown[];
export declare function directCouchAllDbs(queryString?: string): Promise<any>;
export declare function directCouchFind(dbName: string, opts: CouchFindOptions): Promise<{
    rows: any;
    bookmark: any;
}>;
