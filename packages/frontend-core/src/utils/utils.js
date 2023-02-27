/**
 * Utility to wrap an async function and ensure all invocations happen
 * sequentially.
 * @param fn the async function to run
 * @return {Promise} a sequential version of the function
 */
export const sequential = fn => {
  let queue = []
  return (...params) => {
    return new Promise((resolve, reject) => {
      queue.push(async () => {
        let data, error
        try {
          data = await fn(...params)
        } catch (err) {
          error = err
        }
        queue.shift()
        if (queue.length) {
          queue[0]()
        }
        if (error) {
          reject(error)
        } else {
          resolve(data)
        }
      })
      if (queue.length === 1) {
        queue[0]()
      }
    })
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

/**
 * Utility to throttle invocations of a synchronous function. This is better
 * than a simple debounce invocation for a number of reasons. Features include:
 * - First invocation is immediate (no initial delay)
 * - Every invocation has the latest params (no stale params)
 * - There will always be a final invocation with the last params (no missing
 *   final update)
 * @param callback
 * @param minDelay
 * @returns {Function} a throttled version function
 */
export const throttle = (callback, minDelay = 1000) => {
  let lastParams
  let stalled = false
  let pending = false
  const invoke = (...params) => {
    lastParams = params
    if (stalled) {
      pending = true
      return
    }
    callback(...lastParams)
    stalled = true
    setTimeout(() => {
      stalled = false
      if (pending) {
        pending = false
        invoke(...lastParams)
      }
    }, minDelay)
  }
  return invoke
}

/**
 * Utility to debounce DOM activities using requestAnimationFrame
 * @param callback the function to run
 * @returns {Function}
 */
export const domDebounce = callback => {
  let active = false
  let lastParams
  return (...params) => {
    lastParams = params
    if (!active) {
      active = true
      requestAnimationFrame(() => {
        callback(...lastParams)
        active = false
      })
    }
  }
}
