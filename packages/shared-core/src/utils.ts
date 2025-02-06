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

export function isSupportedUserSearch(
  query: SearchFilters
): query is SearchFilters {
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
