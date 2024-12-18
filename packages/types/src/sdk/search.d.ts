import { Operation } from "./datasources";
import { Row, DocumentType, Table, Datasource } from "../documents";
import { SortOrder, SortType } from "../api";
import { Knex } from "knex";
import { Aggregation } from "./row";
export declare enum BasicOperator {
    EQUAL = "equal",
    NOT_EQUAL = "notEqual",
    EMPTY = "empty",
    NOT_EMPTY = "notEmpty",
    FUZZY = "fuzzy",
    STRING = "string"
}
export declare enum ArrayOperator {
    CONTAINS = "contains",
    NOT_CONTAINS = "notContains",
    CONTAINS_ANY = "containsAny",
    ONE_OF = "oneOf"
}
export declare enum RangeOperator {
    RANGE = "range"
}
export declare enum LogicalOperator {
    AND = "$and",
    OR = "$or"
}
export declare function isLogicalSearchOperator(value: string): value is LogicalOperator;
export declare function isBasicSearchOperator(value: string): value is BasicOperator;
export declare function isArraySearchOperator(value: string): value is ArrayOperator;
export declare function isRangeSearchOperator(value: string): value is RangeOperator;
export type SearchFilterOperator = BasicOperator | ArrayOperator | RangeOperator | LogicalOperator;
export declare enum InternalSearchFilterOperator {
    COMPLEX_ID_OPERATOR = "_complexIdOperator"
}
type BasicFilter<T = any> = Record<string, T> & {
    [InternalSearchFilterOperator.COMPLEX_ID_OPERATOR]?: never;
};
export type ArrayFilter = Record<string, any[]> & {
    [InternalSearchFilterOperator.COMPLEX_ID_OPERATOR]?: {
        id: string[];
        values: string[];
    };
};
type RangeFilter = Record<string, {
    high: number | string;
    low: number | string;
} | {
    high: number | string;
} | {
    low: number | string;
}> & {
    [InternalSearchFilterOperator.COMPLEX_ID_OPERATOR]?: never;
};
type LogicalFilter = {
    conditions: SearchFilters[];
};
export type AnySearchFilter = BasicFilter | ArrayFilter | RangeFilter;
export interface SearchFilters {
    allOr?: boolean;
    fuzzyOr?: boolean;
    onEmptyFilter?: EmptyFilterOption;
    [BasicOperator.STRING]?: BasicFilter<string>;
    [BasicOperator.FUZZY]?: BasicFilter<string>;
    [RangeOperator.RANGE]?: RangeFilter;
    [BasicOperator.EQUAL]?: BasicFilter;
    [BasicOperator.NOT_EQUAL]?: BasicFilter;
    [BasicOperator.EMPTY]?: BasicFilter;
    [BasicOperator.NOT_EMPTY]?: BasicFilter;
    [ArrayOperator.ONE_OF]?: ArrayFilter;
    [ArrayOperator.CONTAINS]?: ArrayFilter;
    [ArrayOperator.NOT_CONTAINS]?: ArrayFilter;
    [ArrayOperator.CONTAINS_ANY]?: ArrayFilter;
    documentType?: DocumentType;
    [LogicalOperator.AND]?: LogicalFilter;
    [LogicalOperator.OR]?: LogicalFilter;
}
export type SearchFilterKey = keyof Omit<SearchFilters, "allOr" | "onEmptyFilter" | "fuzzyOr" | "documentType">;
export type SearchQueryFields = Omit<SearchFilters, "allOr" | "onEmptyFilter">;
export interface SortJson {
    [key: string]: {
        direction: SortOrder;
        type?: SortType;
    };
}
export interface PaginationJson {
    limit: number;
    page?: string | number;
    offset?: number;
}
export interface RenameColumn {
    old: string;
    updated: string;
}
export interface RelationshipsJson {
    through?: string;
    from?: string;
    to?: string;
    fromPrimary?: string;
    toPrimary?: string;
    tableName: string;
    column: string;
}
export interface ManyToManyRelationshipJson {
    through: string;
    from: string;
    to: string;
    fromPrimary: string;
    toPrimary: string;
    tableName: string;
    column: string;
}
export interface QueryJson {
    endpoint: {
        datasourceId: string | Datasource;
        entityId: string | Table;
        operation: Operation;
        schema?: string;
    };
    resource?: {
        fields: string[];
        aggregations?: Aggregation[];
    };
    filters?: SearchFilters;
    sort?: SortJson;
    paginate?: PaginationJson;
    body?: Row | Row[];
    meta?: {
        renamed?: RenameColumn;
        oldTable?: Table;
        columnPrefix?: string;
    };
    extra?: {
        idFilter?: SearchFilters;
    };
    relationships?: RelationshipsJson[];
    tableAliases?: Record<string, string>;
}
export interface EnrichedQueryJson extends Omit<QueryJson, "endpoint"> {
    operation: Operation;
    table: Table;
    tables: Record<string, Table>;
    datasource?: Datasource;
    schema?: string;
}
export interface QueryOptions {
    disableReturning?: boolean;
    disableBindings?: boolean;
}
export type SqlQueryBinding = Knex.Value[];
export interface SqlQuery {
    sql: string;
    bindings?: SqlQueryBinding;
}
export declare enum EmptyFilterOption {
    RETURN_ALL = "all",
    RETURN_NONE = "none"
}
export declare enum UILogicalOperator {
    ALL = "all",
    ANY = "any"
}
export declare enum SqlClient {
    MS_SQL = "mssql",
    POSTGRES = "pg",
    MY_SQL = "mysql2",
    MARIADB = "mariadb",
    ORACLE = "oracledb",
    SQL_LITE = "sqlite3"
}
export {};
