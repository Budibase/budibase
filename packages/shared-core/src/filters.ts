import {
  Datasource,
  BBReferenceFieldSubType,
  FieldType,
  FormulaType,
  SearchFilter,
  SearchFilters,
  SearchQueryFields,
  SearchFilterOperator,
  SortType,
  FieldConstraints,
  SortOrder,
  RowSearchParams,
  EmptyFilterOption,
  SearchResponse,
} from "@budibase/types"
import dayjs from "dayjs"
import { OperatorOptions, SqlNumberTypeRangeMap } from "./constants"
import { deepGet, schema } from "./helpers"
import _ from "lodash"

const HBS_REGEX = /{{([^{].*?)}}/g

/**
 * Returns the valid operator options for a certain data type
 */
export const getValidOperatorsForType = (
  fieldType: {
    type: FieldType
    subtype?: BBReferenceFieldSubType
    formulaType?: FormulaType
    constraints?: FieldConstraints
  },
  field?: string,
  datasource?: Datasource & { tableId: any }
) => {
  const Op = OperatorOptions
  const stringOps = [
    Op.Equals,
    Op.NotEquals,
    Op.StartsWith,
    Op.Like,
    Op.Empty,
    Op.NotEmpty,
    Op.In,
  ]
  const numOps = [
    Op.Equals,
    Op.NotEquals,
    Op.MoreThan,
    Op.LessThan,
    Op.Empty,
    Op.NotEmpty,
    Op.In,
  ]
  let ops: {
    value: string
    label: string
  }[] = []
  const { type, formulaType } = fieldType
  if (type === FieldType.STRING) {
    ops = stringOps
  } else if (type === FieldType.NUMBER || type === FieldType.BIGINT) {
    ops = numOps
  } else if (type === FieldType.OPTIONS) {
    ops = [Op.Equals, Op.NotEquals, Op.Empty, Op.NotEmpty, Op.In]
  } else if (type === FieldType.ARRAY) {
    ops = [Op.Contains, Op.NotContains, Op.Empty, Op.NotEmpty, Op.ContainsAny]
  } else if (type === FieldType.BOOLEAN) {
    ops = [Op.Equals, Op.NotEquals, Op.Empty, Op.NotEmpty]
  } else if (type === FieldType.LONGFORM) {
    ops = stringOps
  } else if (type === FieldType.DATETIME) {
    ops = numOps
  } else if (type === FieldType.FORMULA && formulaType === FormulaType.STATIC) {
    ops = stringOps.concat([Op.MoreThan, Op.LessThan])
  } else if (
    type === FieldType.BB_REFERENCE_SINGLE ||
    schema.isDeprecatedSingleUserColumn(fieldType)
  ) {
    ops = [Op.Equals, Op.NotEquals, Op.Empty, Op.NotEmpty, Op.In]
  } else if (type === FieldType.BB_REFERENCE) {
    ops = [Op.Contains, Op.NotContains, Op.ContainsAny, Op.Empty, Op.NotEmpty]
  }

  // Only allow equal/not equal for _id in SQL tables
  const externalTable = datasource?.tableId?.includes("datasource_plus")
  if (field === "_id" && externalTable) {
    ops = [Op.Equals, Op.NotEquals, Op.In]
  }

  return ops
}

/**
 * Operators which do not support empty strings as values
 */
export const NoEmptyFilterStrings = [
  OperatorOptions.StartsWith.value,
  OperatorOptions.Like.value,
  OperatorOptions.Equals.value,
  OperatorOptions.NotEquals.value,
  OperatorOptions.Contains.value,
  OperatorOptions.NotContains.value,
] as (keyof SearchQueryFields)[]

/**
 * Removes any fields that contain empty strings that would cause inconsistent
 * behaviour with how backend tables are filtered (no value means no filter).
 */
const cleanupQuery = (query: SearchFilters) => {
  if (!query) {
    return query
  }
  for (let filterField of NoEmptyFilterStrings) {
    const operator = filterField as SearchFilterOperator
    if (!query[operator]) {
      continue
    }

    for (let [key, value] of Object.entries(query[operator]!)) {
      if (value == null || value === "") {
        delete query[operator]![key]
      }
    }
  }
  return query
}

/**
 * Removes a numeric prefix on field names designed to give fields uniqueness
 */
export const removeKeyNumbering = (key: string): string => {
  if (typeof key === "string" && key.match(/\d[0-9]*:/g) != null) {
    const parts = key.split(":")
    // remove the number
    parts.shift()
    return parts.join(":")
  } else {
    return key
  }
}

/**
 * Builds a JSON query from the filter structure generated in the builder
 * @param filter the builder filter structure
 */
export const buildQuery = (filter: SearchFilter[]) => {
  let query: SearchFilters = {
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
  }

  if (!Array.isArray(filter)) {
    return query
  }

  filter.forEach(expression => {
    let { operator, field, type, value, externalType, onEmptyFilter } =
      expression
    const queryOperator = operator as SearchFilterOperator
    const isHbs =
      typeof value === "string" && (value.match(HBS_REGEX) || []).length > 0
    // Parse all values into correct types
    if (operator === "allOr") {
      query.allOr = true
      return
    }
    if (onEmptyFilter) {
      query.onEmptyFilter = onEmptyFilter
      return
    }
    if (
      type === "datetime" &&
      !isHbs &&
      queryOperator !== "empty" &&
      queryOperator !== "notEmpty"
    ) {
      // Ensure date value is a valid date and parse into correct format
      if (!value) {
        return
      }
      try {
        value = new Date(value).toISOString()
      } catch (error) {
        return
      }
    }
    if (type === "number" && typeof value === "string" && !isHbs) {
      if (queryOperator === "oneOf") {
        value = value.split(",").map(item => parseFloat(item))
      } else {
        value = parseFloat(value)
      }
    }
    if (type === "boolean") {
      value = `${value}`?.toLowerCase() === "true"
    }
    if (
      ["contains", "notContains", "containsAny"].includes(operator) &&
      type === "array" &&
      typeof value === "string"
    ) {
      value = value.split(",")
    }
    if (operator.startsWith("range") && query.range) {
      const minint =
        SqlNumberTypeRangeMap[
          externalType as keyof typeof SqlNumberTypeRangeMap
        ]?.min || Number.MIN_SAFE_INTEGER
      const maxint =
        SqlNumberTypeRangeMap[
          externalType as keyof typeof SqlNumberTypeRangeMap
        ]?.max || Number.MAX_SAFE_INTEGER
      if (!query.range[field]) {
        query.range[field] = {
          low: type === "number" ? minint : "0000-00-00T00:00:00.000Z",
          high: type === "number" ? maxint : "9999-00-00T00:00:00.000Z",
        }
      }
      if (operator === "rangeLow" && value != null && value !== "") {
        query.range[field] = {
          ...query.range[field],
          low: value,
        }
      } else if (operator === "rangeHigh" && value != null && value !== "") {
        query.range[field] = {
          ...query.range[field],
          high: value,
        }
      }
    } else if (query[queryOperator] && operator !== "onEmptyFilter") {
      if (type === "boolean") {
        // Transform boolean filters to cope with null.
        // "equals false" needs to be "not equals true"
        // "not equals false" needs to be "equals true"
        if (queryOperator === "equal" && value === false) {
          query.notEqual = query.notEqual || {}
          query.notEqual[field] = true
        } else if (queryOperator === "notEqual" && value === false) {
          query.equal = query.equal || {}
          query.equal[field] = true
        } else {
          query[queryOperator] = {
            ...query[queryOperator],
            [field]: value,
          }
        }
      } else {
        query[queryOperator] = {
          ...query[queryOperator],
          [field]: value,
        }
      }
    }
  })

  return query
}

export const search = (
  docs: Record<string, any>[],
  query: RowSearchParams
): SearchResponse<Record<string, any>> => {
  let result = runQuery(docs, query.query)
  if (query.sort) {
    result = sort(result, query.sort, query.sortOrder || SortOrder.ASCENDING)
  }
  let totalRows = result.length
  if (query.limit) {
    result = limit(result, query.limit.toString())
  }
  const response: SearchResponse<Record<string, any>> = { rows: result }
  if (query.countRows) {
    response.totalRows = totalRows
  }
  return response
}

/**
 * Performs a client-side search on an array of data
 * @param docs the data
 * @param query the JSON query
 */
export const runQuery = (docs: Record<string, any>[], query: SearchFilters) => {
  if (!docs || !Array.isArray(docs)) {
    return []
  }
  if (!query) {
    return docs
  }

  query = cleanupQuery(query)

  if (
    !hasFilters(query) &&
    query.onEmptyFilter === EmptyFilterOption.RETURN_NONE
  ) {
    return []
  }

  const match =
    (
      type: SearchFilterOperator,
      test: (docValue: any, testValue: any) => boolean
    ) =>
    (doc: Record<string, any>) => {
      for (const [key, testValue] of Object.entries(query[type] || {})) {
        const result = test(deepGet(doc, removeKeyNumbering(key)), testValue)
        if (query.allOr && result) {
          return true
        } else if (!query.allOr && !result) {
          return false
        }
      }
      return true
    }

  const stringMatch = match(
    SearchFilterOperator.STRING,
    (docValue: any, testValue: any) => {
      if (!(typeof docValue === "string")) {
        return false
      }
      if (!(typeof testValue === "string")) {
        return false
      }
      return docValue.toLowerCase().startsWith(testValue.toLowerCase())
    }
  )

  const fuzzyMatch = match(
    SearchFilterOperator.FUZZY,
    (docValue: any, testValue: any) => {
      if (!(typeof docValue === "string")) {
        return false
      }
      if (!(typeof testValue === "string")) {
        return false
      }
      return docValue.toLowerCase().includes(testValue.toLowerCase())
    }
  )

  const rangeMatch = match(
    SearchFilterOperator.RANGE,
    (docValue: any, testValue: any) => {
      if (docValue == null || docValue === "") {
        return false
      }

      if (_.isObject(testValue.low) && _.isEmpty(testValue.low)) {
        testValue.low = undefined
      }

      if (_.isObject(testValue.high) && _.isEmpty(testValue.high)) {
        testValue.high = undefined
      }

      if (testValue.low == null && testValue.high == null) {
        return false
      }

      const docNum = +docValue
      if (!isNaN(docNum)) {
        const lowNum = +testValue.low
        const highNum = +testValue.high
        if (!isNaN(lowNum) && !isNaN(highNum)) {
          return docNum >= lowNum && docNum <= highNum
        } else if (!isNaN(lowNum)) {
          return docNum >= lowNum
        } else if (!isNaN(highNum)) {
          return docNum <= highNum
        }
      }

      const docDate = dayjs(docValue)
      if (docDate.isValid()) {
        const lowDate = dayjs(testValue.low || "0000-00-00T00:00:00.000Z")
        const highDate = dayjs(testValue.high || "9999-00-00T00:00:00.000Z")
        if (lowDate.isValid() && highDate.isValid()) {
          return (
            (docDate.isAfter(lowDate) && docDate.isBefore(highDate)) ||
            docDate.isSame(lowDate) ||
            docDate.isSame(highDate)
          )
        } else if (lowDate.isValid()) {
          return docDate.isAfter(lowDate) || docDate.isSame(lowDate)
        } else if (highDate.isValid()) {
          return docDate.isBefore(highDate) || docDate.isSame(highDate)
        }
      }

      if (testValue.low != null && testValue.high != null) {
        return docValue >= testValue.low && docValue <= testValue.high
      } else if (testValue.low != null) {
        return docValue >= testValue.low
      } else if (testValue.high != null) {
        return docValue <= testValue.high
      }

      return false
    }
  )

  // This function exists to check that either the docValue is equal to the
  // testValue, or if the docValue is an object or array of objects, that the
  // _id of the docValue is equal to the testValue.
  const _valueMatches = (docValue: any, testValue: any) => {
    if (Array.isArray(docValue)) {
      for (const item of docValue) {
        if (_valueMatches(item, testValue)) {
          return true
        }
      }
      return false
    }

    if (
      docValue &&
      typeof docValue === "object" &&
      typeof testValue === "string"
    ) {
      return docValue._id === testValue
    }

    return docValue === testValue
  }

  const not =
    <T extends any[]>(f: (...args: T) => boolean) =>
    (...args: T): boolean =>
      !f(...args)

  const equalMatch = match(SearchFilterOperator.EQUAL, _valueMatches)
  const notEqualMatch = match(
    SearchFilterOperator.NOT_EQUAL,
    not(_valueMatches)
  )

  const _empty = (docValue: any) => {
    if (typeof docValue === "string") {
      return docValue === ""
    }
    if (Array.isArray(docValue)) {
      return docValue.length === 0
    }
    if (typeof docValue === "object") {
      return Object.keys(docValue).length === 0
    }
    return docValue == null
  }

  const emptyMatch = match(SearchFilterOperator.EMPTY, _empty)
  const notEmptyMatch = match(SearchFilterOperator.NOT_EMPTY, not(_empty))

  const oneOf = match(
    SearchFilterOperator.ONE_OF,
    (docValue: any, testValue: any) => {
      if (typeof testValue === "string") {
        testValue = testValue.split(",")
        if (typeof docValue === "number") {
          testValue = testValue.map((item: string) => parseFloat(item))
        }
      }

      if (!Array.isArray(testValue)) {
        return false
      }

      return testValue.some(item => _valueMatches(docValue, item))
    }
  )

  const _contains =
    (f: "some" | "every") => (docValue: any, testValue: any) => {
      if (!Array.isArray(docValue)) {
        return false
      }

      if (typeof testValue === "string") {
        testValue = testValue.split(",")
        if (typeof docValue[0] === "number") {
          testValue = testValue.map((item: string) => parseFloat(item))
        }
      }

      if (!Array.isArray(testValue)) {
        return false
      }

      if (testValue.length === 0) {
        return true
      }

      return testValue[f](item => _valueMatches(docValue, item))
    }

  const contains = match(
    SearchFilterOperator.CONTAINS,
    (docValue: any, testValue: any) => {
      if (Array.isArray(testValue) && testValue.length === 0) {
        return true
      }
      return _contains("every")(docValue, testValue)
    }
  )
  const notContains = match(
    SearchFilterOperator.NOT_CONTAINS,
    (docValue: any, testValue: any) => {
      // Not sure if this is logically correct, but at the time this code was
      // written the search endpoint behaved this way and we wanted to make this
      // local search match its behaviour, so we had to do this.
      if (Array.isArray(testValue) && testValue.length === 0) {
        return true
      }
      return not(_contains("every"))(docValue, testValue)
    }
  )
  const containsAny = match(
    SearchFilterOperator.CONTAINS_ANY,
    _contains("some")
  )

  const docMatch = (doc: Record<string, any>) => {
    const filterFunctions = {
      string: stringMatch,
      fuzzy: fuzzyMatch,
      range: rangeMatch,
      equal: equalMatch,
      notEqual: notEqualMatch,
      empty: emptyMatch,
      notEmpty: notEmptyMatch,
      oneOf: oneOf,
      contains: contains,
      containsAny: containsAny,
      notContains: notContains,
    }

    const results = Object.entries(query || {})
      .filter(
        ([key, value]) =>
          !["allOr", "onEmptyFilter"].includes(key) &&
          value &&
          Object.keys(value).length > 0
      )
      .map(([key]) => {
        return filterFunctions[key as SearchFilterOperator]?.(doc) ?? false
      })

    if (query.allOr) {
      return results.some(result => result === true)
    } else {
      return results.every(result => result === true)
    }
  }
  return docs.filter(docMatch)
}

/**
 * Performs a client-side sort from the equivalent server-side lucene sort
 * parameters.
 * @param docs the data
 * @param sort the sort column
 * @param sortOrder the sort order ("ascending" or "descending")
 * @param sortType the type of sort ("string" or "number")
 */
export const sort = (
  docs: any[],
  sort: string,
  sortOrder: SortOrder,
  sortType = SortType.STRING
) => {
  if (!sort || !sortOrder || !sortType) {
    return docs
  }

  const parse = (x: any) => {
    if (x == null) {
      return x
    }
    if (sortType === "string") {
      return `${x}`
    }
    return parseFloat(x)
  }

  return docs
    .slice()
    .sort((a: { [x: string]: any }, b: { [x: string]: any }) => {
      const colA = parse(a[sort])
      const colB = parse(b[sort])

      const result = colB == null || colA > colB ? 1 : -1
      if (sortOrder.toLowerCase() === "descending") {
        return result * -1
      }

      return result
    })
}

/**
 * Limits the specified docs to the specified number of rows from the equivalent
 * server-side lucene limit parameters.
 * @param docs the data
 * @param limit the number of docs to limit to
 */
export const limit = (docs: any[], limit: string) => {
  const numLimit = parseFloat(limit)
  if (isNaN(numLimit)) {
    return docs
  }
  return docs.slice(0, numLimit)
}

export const hasFilters = (query?: SearchFilters) => {
  if (!query) {
    return false
  }
  const skipped = ["allOr", "onEmptyFilter"]
  for (let [key, value] of Object.entries(query)) {
    if (skipped.includes(key) || typeof value !== "object") {
      continue
    }
    if (Object.keys(value || {}).length !== 0) {
      return true
    }
  }
  return false
}
