/// <reference types="node" />
/// <reference types="pouchdb-find" />
import Nano from "nano";
import { AllDocsResponse, AnyDocument, Database, DatabaseOpts, DatabaseQueryOpts, DatabasePutOpts, DatabaseCreateIndexOpts, DatabaseDeleteIndexOpts, Document } from "@budibase/types";
import { WriteStream, ReadStream } from "fs";
export declare class DatabaseImpl implements Database {
    readonly name: string;
    private static nano;
    private readonly pouchOpts;
    constructor(dbName?: string, opts?: DatabaseOpts);
    static init(): void;
    exists(): Promise<boolean>;
    checkSetup(): Promise<Nano.DocumentScope<unknown>>;
    private updateOutput;
    get<T>(id?: string): Promise<T | any>;
    remove(idOrDoc: string | Document, rev?: string): Promise<any>;
    put(document: AnyDocument, opts?: DatabasePutOpts): Promise<any>;
    bulkDocs(documents: AnyDocument[]): Promise<any>;
    allDocs<T>(params: DatabaseQueryOpts): Promise<AllDocsResponse<T>>;
    query<T>(viewName: string, params: DatabaseQueryOpts): Promise<AllDocsResponse<T>>;
    destroy(): Promise<void>;
    compact(): Promise<any>;
    dump(stream: WriteStream, opts?: {
        filter?: any;
    }): Promise<any>;
    load(stream: ReadStream): Promise<any>;
    createIndex(opts: DatabaseCreateIndexOpts): Promise<PouchDB.Find.CreateIndexResponse<{}>>;
    deleteIndex(opts: DatabaseDeleteIndexOpts): Promise<PouchDB.Find.DeleteIndexResponse<{}>>;
    getIndexes(): Promise<PouchDB.Find.GetIndexesResponse<{}>>;
}
