/**
 * Utility to wrap an async function and ensure all invocations happen
 * sequentially.
 * @param fn the async function to run
 * @return {Promise} a sequential version of the function
 */
export const sequential = fn => {
  let queue = []
  return async (...params) => {
    queue.push(async () => {
      await fn(...params)
      queue.shift()
      if (queue.length) {
        await queue[0]()
      }
    })
    if (queue.length === 1) {
      await queue[0]()
    }
  }
}
