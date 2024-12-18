"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqlClient = exports.UILogicalOperator = exports.EmptyFilterOption = exports.InternalSearchFilterOperator = exports.LogicalOperator = exports.RangeOperator = exports.ArrayOperator = exports.BasicOperator = void 0;
exports.isLogicalSearchOperator = isLogicalSearchOperator;
exports.isBasicSearchOperator = isBasicSearchOperator;
exports.isArraySearchOperator = isArraySearchOperator;
exports.isRangeSearchOperator = isRangeSearchOperator;
var BasicOperator;
(function (BasicOperator) {
    BasicOperator["EQUAL"] = "equal";
    BasicOperator["NOT_EQUAL"] = "notEqual";
    BasicOperator["EMPTY"] = "empty";
    BasicOperator["NOT_EMPTY"] = "notEmpty";
    BasicOperator["FUZZY"] = "fuzzy";
    BasicOperator["STRING"] = "string";
})(BasicOperator || (exports.BasicOperator = BasicOperator = {}));
var ArrayOperator;
(function (ArrayOperator) {
    ArrayOperator["CONTAINS"] = "contains";
    ArrayOperator["NOT_CONTAINS"] = "notContains";
    ArrayOperator["CONTAINS_ANY"] = "containsAny";
    ArrayOperator["ONE_OF"] = "oneOf";
})(ArrayOperator || (exports.ArrayOperator = ArrayOperator = {}));
var RangeOperator;
(function (RangeOperator) {
    RangeOperator["RANGE"] = "range";
})(RangeOperator || (exports.RangeOperator = RangeOperator = {}));
var LogicalOperator;
(function (LogicalOperator) {
    LogicalOperator["AND"] = "$and";
    LogicalOperator["OR"] = "$or";
})(LogicalOperator || (exports.LogicalOperator = LogicalOperator = {}));
function isLogicalSearchOperator(value) {
    return Object.values(LogicalOperator).includes(value);
}
function isBasicSearchOperator(value) {
    return Object.values(BasicOperator).includes(value);
}
function isArraySearchOperator(value) {
    return Object.values(ArrayOperator).includes(value);
}
function isRangeSearchOperator(value) {
    return Object.values(RangeOperator).includes(value);
}
var InternalSearchFilterOperator;
(function (InternalSearchFilterOperator) {
    InternalSearchFilterOperator["COMPLEX_ID_OPERATOR"] = "_complexIdOperator";
})(InternalSearchFilterOperator || (exports.InternalSearchFilterOperator = InternalSearchFilterOperator = {}));
var EmptyFilterOption;
(function (EmptyFilterOption) {
    EmptyFilterOption["RETURN_ALL"] = "all";
    EmptyFilterOption["RETURN_NONE"] = "none";
})(EmptyFilterOption || (exports.EmptyFilterOption = EmptyFilterOption = {}));
var UILogicalOperator;
(function (UILogicalOperator) {
    UILogicalOperator["ALL"] = "all";
    UILogicalOperator["ANY"] = "any";
})(UILogicalOperator || (exports.UILogicalOperator = UILogicalOperator = {}));
var SqlClient;
(function (SqlClient) {
    SqlClient["MS_SQL"] = "mssql";
    SqlClient["POSTGRES"] = "pg";
    SqlClient["MY_SQL"] = "mysql2";
    SqlClient["MARIADB"] = "mariadb";
    SqlClient["ORACLE"] = "oracledb";
    SqlClient["SQL_LITE"] = "sqlite3";
})(SqlClient || (exports.SqlClient = SqlClient = {}));
