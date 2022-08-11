import { Datasource, Query } from "@budibase/types";
export declare const created: (datasource: Datasource, query: Query, timestamp?: string | number) => Promise<void>;
export declare const updated: (datasource: Datasource, query: Query) => Promise<void>;
export declare const deleted: (datasource: Datasource, query: Query) => Promise<void>;
export declare const imported: (datasource: Datasource, importSource: any, count: any) => Promise<void>;
export declare const run: (count: number, timestamp?: string | number) => Promise<void>;
export declare const previewed: (datasource: Datasource, query: Query) => Promise<void>;
