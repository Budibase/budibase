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
