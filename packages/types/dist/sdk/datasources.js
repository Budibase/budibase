"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilterType = exports.IncludeRelationship = exports.SourceName = exports.DatasourceFieldType = exports.QueryType = exports.SortDirection = exports.Operation = void 0;
var Operation;
(function (Operation) {
    Operation["CREATE"] = "CREATE";
    Operation["READ"] = "READ";
    Operation["UPDATE"] = "UPDATE";
    Operation["DELETE"] = "DELETE";
    Operation["BULK_CREATE"] = "BULK_CREATE";
    Operation["CREATE_TABLE"] = "CREATE_TABLE";
    Operation["UPDATE_TABLE"] = "UPDATE_TABLE";
    Operation["DELETE_TABLE"] = "DELETE_TABLE";
})(Operation = exports.Operation || (exports.Operation = {}));
var SortDirection;
(function (SortDirection) {
    SortDirection["ASCENDING"] = "ASCENDING";
    SortDirection["DESCENDING"] = "DESCENDING";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
var QueryType;
(function (QueryType) {
    QueryType["SQL"] = "sql";
    QueryType["JSON"] = "json";
    QueryType["FIELDS"] = "fields";
})(QueryType = exports.QueryType || (exports.QueryType = {}));
var DatasourceFieldType;
(function (DatasourceFieldType) {
    DatasourceFieldType["STRING"] = "string";
    DatasourceFieldType["LONGFORM"] = "longForm";
    DatasourceFieldType["BOOLEAN"] = "boolean";
    DatasourceFieldType["NUMBER"] = "number";
    DatasourceFieldType["PASSWORD"] = "password";
    DatasourceFieldType["LIST"] = "list";
    DatasourceFieldType["OBJECT"] = "object";
    DatasourceFieldType["JSON"] = "json";
    DatasourceFieldType["FILE"] = "file";
})(DatasourceFieldType = exports.DatasourceFieldType || (exports.DatasourceFieldType = {}));
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
    SourceName["UNKNOWN"] = "unknown";
})(SourceName = exports.SourceName || (exports.SourceName = {}));
var IncludeRelationship;
(function (IncludeRelationship) {
    IncludeRelationship[IncludeRelationship["INCLUDE"] = 1] = "INCLUDE";
    IncludeRelationship[IncludeRelationship["EXCLUDE"] = 0] = "EXCLUDE";
})(IncludeRelationship = exports.IncludeRelationship || (exports.IncludeRelationship = {}));
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
})(FilterType = exports.FilterType || (exports.FilterType = {}));
//# sourceMappingURL=datasources.js.map