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

/**
 * Utility to debounce an async function and ensure a minimum delay between
 * invocations is enforced.
 * @param callback an async function to run
 * @param minDelay the minimum delay between invocations
 * @returns {Promise} a debounced version of the callback
 */
export const debounce = (callback, minDelay = 1000) => {
  let timeout
  return async (...params) => {
    return new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(async () => {
        resolve(await callback(...params))
      }, minDelay)
    })
  }
}
