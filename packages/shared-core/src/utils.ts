import {
  LegacyFilter,
  UISearchFilter,
  UILogicalOperator,
  SearchFilters,
  BasicOperator,
  ArrayOperator,
  isLogicalSearchOperator,
  SearchFilter,
  EmptyFilterOption,
} from "@budibase/types"
import * as Constants from "./constants"
import { removeKeyNumbering, splitFiltersArray } from "./filters"
import _ from "lodash"

const FILTER_ALLOWED_KEYS: (keyof SearchFilter)[] = [
  "field",
  "operator",
  "value",
  "type",
  "externalType",
  "valueType",
  "noValue",
  "formulaType",
]

export function unreachable(
  value: never,
  opts?: {
    message?: string
    doNotThrow?: boolean
  }
) {
  const message = opts?.message || `No such case in exhaustive switch: ${value}`
  const doNotThrow = !!opts?.doNotThrow
  if (!doNotThrow) {
    throw new Error(message)
  }
}

export async function parallelForeach<T>(
  items: Iterable<T> | AsyncIterable<T>,
  task: (item: T) => Promise<void>,
  maxConcurrency: number
): Promise<void> {
  const results: Promise<void>[] = []

  // Check if it's an async iterable
  const isAsyncIterable = Symbol.asyncIterator in items
  const iterator = isAsyncIterable
    ? (items as AsyncIterable<T>)[Symbol.asyncIterator]()
    : (items as Iterable<T>)[Symbol.iterator]()

  const executeNext = async (): Promise<void> => {
    let result = await (isAsyncIterable
      ? (iterator as AsyncIterator<T>).next()
      : Promise.resolve((iterator as Iterator<T>).next()))

    while (!result.done) {
      await task(result.value)
      result = await (isAsyncIterable
        ? (iterator as AsyncIterator<T>).next()
        : Promise.resolve((iterator as Iterator<T>).next()))
    }
  }

  for (let i = 0; i < maxConcurrency; i++) {
    results.push(executeNext())
  }

  // Wait for all workers to complete, this will throw if any task failed
  await Promise.all(results)
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

export function isSupportedUserSearch(
  query: SearchFilters
): query is SearchFilters {
  const allowed = [
    { op: BasicOperator.STRING, key: "email" },
    { op: BasicOperator.EQUAL, key: "_id" },
    { op: ArrayOperator.ONE_OF, key: "_id" },
  ]
  const { allOr, onEmptyFilter, ...filters } = query
  for (const [key, operation] of Object.entries(filters)) {
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

export function processSearchFilters(
  filterArray?: LegacyFilter[]
): Required<UISearchFilter> | undefined {
  if (!filterArray || filterArray.length === 0) {
    return undefined
  }
  const { allOr, onEmptyFilter, filters } = splitFiltersArray(filterArray)
  return {
    logicalOperator: UILogicalOperator.ALL,
    onEmptyFilter: onEmptyFilter || EmptyFilterOption.RETURN_ALL,
    groups: [
      {
        logicalOperator: allOr ? UILogicalOperator.ANY : UILogicalOperator.ALL,
        filters: filters.map(filter => {
          const trimmedFilter = _.pick(
            filter,
            FILTER_ALLOWED_KEYS
          ) as SearchFilter
          trimmedFilter.field = removeKeyNumbering(trimmedFilter.field)
          return trimmedFilter
        }),
      },
    ],
  }
}

export function toMap<TKey extends keyof TItem, TItem extends {}>(
  key: TKey,
  list: TItem[]
): Record<string, TItem> {
  return list.reduce<Record<string, TItem>>((result, item) => {
    result[item[key] as string] = item
    return result
  }, {})
}
