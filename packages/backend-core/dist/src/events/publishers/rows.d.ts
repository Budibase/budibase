import { RowImportFormat, Table } from "@budibase/types";
export declare const created: (count: number, timestamp?: string | number) => Promise<void>;
export declare const imported: (table: Table, format: RowImportFormat, count: number) => Promise<void>;
