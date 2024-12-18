import { Document } from "../../document";
import { View, ViewV2 } from "../view";
import { RenameColumn } from "../../../sdk";
import { TableSchema } from "./schema";
export declare const INTERNAL_TABLE_SOURCE_ID = "bb_internal";
export declare enum TableSourceType {
    EXTERNAL = "external",
    INTERNAL = "internal"
}
export interface Table extends Document {
    type: "table";
    sourceType: TableSourceType;
    views?: {
        [key: string]: View | ViewV2;
    };
    name: string;
    originalName?: string;
    sourceId: string;
    primary?: string[];
    schema: TableSchema;
    primaryDisplay?: string;
    relatedFormula?: string[];
    constrained?: string[];
    sql?: boolean;
    indexes?: {
        [key: string]: any;
    };
    created?: boolean;
    rowHeight?: number;
}
export interface TableRequest extends Table {
    _rename?: RenameColumn;
    created?: boolean;
}
