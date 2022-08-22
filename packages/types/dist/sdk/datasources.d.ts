import { Table } from "../documents";
export declare enum Operation {
    CREATE = "CREATE",
    READ = "READ",
    UPDATE = "UPDATE",
    DELETE = "DELETE",
    BULK_CREATE = "BULK_CREATE",
    CREATE_TABLE = "CREATE_TABLE",
    UPDATE_TABLE = "UPDATE_TABLE",
    DELETE_TABLE = "DELETE_TABLE"
}
export declare enum SortDirection {
    ASCENDING = "ASCENDING",
    DESCENDING = "DESCENDING"
}
export declare enum QueryType {
    SQL = "sql",
    JSON = "json",
    FIELDS = "fields"
}
export declare enum DatasourceFieldType {
    STRING = "string",
    LONGFORM = "longForm",
    BOOLEAN = "boolean",
    NUMBER = "number",
    PASSWORD = "password",
    LIST = "list",
    OBJECT = "object",
    JSON = "json",
    FILE = "file"
}
export declare enum SourceName {
    POSTGRES = "POSTGRES",
    DYNAMODB = "DYNAMODB",
    MONGODB = "MONGODB",
    ELASTICSEARCH = "ELASTICSEARCH",
    COUCHDB = "COUCHDB",
    SQL_SERVER = "SQL_SERVER",
    S3 = "S3",
    AIRTABLE = "AIRTABLE",
    MYSQL = "MYSQL",
    ARANGODB = "ARANGODB",
    REST = "REST",
    ORACLE = "ORACLE",
    GOOGLE_SHEETS = "GOOGLE_SHEETS",
    FIRESTORE = "FIRESTORE",
    REDIS = "REDIS",
    SNOWFLAKE = "SNOWFLAKE",
    UNKNOWN = "unknown"
}
export declare enum IncludeRelationship {
    INCLUDE = 1,
    EXCLUDE = 0
}
export declare enum FilterType {
    STRING = "string",
    FUZZY = "fuzzy",
    RANGE = "range",
    EQUAL = "equal",
    NOT_EQUAL = "notEqual",
    EMPTY = "empty",
    NOT_EMPTY = "notEmpty",
    ONE_OF = "oneOf"
}
export interface QueryDefinition {
    type: QueryType;
    displayName?: string;
    readable?: boolean;
    customisable?: boolean;
    fields?: object;
    urlDisplay?: boolean;
}
export interface ExtraQueryConfig {
    [key: string]: {
        displayName: string;
        type: string;
        required: boolean;
        data?: object;
    };
}
export interface Integration {
    docs: string;
    plus?: boolean;
    auth?: {
        type: string;
    };
    relationships?: boolean;
    description: string;
    friendlyName: string;
    type?: string;
    datasource: {};
    query: {
        [key: string]: QueryDefinition;
    };
    extra?: ExtraQueryConfig;
}
export interface IntegrationBase {
    create?(query: any): Promise<any[] | any>;
    read?(query: any): Promise<any[] | any>;
    update?(query: any): Promise<any[] | any>;
    delete?(query: any): Promise<any[] | any>;
}
export interface DatasourcePlus extends IntegrationBase {
    tables: Record<string, Table>;
    schemaErrors: Record<string, string>;
    getBindingIdentifier(): string;
    getStringConcat(parts: string[]): string;
    buildSchema(datasourceId: string, entities: Record<string, Table>): any;
}
