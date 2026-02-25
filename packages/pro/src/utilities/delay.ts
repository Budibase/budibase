import { logging } from "@budibase/backend-core"

export function randomDelay(fn: any) {
  return new Promise((resolve, reject) => {
    setTimeout(
      async () => {
        try {
          resolve(await fn())
        } catch (err) {
          reject(err)
        }
      },
      Math.floor(Math.random() * 1000)
    )
  })
}

export async function backOff(fn: any, errMsg: string) {
  let error: any
  let attempts = 5,
    success = false,
    response,
    first = true
  for (; attempts > 0; attempts--) {
    try {
      if (first) {
        response = await fn()
      } else {
        response = await exports.randomDelay(fn)
      }
      success = true
      break
    } catch (err) {
      error = err
      // ignore error here
    }
  }
  if (!success) {
    logging.logWarn(`Failed to backoff: ${errMsg}`, error)
  }
  return response
}
