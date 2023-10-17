import { TableConfig } from "../types";
export declare const deleteTables: (tableNames: string[], port: number) => Promise<void>;
export declare const createTables: (tables: TableConfig[], port: number) => Promise<void>;
export declare const killConnection: () => void;
