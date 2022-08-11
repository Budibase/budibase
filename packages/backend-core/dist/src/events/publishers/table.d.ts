import { TableExportFormat, TableImportFormat, Table } from "@budibase/types";
export declare function created(table: Table, timestamp?: string | number): Promise<void>;
export declare function updated(table: Table): Promise<void>;
export declare function deleted(table: Table): Promise<void>;
export declare function exported(table: Table, format: TableExportFormat): Promise<void>;
export declare function imported(table: Table, format: TableImportFormat): Promise<void>;
