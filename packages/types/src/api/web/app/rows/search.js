"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchRowRequestValidator = void 0;
const sdk_1 = require("../../../../sdk");
const pagination_1 = require("../../../../api/web/pagination");
const zod_1 = require("zod");
const fieldKey = zod_1.z
    .string()
    .refine(s => s !== sdk_1.InternalSearchFilterOperator.COMPLEX_ID_OPERATOR, {
    message: `Key '${sdk_1.InternalSearchFilterOperator.COMPLEX_ID_OPERATOR}' is not allowed`,
});
const stringBasicFilter = zod_1.z.record(fieldKey, zod_1.z.string());
const basicFilter = zod_1.z.record(fieldKey, zod_1.z.any());
const arrayFilter = zod_1.z.record(fieldKey, zod_1.z.union([zod_1.z.any().array(), zod_1.z.string()]));
const logicFilter = zod_1.z.lazy(() => zod_1.z.object({
    conditions: zod_1.z.array(zod_1.z.object(queryFilterValidation)),
}));
const stringOrNumber = zod_1.z.union([zod_1.z.string(), zod_1.z.number()]);
const queryFilterValidation = {
    [sdk_1.BasicOperator.STRING]: stringBasicFilter.optional(),
    [sdk_1.BasicOperator.FUZZY]: stringBasicFilter.optional(),
    [sdk_1.RangeOperator.RANGE]: zod_1.z
        .record(fieldKey, zod_1.z.union([
        zod_1.z.object({ high: stringOrNumber, low: stringOrNumber }),
        zod_1.z.object({ high: stringOrNumber }),
        zod_1.z.object({ low: stringOrNumber }),
    ]))
        .optional(),
    [sdk_1.BasicOperator.EQUAL]: basicFilter.optional(),
    [sdk_1.BasicOperator.NOT_EQUAL]: basicFilter.optional(),
    [sdk_1.BasicOperator.EMPTY]: basicFilter.optional(),
    [sdk_1.BasicOperator.NOT_EMPTY]: basicFilter.optional(),
    [sdk_1.ArrayOperator.ONE_OF]: arrayFilter.optional(),
    [sdk_1.ArrayOperator.CONTAINS]: arrayFilter.optional(),
    [sdk_1.ArrayOperator.NOT_CONTAINS]: arrayFilter.optional(),
    [sdk_1.ArrayOperator.CONTAINS_ANY]: arrayFilter.optional(),
    [sdk_1.LogicalOperator.AND]: logicFilter.optional(),
    [sdk_1.LogicalOperator.OR]: logicFilter.optional(),
};
const searchRowRequest = zod_1.z.object({
    query: zod_1.z
        .object(Object.assign({ allOr: zod_1.z.boolean().optional(), onEmptyFilter: zod_1.z.nativeEnum(sdk_1.EmptyFilterOption).optional() }, queryFilterValidation))
        .optional(),
    paginate: zod_1.z.boolean().optional(),
    bookmark: zod_1.z.union([zod_1.z.string(), zod_1.z.number()]).nullish(),
    limit: zod_1.z.number().optional(),
    sort: zod_1.z.string().nullish(),
    sortOrder: zod_1.z.nativeEnum(pagination_1.SortOrder).optional(),
    sortType: zod_1.z.nativeEnum(pagination_1.SortType).nullish(),
    version: zod_1.z.string().optional(),
    disableEscaping: zod_1.z.boolean().optional(),
    countRows: zod_1.z.boolean().optional(),
});
exports.searchRowRequestValidator = searchRowRequest;
