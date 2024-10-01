import { ArrayOperator, BasicOperator, SearchFilters } from "@budibase/types"
import * as Constants from "./constants"

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
  for (let [key, operation] of Object.entries(query)) {
    if (typeof operation !== "object") {
      return false
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
