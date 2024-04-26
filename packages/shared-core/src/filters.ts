import {
  Datasource,
  BBReferenceFieldSubType,
  FieldType,
  FormulaType,
  SearchFilter,
  SearchFilters,
  SearchQueryFields,
  SearchFilterOperator,
  SortDirection,
  SortType,
} from "@budibase/types"
import dayjs from "dayjs"
import { OperatorOptions, SqlNumberTypeRangeMap } from "./constants"
import { deepGet } from "./helpers"

const HBS_REGEX = /{{([^{].*?)}}/g

/**
 * Returns the valid operator options for a certain data type
 */
export const getValidOperatorsForType = (
  fieldType: {
    type: FieldType
    subtype?: BBReferenceFieldSubType
    formulaType?: FormulaType
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
  const { type, subtype, formulaType } = fieldType
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
    (type === FieldType.BB_REFERENCE_SINGLE ||
      type === FieldType.BB_REFERENCE) &&
    subtype == BBReferenceFieldSubType.USER
  ) {
    ops = [Op.Equals, Op.NotEquals, Op.Empty, Op.NotEmpty, Op.In]
  } else if (
    type === FieldType.BB_REFERENCE &&
    subtype == BBReferenceFieldSubType.USERS
  ) {
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
 * Builds a lucene JSON query from the filter structure generated in the builder
 * @param filter the builder filter structure
 */
export const buildLuceneQuery = (filter: SearchFilter[]) => {
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
          query[queryOperator] = query[queryOperator] || {}
          query[queryOperator]![field] = value
        }
      } else {
        query[queryOperator] = query[queryOperator] || {}
        query[queryOperator]![field] = value
      }
    }
  })

  return query
}

/**
 * Performs a client-side lucene search on an array of data
 * @param docs the data
 * @param query the JSON lucene query
 */
export const runLuceneQuery = (docs: any[], query?: SearchFilters) => {
  if (!docs || !Array.isArray(docs)) {
    return []
  }
  if (!query) {
    return docs
  }

  // Make query consistent first
  query = cleanupQuery(query)

  // Iterates over a set of filters and evaluates a fail function against a doc
  const match =
    (
      type: SearchFilterOperator,
      failFn: (docValue: any, testValue: any) => boolean
    ) =>
    (doc: any) => {
      const filters = Object.entries(query![type] || {})
      for (let i = 0; i < filters.length; i++) {
        const [key, testValue] = filters[i]
        const docValue = deepGet(doc, removeKeyNumbering(key))
        if (failFn(docValue, testValue)) {
          return false
        }
      }
      return true
    }

  // Process a string match (fails if the value does not start with the string)
  const stringMatch = match(
    SearchFilterOperator.STRING,
    (docValue: string, testValue: string) => {
      return (
        !docValue ||
        !docValue?.toLowerCase().startsWith(testValue?.toLowerCase())
      )
    }
  )

  // Process a fuzzy match (treat the same as starts with when running locally)
  const fuzzyMatch = match(
    SearchFilterOperator.FUZZY,
    (docValue: string, testValue: string) => {
      return (
        !docValue ||
        !docValue?.toLowerCase().startsWith(testValue?.toLowerCase())
      )
    }
  )

  // Process a range match
  const rangeMatch = match(
    SearchFilterOperator.RANGE,
    (
      docValue: string | number | null,
      testValue: { low: number; high: number }
    ) => {
      if (docValue == null || docValue === "") {
        return true
      }
      if (!isNaN(+docValue)) {
        return +docValue < testValue.low || +docValue > testValue.high
      }
      if (dayjs(docValue).isValid()) {
        return (
          new Date(docValue).getTime() < new Date(testValue.low).getTime() ||
          new Date(docValue).getTime() > new Date(testValue.high).getTime()
        )
      }
      return false
    }
  )

  // Process an equal match (fails if the value is different)
  const equalMatch = match(
    SearchFilterOperator.EQUAL,
    (docValue: any, testValue: string | null) => {
      return testValue != null && testValue !== "" && docValue !== testValue
    }
  )

  // Process a not-equal match (fails if the value is the same)
  const notEqualMatch = match(
    SearchFilterOperator.NOT_EQUAL,
    (docValue: any, testValue: string | null) => {
      return testValue != null && testValue !== "" && docValue === testValue
    }
  )

  // Process an empty match (fails if the value is not empty)
  const emptyMatch = match(
    SearchFilterOperator.EMPTY,
    (docValue: string | null) => {
      return docValue != null && docValue !== ""
    }
  )

  // Process a not-empty match (fails is the value is empty)
  const notEmptyMatch = match(
    SearchFilterOperator.NOT_EMPTY,
    (docValue: string | null) => {
      return docValue == null || docValue === ""
    }
  )

  // Process an includes match (fails if the value is not included)
  const oneOf = match(
    SearchFilterOperator.ONE_OF,
    (docValue: any, testValue: any) => {
      if (typeof testValue === "string") {
        testValue = testValue.split(",")
        if (typeof docValue === "number") {
          testValue = testValue.map((item: string) => parseFloat(item))
        }
      }
      return !testValue?.includes(docValue)
    }
  )

  const containsAny = match(
    SearchFilterOperator.CONTAINS_ANY,
    (docValue: any, testValue: any) => {
      return !docValue?.includes(...testValue)
    }
  )

  const contains = match(
    SearchFilterOperator.CONTAINS,
    (docValue: string | any[], testValue: any[]) => {
      return !testValue?.every((item: any) => docValue?.includes(item))
    }
  )

  const notContains = match(
    SearchFilterOperator.NOT_CONTAINS,
    (docValue: string | any[], testValue: any[]) => {
      return testValue?.every((item: any) => docValue?.includes(item))
    }
  )

  const docMatch = (doc: any) => {
    const filterFunctions: Record<SearchFilterOperator, (doc: any) => boolean> =
      {
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

    const activeFilterKeys: SearchFilterOperator[] = Object.entries(query || {})
      .filter(
        ([key, value]: [string, any]) =>
          !["allOr", "onEmptyFilter"].includes(key) &&
          value &&
          Object.keys(value as Record<string, any>).length > 0
      )
      .map(([key]) => key as any)

    const results: boolean[] = activeFilterKeys.map(filterKey => {
      return filterFunctions[filterKey]?.(doc) ?? false
    })

    if (query!.allOr) {
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
export const luceneSort = (
  docs: any[],
  sort: string,
  sortOrder: SortDirection,
  sortType = SortType.STRING
) => {
  if (!sort || !sortOrder || !sortType) {
    return docs
  }
  const parse =
    sortType === "string" ? (x: any) => `${x}` : (x: string) => parseFloat(x)
  return docs
    .slice()
    .sort((a: { [x: string]: any }, b: { [x: string]: any }) => {
      const colA = parse(a[sort])
      const colB = parse(b[sort])
      if (sortOrder.toLowerCase() === "descending") {
        return colA > colB ? -1 : 1
      } else {
        return colA > colB ? 1 : -1
      }
    })
}

/**
 * Limits the specified docs to the specified number of rows from the equivalent
 * server-side lucene limit parameters.
 * @param docs the data
 * @param limit the number of docs to limit to
 */
export const luceneLimit = (docs: any[], limit: string) => {
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
