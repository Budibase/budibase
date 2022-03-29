/**
 * Utility to wrap an async function and ensure all invocations happen
 * sequentially.
 * @param fn the async function to run
 * @return {Promise} a sequential version of the function
 */
export const sequential = fn => {
  let promise
  return async (...params) => {
    if (promise) {
      await promise
    }
    promise = fn(...params)
    await promise
    promise = null
  }
}
