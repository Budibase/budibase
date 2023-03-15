"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.luceneLimit = exports.luceneSort = exports.runLuceneQuery = exports.buildLuceneQuery = exports.NoEmptyFilterStrings = exports.getValidOperatorsForType = void 0;
const types_1 = require("@budibase/types");
const constants_1 = require("./constants");
const helpers_1 = require("./helpers");
const HBS_REGEX = /{{([^{].*?)}}/g;
/**
 * Returns the valid operator options for a certain data type
 * @param type the data type
 */
const getValidOperatorsForType = (type, field, datasource // TODO: is this table id ever populated?
) => {
    var _a;
    const Op = constants_1.OperatorOptions;
    const stringOps = [
        Op.Equals,
        Op.NotEquals,
        Op.StartsWith,
        Op.Like,
        Op.Empty,
        Op.NotEmpty,
        Op.In,
    ];
    const numOps = [
        Op.Equals,
        Op.NotEquals,
        Op.MoreThan,
        Op.LessThan,
        Op.Empty,
        Op.NotEmpty,
        Op.In,
    ];
    let ops = [];
    if (type === "string") {
        ops = stringOps;
    }
    else if (type === "number") {
        ops = numOps;
    }
    else if (type === "options") {
        ops = [Op.Equals, Op.NotEquals, Op.Empty, Op.NotEmpty, Op.In];
    }
    else if (type === "array") {
        ops = [Op.Contains, Op.NotContains, Op.Empty, Op.NotEmpty, Op.ContainsAny];
    }
    else if (type === "boolean") {
        ops = [Op.Equals, Op.NotEquals, Op.Empty, Op.NotEmpty];
    }
    else if (type === "longform") {
        ops = stringOps;
    }
    else if (type === "datetime") {
        ops = numOps;
    }
    else if (type === "formula") {
        ops = stringOps.concat([Op.MoreThan, Op.LessThan]);
    }
    // Filter out "like" for internal tables
    const externalTable = (_a = datasource === null || datasource === void 0 ? void 0 : datasource.tableId) === null || _a === void 0 ? void 0 : _a.includes("datasource_plus");
    if ((datasource === null || datasource === void 0 ? void 0 : datasource.type) === "table" && !externalTable) {
        ops = ops.filter(x => x !== Op.Like);
    }
    // Only allow equal/not equal for _id in SQL tables
    if (field === "_id" && externalTable) {
        ops = [Op.Equals, Op.NotEquals, Op.In];
    }
    return ops;
};
exports.getValidOperatorsForType = getValidOperatorsForType;
/**
 * Operators which do not support empty strings as values
 */
exports.NoEmptyFilterStrings = [
    constants_1.OperatorOptions.StartsWith.value,
    constants_1.OperatorOptions.Like.value,
    constants_1.OperatorOptions.Equals.value,
    constants_1.OperatorOptions.NotEquals.value,
    constants_1.OperatorOptions.Contains.value,
    constants_1.OperatorOptions.NotContains.value,
];
/**
 * Removes any fields that contain empty strings that would cause inconsistent
 * behaviour with how backend tables are filtered (no value means no filter).
 */
const cleanupQuery = (query) => {
    if (!query) {
        return query;
    }
    for (let filterField of exports.NoEmptyFilterStrings) {
        if (!query[filterField]) {
            continue;
        }
        for (let [key, value] of Object.entries(query[filterField])) {
            if (value == null || value === "") {
                delete query[filterField][key];
            }
        }
    }
    return query;
};
/**
 * Removes a numeric prefix on field names designed to give fields uniqueness
 */
const removeKeyNumbering = (key) => {
    if (typeof key === "string" && key.match(/\d[0-9]*:/g) != null) {
        const parts = key.split(":");
        parts.shift();
        return parts.join(":");
    }
    else {
        return key;
    }
};
/**
 * Builds a lucene JSON query from the filter structure generated in the builder
 * @param filter the builder filter structure
 */
const buildLuceneQuery = (filter) => {
    let query = {
        string: {},
        fuzzy: {},
        range: {},
        equal: {},
        notEqual: {},
        empty: {},
        notEmpty: {},
        contains: {},
        notContains: {},
        oneOf: {},
        containsAny: {},
    };
    if (Array.isArray(filter)) {
        filter.forEach(expression => {
            var _a, _b, _c;
            let { operator, field, type, value, externalType } = expression;
            const isHbs = typeof value === "string" && (value.match(HBS_REGEX) || []).length > 0;
            // Parse all values into correct types
            if (operator === "allOr") {
                query.allOr = true;
                return;
            }
            if (type === "datetime" &&
                !isHbs &&
                operator !== "empty" &&
                operator !== "notEmpty") {
                // Ensure date value is a valid date and parse into correct format
                if (!value) {
                    return;
                }
                try {
                    value = new Date(value).toISOString();
                }
                catch (error) {
                    return;
                }
            }
            if (type === "number" && typeof value === "string") {
                if (operator === "oneOf") {
                    value = value.split(",").map(item => parseFloat(item));
                }
                else if (!isHbs) {
                    value = parseFloat(value);
                }
            }
            if (type === "boolean") {
                value = ((_a = `${value}`) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "true";
            }
            if (["contains", "notContains", "containsAny"].includes(operator) &&
                type === "array" &&
                typeof value === "string") {
                value = value.split(",");
            }
            if (operator.startsWith("range") && query.range) {
                const minint = ((_b = constants_1.SqlNumberTypeRangeMap[externalType]) === null || _b === void 0 ? void 0 : _b.min) || Number.MIN_SAFE_INTEGER;
                const maxint = ((_c = constants_1.SqlNumberTypeRangeMap[externalType]) === null || _c === void 0 ? void 0 : _c.max) || Number.MAX_SAFE_INTEGER;
                if (!query.range[field]) {
                    query.range[field] = {
                        low: type === "number" ? minint : "0000-00-00T00:00:00.000Z",
                        high: type === "number" ? maxint : "9999-00-00T00:00:00.000Z",
                    };
                }
                if (operator === "rangeLow" && value != null && value !== "") {
                    query.range[field].low = value;
                }
                else if (operator === "rangeHigh" &&
                    value != null &&
                    value !== "") {
                    query.range[field].high = value;
                }
            }
            else if (query[operator]) {
                if (type === "boolean") {
                    // Transform boolean filters to cope with null.
                    // "equals false" needs to be "not equals true"
                    // "not equals false" needs to be "equals true"
                    if (operator === "equal" && value === false) {
                        query.notEqual = query.notEqual || {};
                        query.notEqual[field] = true;
                    }
                    else if (operator === "notEqual" && value === false) {
                        query.equal = query.equal || {};
                        query.equal[field] = true;
                    }
                    else {
                        query[operator] = query[operator] || {};
                        query[operator][field] = value;
                    }
                }
                else {
                    query[operator] = query[operator] || {};
                    query[operator][field] = value;
                }
            }
        });
    }
    return query;
};
exports.buildLuceneQuery = buildLuceneQuery;
/**
 * Performs a client-side lucene search on an array of data
 * @param docs the data
 * @param query the JSON lucene query
 */
const runLuceneQuery = (docs, query) => {
    if (!docs || !Array.isArray(docs)) {
        return [];
    }
    if (!query) {
        return docs;
    }
    // Make query consistent first
    query = cleanupQuery(query);
    // Iterates over a set of filters and evaluates a fail function against a doc
    const match = (type, failFn) => (doc) => {
        const filters = Object.entries(query[type] || {});
        for (let i = 0; i < filters.length; i++) {
            const [key, testValue] = filters[i];
            const docValue = (0, helpers_1.deepGet)(doc, removeKeyNumbering(key));
            if (failFn(docValue, testValue)) {
                return false;
            }
        }
        return true;
    };
    // Process a string match (fails if the value does not start with the string)
    const stringMatch = match("string", (docValue, testValue) => {
        return (!docValue || !(docValue === null || docValue === void 0 ? void 0 : docValue.toLowerCase().startsWith(testValue === null || testValue === void 0 ? void 0 : testValue.toLowerCase())));
    });
    // Process a fuzzy match (treat the same as starts with when running locally)
    const fuzzyMatch = match("fuzzy", (docValue, testValue) => {
        return (!docValue || !(docValue === null || docValue === void 0 ? void 0 : docValue.toLowerCase().startsWith(testValue === null || testValue === void 0 ? void 0 : testValue.toLowerCase())));
    });
    // Process a range match
    const rangeMatch = match("range", (docValue, testValue) => {
        return (docValue == null ||
            docValue === "" ||
            docValue < testValue.low ||
            docValue > testValue.high);
    });
    // Process an equal match (fails if the value is different)
    const equalMatch = match("equal", (docValue, testValue) => {
        return testValue != null && testValue !== "" && docValue !== testValue;
    });
    // Process a not-equal match (fails if the value is the same)
    const notEqualMatch = match("notEqual", (docValue, testValue) => {
        return testValue != null && testValue !== "" && docValue === testValue;
    });
    // Process an empty match (fails if the value is not empty)
    const emptyMatch = match("empty", (docValue) => {
        return docValue != null && docValue !== "";
    });
    // Process a not-empty match (fails is the value is empty)
    const notEmptyMatch = match("notEmpty", (docValue) => {
        return docValue == null || docValue === "";
    });
    // Process an includes match (fails if the value is not included)
    const oneOf = match("oneOf", (docValue, testValue) => {
        if (typeof testValue === "string") {
            testValue = testValue.split(",");
            if (typeof docValue === "number") {
                testValue = testValue.map((item) => parseFloat(item));
            }
        }
        return !(testValue === null || testValue === void 0 ? void 0 : testValue.includes(docValue));
    });
    const containsAny = match("containsAny", (docValue, testValue) => {
        return !(docValue === null || docValue === void 0 ? void 0 : docValue.includes(...testValue));
    });
    const contains = match("contains", (docValue, testValue) => {
        return !(testValue === null || testValue === void 0 ? void 0 : testValue.every((item) => docValue === null || docValue === void 0 ? void 0 : docValue.includes(item)));
    });
    const notContains = match("notContains", (docValue, testValue) => {
        return testValue === null || testValue === void 0 ? void 0 : testValue.every((item) => docValue === null || docValue === void 0 ? void 0 : docValue.includes(item));
    });
    // Match a document against all criteria
    const docMatch = (doc) => {
        return (stringMatch(doc) &&
            fuzzyMatch(doc) &&
            rangeMatch(doc) &&
            equalMatch(doc) &&
            notEqualMatch(doc) &&
            emptyMatch(doc) &&
            notEmptyMatch(doc) &&
            oneOf(doc) &&
            contains(doc) &&
            containsAny(doc) &&
            notContains(doc));
    };
    // Process all docs
    return docs.filter(docMatch);
};
exports.runLuceneQuery = runLuceneQuery;
/**
 * Performs a client-side sort from the equivalent server-side lucene sort
 * parameters.
 * @param docs the data
 * @param sort the sort column
 * @param sortOrder the sort order ("ascending" or "descending")
 * @param sortType the type of sort ("string" or "number")
 */
const luceneSort = (docs, sort, sortOrder, sortType = types_1.SortType.STRING) => {
    if (!sort || !sortOrder || !sortType) {
        return docs;
    }
    const parse = sortType === "string" ? (x) => `${x}` : (x) => parseFloat(x);
    return docs
        .slice()
        .sort((a, b) => {
        const colA = parse(a[sort]);
        const colB = parse(b[sort]);
        if (sortOrder.toLowerCase() === "descending") {
            return colA > colB ? -1 : 1;
        }
        else {
            return colA > colB ? 1 : -1;
        }
    });
};
exports.luceneSort = luceneSort;
/**
 * Limits the specified docs to the specified number of rows from the equivalent
 * server-side lucene limit parameters.
 * @param docs the data
 * @param limit the number of docs to limit to
 */
const luceneLimit = (docs, limit) => {
    const numLimit = parseFloat(limit);
    if (isNaN(numLimit)) {
        return docs;
    }
    return docs.slice(0, numLimit);
};
exports.luceneLimit = luceneLimit;
//# sourceMappingURL=filters.js.map