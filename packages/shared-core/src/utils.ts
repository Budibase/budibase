import * as Constants from "./constants"

export function unreachable(
  value: never,
  message = `No such case in exhaustive switch: ${value}`
) {
  throw new Error(message)
}

interface PromiseWithId<T> {
  promise: Promise<T>
  id: number
}

export async function parallelForeach<T>(
  items: T[],
  task: (item: T) => Promise<void>,
  maxConcurrency: number
): Promise<void> {
  try {
    let next = 0
    let inProgress: PromiseWithId<number>[] = []
    while (next < items.length) {
      if (inProgress.length === maxConcurrency) {
        const finished = await Promise.race(inProgress.map(t => t.promise))
        inProgress = inProgress.filter(task => task.id !== finished)
      }

      const promise = async (next: number) => {
        await task(items[next])
        return next
      }

      inProgress.push({ promise: promise(next), id: next })
      next++
    }
    await Promise.all(inProgress.map(t => t.promise))
  } catch (e) {
    console.error(e)
    throw e
  }
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
