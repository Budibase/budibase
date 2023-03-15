import { Datasource, FieldType, SortDirection, SortType } from "@budibase/types";
import { SqlNumberTypeRangeMap } from "./constants";
/**
 * Returns the valid operator options for a certain data type
 * @param type the data type
 */
export declare const getValidOperatorsForType: (type: FieldType, field: string, datasource: Datasource & {
    tableId: any;
}) => {
    value: string;
    label: string;
}[];
/**
 * Operators which do not support empty strings as values
 */
export declare const NoEmptyFilterStrings: (keyof QueryFields)[];
declare type Filter = {
    operator: keyof Query;
    field: string;
    type: any;
    value: any;
    externalType: keyof typeof SqlNumberTypeRangeMap;
};
declare type Query = QueryFields & QueryConfig;
declare type QueryFields = {
    string?: {
        [key: string]: string;
    };
    fuzzy?: {
        [key: string]: string;
    };
    range?: {
        [key: string]: {
            high: number | string;
            low: number | string;
        };
    };
    equal?: {
        [key: string]: any;
    };
    notEqual?: {
        [key: string]: any;
    };
    empty?: {
        [key: string]: any;
    };
    notEmpty?: {
        [key: string]: any;
    };
    oneOf?: {
        [key: string]: any[];
    };
    contains?: {
        [key: string]: any[];
    };
    notContains?: {
        [key: string]: any[];
    };
    containsAny?: {
        [key: string]: any[];
    };
};
declare type QueryConfig = {
    allOr?: boolean;
};
/**
 * Builds a lucene JSON query from the filter structure generated in the builder
 * @param filter the builder filter structure
 */
export declare const buildLuceneQuery: (filter: Filter[]) => Query;
/**
 * Performs a client-side lucene search on an array of data
 * @param docs the data
 * @param query the JSON lucene query
 */
export declare const runLuceneQuery: (docs: any[], query?: Query) => any[];
/**
 * Performs a client-side sort from the equivalent server-side lucene sort
 * parameters.
 * @param docs the data
 * @param sort the sort column
 * @param sortOrder the sort order ("ascending" or "descending")
 * @param sortType the type of sort ("string" or "number")
 */
export declare const luceneSort: (docs: any[], sort: string, sortOrder: SortDirection, sortType?: SortType) => any[];
/**
 * Limits the specified docs to the specified number of rows from the equivalent
 * server-side lucene limit parameters.
 * @param docs the data
 * @param limit the number of docs to limit to
 */
export declare const luceneLimit: (docs: any[], limit: string) => any[];
export {};
