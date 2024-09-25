import {
  Datasource,
  BBReferenceFieldSubType,
  FieldType,
  FormulaType,
  SearchFilter,
  SearchFilters,
  SearchQueryFields,
  ArrayOperator,
  SearchFilterOperator,
  SortType,
  FieldConstraints,
  SortOrder,
  RowSearchParams,
  EmptyFilterOption,
  SearchResponse,
  Table,
  BasicOperator,
  RangeOperator,
  LogicalOperator,
  isLogicalSearchOperator,
} from "@budibase/types"
import dayjs from "dayjs"
import { OperatorOptions, SqlNumberTypeRangeMap } from "./constants"
import { deepGet, schema } from "./helpers"
import { isPlainObject, isEmpty } from "lodash"
import { decodeNonAscii } from "./helpers/schema"

const HBS_REGEX = /{{([^{].*?)}}/g
const LOGICAL_OPERATORS = Object.values(LogicalOperator)
const SEARCH_OPERATORS = [
  ...Object.values(BasicOperator),
  ...Object.values(ArrayOperator),
  ...Object.values(RangeOperator),
]

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
  OperatorOptions.ContainsAny.value,
  OperatorOptions.In.value,
] as (keyof SearchQueryFields)[]

export function recurseLogicalOperators(
  filters: SearchFilters,
  fn: (f: SearchFilters) => SearchFilters
) {
  for (const logical of LOGICAL_OPERATORS) {
    if (filters[logical]) {
      filters[logical]!.conditions = filters[logical]!.conditions.map(
        condition => fn(condition)
      )
    }
  }
  return filters
}

export function recurseSearchFilters(
  filters: SearchFilters,
  processFn: (filter: SearchFilters) => SearchFilters
): SearchFilters {
  // Process the current level
  filters = processFn(filters)

  // Recurse through logical operators
  for (const logical of LOGICAL_OPERATORS) {
    if (filters[logical]) {
      filters[logical]!.conditions = filters[logical]!.conditions.map(
        condition => recurseSearchFilters(condition, processFn)
      )
    }
  }

  return filters
}

/**
 * Removes any fields that contain empty strings that would cause inconsistent
 * behaviour with how backend tables are filtered (no value means no filter).
 *
 * don't do a pure falsy check, as 0 is included
 * https://github.com/Budibase/budibase/issues/10118
 */
export const cleanupQuery = (query: SearchFilters) => {
  if (!query) {
    return query
  }
  for (let filterField of NoEmptyFilterStrings) {
    if (!query[filterField]) {
      continue
    }

    for (let filterType of Object.keys(query)) {
      if (filterType !== filterField) {
        continue
      }
      // don't know which one we're checking, type could be anything
      const value = query[filterType] as unknown
      if (typeof value === "object") {
        for (let [key, value] of Object.entries(query[filterType] as object)) {
          if (value == null || value === "" || isEmptyArray(value)) {
            // @ts-ignore
            delete query[filterField][key]
          }
        }
      }
    }
  }
  query = recurseLogicalOperators(query, cleanupQuery)
  return query
}

function isEmptyArray(value: any) {
  return Array.isArray(value) && value.length === 0
}

/**
 * Removes a numeric prefix on field names designed to give fields uniqueness
 */
export const removeKeyNumbering = (key: string): string => {
  return getKeyNumbering(key).key
}

/**
 * Gets the part of the keys, returning the numeric prefix and the field name
 */
export const getKeyNumbering = (
  key: string
): { prefix?: string; key: string } => {
  if (typeof key === "string" && key.match(/\d[0-9]*:/g) != null) {
    const parts = key.split(":")
    // remove the number
    const number = parts.shift()
    return { prefix: `${number}:`, key: parts.join(":") }
  } else {
    return { key }
  }
}

/**
 * Generates a splitter which can be used to split columns from a context into
 * their components (number prefix, relationship column/table, column name)
 */
export class ColumnSplitter {
  tableNames: string[]
  tableIds: string[]
  relationshipColumnNames: string[]
  relationships: string[]
  aliases?: Record<string, string>
  columnPrefix?: string

  constructor(
    tables: Table[],
    opts?: {
      aliases?: Record<string, string>
      columnPrefix?: string
    }
  ) {
    this.tableNames = tables.map(table => table.name)
    this.tableIds = tables.map(table => table._id!)
    this.relationshipColumnNames = tables.flatMap(table =>
      Object.keys(table.schema).filter(
        columnName => table.schema[columnName].type === FieldType.LINK
      )
    )
    this.relationships = this.tableNames
      .concat(this.tableIds)
      .concat(this.relationshipColumnNames)
      // sort by length - makes sure there's no mis-matches due to similarities (sub column names)
      .sort((a, b) => b.length - a.length)

    if (opts?.aliases) {
      this.aliases = {}
      for (const [key, value] of Object.entries(opts.aliases)) {
        this.aliases[value] = key
      }
    }

    this.columnPrefix = opts?.columnPrefix
  }

  run(key: string): {
    numberPrefix?: string
    relationshipPrefix?: string
    tableName?: string
    column: string
  } {
    let { prefix, key: splitKey } = getKeyNumbering(key)

    let tableName: string | undefined = undefined
    if (this.aliases) {
      for (const possibleAlias of Object.keys(this.aliases || {})) {
        const withDot = `${possibleAlias}.`
        if (splitKey.startsWith(withDot)) {
          tableName = this.aliases[possibleAlias]!
          splitKey = splitKey.slice(withDot.length)
        }
      }
    }

    let relationship: string | undefined
    for (const possibleRelationship of this.relationships) {
      const withDot = `${possibleRelationship}.`
      if (splitKey.startsWith(withDot)) {
        const finalKeyParts = splitKey.split(withDot)
        finalKeyParts.shift()
        relationship = withDot
        splitKey = finalKeyParts.join(".")
        break
      }
    }

    if (this.columnPrefix) {
      if (splitKey.startsWith(this.columnPrefix)) {
        splitKey = decodeNonAscii(splitKey.slice(this.columnPrefix.length))
      }
    }

    return {
      tableName,
      numberPrefix: prefix,
      relationshipPrefix: relationship,
      column: splitKey,
    }
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
    } else if (isLogicalSearchOperator(queryOperator)) {
      // TODO
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
          query[queryOperator] ??= {}
          query[queryOperator]![field] = value
        }
      } else {
        query[queryOperator] ??= {}
        query[queryOperator]![field] = value
      }
    }
  })

  return query
}

// The frontend can send single values for array fields sometimes, so to handle
// this we convert them to arrays at the controller level so that nothing below
// this has to worry about the non-array values.
export function fixupFilterArrays(filters: SearchFilters) {
  for (const searchField of Object.values(ArrayOperator)) {
    const field = filters[searchField]
    if (field == null || !isPlainObject(field)) {
      continue
    }

    for (const key of Object.keys(field)) {
      if (Array.isArray(field[key])) {
        continue
      }

      const value = field[key] as any
      if (typeof value === "string") {
        field[key] = value.split(",").map((x: string) => x.trim())
      } else {
        field[key] = [value]
      }
    }
  }
  recurseLogicalOperators(filters, fixupFilterArrays)
  return filters
}

export function search<T>(
  docs: Record<string, T>[],
  query: RowSearchParams
): SearchResponse<Record<string, T>> {
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
export function runQuery<T extends Record<string, any>>(
  docs: T[],
  query: SearchFilters
): T[] {
  if (!docs || !Array.isArray(docs)) {
    return []
  }
  if (!query) {
    return docs
  }

  query = cleanupQuery(query)
  query = fixupFilterArrays(query)

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
    (doc: T) => {
      for (const [key, testValue] of Object.entries(query[type] || {})) {
        const valueToCheck = isLogicalSearchOperator(type)
          ? doc
          : deepGet(doc, removeKeyNumbering(key))
        const result = test(valueToCheck, testValue)
        if (query.allOr && result) {
          return true
        } else if (!query.allOr && !result) {
          return false
        }
      }
      return !query.allOr
    }

  const stringMatch = match(
    BasicOperator.STRING,
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
    BasicOperator.FUZZY,
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
    RangeOperator.RANGE,
    (docValue: any, testValue: any) => {
      if (docValue == null || docValue === "") {
        return false
      }

      if (isPlainObject(testValue.low) && isEmpty(testValue.low)) {
        testValue.low = undefined
      }

      if (isPlainObject(testValue.high) && isEmpty(testValue.high)) {
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

  const equalMatch = match(BasicOperator.EQUAL, _valueMatches)
  const notEqualMatch = match(BasicOperator.NOT_EQUAL, not(_valueMatches))

  const _empty = (docValue: any) => {
    if (typeof docValue === "string") {
      return docValue === ""
    }
    if (Array.isArray(docValue)) {
      return docValue.length === 0
    }
    if (docValue && typeof docValue === "object") {
      return Object.keys(docValue).length === 0
    }
    return docValue == null
  }

  const emptyMatch = match(BasicOperator.EMPTY, _empty)
  const notEmptyMatch = match(BasicOperator.NOT_EMPTY, not(_empty))

  const oneOf = match(ArrayOperator.ONE_OF, (docValue: any, testValue: any) => {
    if (typeof testValue === "string") {
      testValue = testValue.split(",")
    }

    if (typeof docValue === "number") {
      testValue = testValue.map((item: string) => parseFloat(item))
    }

    if (!Array.isArray(testValue)) {
      return false
    }

    return testValue.some(item => _valueMatches(docValue, item))
  })

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
    ArrayOperator.CONTAINS,
    (docValue: any, testValue: any) => {
      if (Array.isArray(testValue) && testValue.length === 0) {
        return true
      }
      return _contains("every")(docValue, testValue)
    }
  )
  const notContains = match(
    ArrayOperator.NOT_CONTAINS,
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
  const containsAny = match(ArrayOperator.CONTAINS_ANY, _contains("some"))

  const and = match(
    LogicalOperator.AND,
    (docValue: Record<string, any>, conditions: SearchFilters[]) => {
      if (!conditions.length) {
        return false
      }
      for (const condition of conditions) {
        const matchesCondition = runQuery([docValue], condition)
        if (!matchesCondition.length) {
          return false
        }
      }
      return true
    }
  )
  const or = match(
    LogicalOperator.OR,
    (docValue: Record<string, any>, conditions: SearchFilters[]) => {
      if (!conditions.length) {
        return false
      }
      for (const condition of conditions) {
        const matchesCondition = runQuery([docValue], {
          ...condition,
          allOr: true,
        })
        if (matchesCondition.length) {
          return true
        }
      }
      return false
    }
  )

  const docMatch = (doc: T) => {
    const filterFunctions: Record<SearchFilterOperator, (doc: T) => boolean> = {
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
      [LogicalOperator.AND]: and,
      [LogicalOperator.OR]: or,
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

    // there are no filters - logical operators can cover this up
    if (!hasFilters(query)) {
      return true
    } else if (query.allOr) {
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
export function sort<T extends Record<string, any>>(
  docs: T[],
  sort: keyof T,
  sortOrder: SortOrder,
  sortType = SortType.STRING
): T[] {
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

  return docs.slice().sort((a, b) => {
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
export function limit<T>(docs: T[], limit: string): T[] {
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
  const check = (filters: SearchFilters): boolean => {
    for (const logical of LOGICAL_OPERATORS) {
      if (filters[logical]) {
        for (const condition of filters[logical]?.conditions || []) {
          const result = check(condition)
          if (result) {
            return result
          }
        }
      }
    }
    for (const search of SEARCH_OPERATORS) {
      const searchValue = filters[search]
      if (!searchValue || typeof searchValue !== "object") {
        continue
      }
      const filtered = Object.entries(searchValue).filter(entry => {
        const valueDefined =
          entry[1] !== undefined || entry[1] !== null || entry[1] !== ""
        // not empty is an edge case, null is allowed for it - this is covered by test cases
        return search === BasicOperator.NOT_EMPTY || valueDefined
      })
      if (filtered.length !== 0) {
        return true
      }
    }
    return false
  }
  return check(query)
}
