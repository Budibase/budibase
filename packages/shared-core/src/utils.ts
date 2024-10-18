import {
  LegacyFilter,
  UISearchFilter,
  UILogicalOperator,
  SearchFilters,
  BasicOperator,
  ArrayOperator,
  isLogicalSearchOperator,
  EmptyFilterOption,
  SearchFilterGroup,
} from "@budibase/types"
import * as Constants from "./constants"
import { removeKeyNumbering } from "./filters"

// an array of keys from filter type to properties that are in the type
// this can then be converted using .fromEntries to an object
type AllowedFilters = [keyof LegacyFilter, LegacyFilter[keyof LegacyFilter]][]

export function unreachable(
  value: never,
  message = `No such case in exhaustive switch: ${value}`
) {
  throw new Error(message)
}

export async function parallelForeach<T>(
  items: T[],
  task: (item: T) => Promise<void>,
  maxConcurrency: number
): Promise<void> {
  const promises: Promise<void>[] = []
  let index = 0

  const processItem = async (item: T) => {
    try {
      await task(item)
    } finally {
      processNext()
    }
  }

  const processNext = () => {
    if (index >= items.length) {
      // No more items to process
      return
    }

    const item = items[index]
    index++

    const promise = processItem(item)
    promises.push(promise)

    if (promises.length >= maxConcurrency) {
      Promise.race(promises).then(processNext)
    } else {
      processNext()
    }
  }
  processNext()

  await Promise.all(promises)
}

export function filterValueToLabel() {
  return Object.keys(Constants.OperatorOptions).reduce(
    (acc: { [key: string]: string }, key: string) => {
      const ops: { [key: string]: any } = Constants.OperatorOptions
      const op: { [key: string]: string } = ops[key]
      acc[op["value"]] = op.label
      return acc
    },
    {}
  )
}

export function hasSchema(test: any) {
  return (
    typeof test === "object" &&
    !Array.isArray(test) &&
    test !== null &&
    !(test instanceof Date) &&
    Object.keys(test).length > 0
  )
}

export function trimOtherProps(object: any, allowedProps: string[]) {
  const result = Object.keys(object)
    .filter(key => allowedProps.includes(key))
    .reduce<Record<string, any>>(
      (acc, key) => ({ ...acc, [key]: object[key] }),
      {}
    )
  return result
}

export function isSupportedUserSearch(query: SearchFilters) {
  const allowed = [
    { op: BasicOperator.STRING, key: "email" },
    { op: BasicOperator.EQUAL, key: "_id" },
    { op: ArrayOperator.ONE_OF, key: "_id" },
  ]
  for (const [key, operation] of Object.entries(query)) {
    if (typeof operation !== "object") {
      return false
    }

    if (isLogicalSearchOperator(key)) {
      for (const condition of query[key]!.conditions) {
        if (!isSupportedUserSearch(condition)) {
          return false
        }
      }
      return true
    }

    const fields = Object.keys(operation || {})
    // this filter doesn't contain options - ignore
    if (fields.length === 0) {
      continue
    }
    const allowedOperation = allowed.find(
      allow =>
        allow.op === key && fields.length === 1 && fields[0] === allow.key
    )
    if (!allowedOperation) {
      return false
    }
  }
  return true
}

/**
 * Processes the filter config. Filters are migrated from
 * SearchFilter[] to UISearchFilter
 *
 * If filters is not an array, the migration is skipped
 *
 * @param {LegacyFilter[] | UISearchFilter} filters
 */
export const processSearchFilters = (
  filters: LegacyFilter[]
): UISearchFilter => {
  // Base search config.
  const defaultCfg: UISearchFilter = {
    logicalOperator: UILogicalOperator.ALL,
    onEmptyFilter: EmptyFilterOption.RETURN_ALL,
    groups: [],
  }

  const filterAllowedKeys = [
    "field",
    "operator",
    "value",
    "type",
    "externalType",
    "valueType",
    "noValue",
    "formulaType",
  ]

  let baseGroup: SearchFilterGroup = {
    logicalOperator: UILogicalOperator.ALL,
  }

  return filters.reduce((acc: UISearchFilter, filter: LegacyFilter) => {
    // Sort the properties for easier debugging
    const filterPropertyKeys = (Object.keys(filter) as (keyof LegacyFilter)[])
      .sort((a, b) => {
        return a.localeCompare(b)
      })
      .filter(key => filter[key])

    if (filterPropertyKeys.length == 1) {
      const key = filterPropertyKeys[0],
        value = filter[key]
      // Global
      if (key === "onEmptyFilter") {
        // unset otherwise
        acc.onEmptyFilter = value
      } else if (key === "operator" && value === "allOr") {
        // Group 1 logical operator
        baseGroup.logicalOperator = UILogicalOperator.ANY
      }

      return acc
    }

    const allowedFilterSettings: AllowedFilters = filterPropertyKeys.reduce(
      (acc: AllowedFilters, key) => {
        const value = filter[key]
        if (filterAllowedKeys.includes(key)) {
          if (key === "field") {
            acc.push([key, removeKeyNumbering(value)])
          } else {
            acc.push([key, value])
          }
        }
        return acc
      },
      []
    )

    const migratedFilter: LegacyFilter = Object.fromEntries(
      allowedFilterSettings
    ) as LegacyFilter

    baseGroup.filters!.push(migratedFilter)

    if (!acc.groups || !acc.groups.length) {
      // init the base group
      acc.groups = [baseGroup]
    }

    return acc
  }, defaultCfg)
}
