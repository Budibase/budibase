"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DSPlusOperation = exports.DatasourceFeature = exports.FilterType = exports.IncludeRelationship = exports.SourceName = exports.DatasourceFieldType = exports.QueryType = exports.RowOperations = exports.Operation = exports.PASSWORD_REPLACEMENT = void 0;
exports.PASSWORD_REPLACEMENT = "--secret-value--";
var Operation;
(function (Operation) {
    Operation["CREATE"] = "CREATE";
    Operation["READ"] = "READ";
    Operation["UPDATE"] = "UPDATE";
    Operation["DELETE"] = "DELETE";
    Operation["COUNT"] = "COUNT";
    Operation["BULK_CREATE"] = "BULK_CREATE";
    Operation["BULK_UPSERT"] = "BULK_UPSERT";
    Operation["CREATE_TABLE"] = "CREATE_TABLE";
    Operation["UPDATE_TABLE"] = "UPDATE_TABLE";
    Operation["DELETE_TABLE"] = "DELETE_TABLE";
})(Operation || (exports.Operation = Operation = {}));
exports.RowOperations = [
    Operation.CREATE,
    Operation.READ,
    Operation.UPDATE,
    Operation.DELETE,
    Operation.BULK_CREATE,
    Operation.BULK_UPSERT,
];
var QueryType;
(function (QueryType) {
    QueryType["SQL"] = "sql";
    QueryType["JSON"] = "json";
    QueryType["FIELDS"] = "fields";
})(QueryType || (exports.QueryType = QueryType = {}));
var DatasourceFieldType;
(function (DatasourceFieldType) {
    DatasourceFieldType["STRING"] = "string";
    DatasourceFieldType["CODE"] = "code";
    DatasourceFieldType["LONGFORM"] = "longForm";
    DatasourceFieldType["BOOLEAN"] = "boolean";
    DatasourceFieldType["NUMBER"] = "number";
    DatasourceFieldType["PASSWORD"] = "password";
    DatasourceFieldType["LIST"] = "list";
    DatasourceFieldType["OBJECT"] = "object";
    DatasourceFieldType["JSON"] = "json";
    DatasourceFieldType["FILE"] = "file";
    DatasourceFieldType["FIELD_GROUP"] = "fieldGroup";
    DatasourceFieldType["SELECT"] = "select";
})(DatasourceFieldType || (exports.DatasourceFieldType = DatasourceFieldType = {}));
var SourceName;
(function (SourceName) {
    SourceName["POSTGRES"] = "POSTGRES";
    SourceName["DYNAMODB"] = "DYNAMODB";
    SourceName["MONGODB"] = "MONGODB";
    SourceName["ELASTICSEARCH"] = "ELASTICSEARCH";
    SourceName["COUCHDB"] = "COUCHDB";
    SourceName["SQL_SERVER"] = "SQL_SERVER";
    SourceName["S3"] = "S3";
    SourceName["AIRTABLE"] = "AIRTABLE";
    SourceName["MYSQL"] = "MYSQL";
    SourceName["ARANGODB"] = "ARANGODB";
    SourceName["REST"] = "REST";
    SourceName["ORACLE"] = "ORACLE";
    SourceName["GOOGLE_SHEETS"] = "GOOGLE_SHEETS";
    SourceName["FIRESTORE"] = "FIRESTORE";
    SourceName["REDIS"] = "REDIS";
    SourceName["SNOWFLAKE"] = "SNOWFLAKE";
    SourceName["BUDIBASE"] = "BUDIBASE";
})(SourceName || (exports.SourceName = SourceName = {}));
var IncludeRelationship;
(function (IncludeRelationship) {
    IncludeRelationship[IncludeRelationship["INCLUDE"] = 1] = "INCLUDE";
    IncludeRelationship[IncludeRelationship["EXCLUDE"] = 0] = "EXCLUDE";
})(IncludeRelationship || (exports.IncludeRelationship = IncludeRelationship = {}));
var FilterType;
(function (FilterType) {
    FilterType["STRING"] = "string";
    FilterType["FUZZY"] = "fuzzy";
    FilterType["RANGE"] = "range";
    FilterType["EQUAL"] = "equal";
    FilterType["NOT_EQUAL"] = "notEqual";
    FilterType["EMPTY"] = "empty";
    FilterType["NOT_EMPTY"] = "notEmpty";
    FilterType["ONE_OF"] = "oneOf";
})(FilterType || (exports.FilterType = FilterType = {}));
var DatasourceFeature;
(function (DatasourceFeature) {
    DatasourceFeature["CONNECTION_CHECKING"] = "connection";
    DatasourceFeature["FETCH_TABLE_NAMES"] = "fetch_table_names";
    DatasourceFeature["EXPORT_SCHEMA"] = "export_schema";
})(DatasourceFeature || (exports.DatasourceFeature = DatasourceFeature = {}));
// return these when an operation occurred but we got no response
var DSPlusOperation;
(function (DSPlusOperation) {
    DSPlusOperation["CREATE"] = "create";
    DSPlusOperation["READ"] = "read";
    DSPlusOperation["UPDATE"] = "update";
    DSPlusOperation["DELETE"] = "delete";
})(DSPlusOperation || (exports.DSPlusOperation = DSPlusOperation = {}));
