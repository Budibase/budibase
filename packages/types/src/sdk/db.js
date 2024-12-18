"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDocument = exports.SortOption = exports.SearchIndex = void 0;
var SearchIndex;
(function (SearchIndex) {
    SearchIndex["ROWS"] = "rows";
    SearchIndex["USER"] = "user";
})(SearchIndex || (exports.SearchIndex = SearchIndex = {}));
var SortOption;
(function (SortOption) {
    SortOption["ASCENDING"] = "asc";
    SortOption["DESCENDING"] = "desc";
})(SortOption || (exports.SortOption = SortOption = {}));
const isDocument = (doc) => {
    return typeof doc === "object" && doc._id && doc._rev;
};
exports.isDocument = isDocument;
