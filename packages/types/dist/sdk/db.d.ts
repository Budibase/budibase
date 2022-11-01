/// <reference types="pouchdb-find" />
export declare type PouchOptions = {
    inMemory: boolean;
    replication: boolean;
    onDisk: boolean;
    find: boolean;
};
export declare enum SortOption {
    ASCENDING = "asc",
    DESCENDING = "desc"
}
export declare type CouchFindOptions = {
    selector: PouchDB.Find.Selector;
    fields?: string[];
    sort?: {
        [key: string]: SortOption;
    }[];
    limit?: number;
    skip?: number;
    bookmark?: string;
};
