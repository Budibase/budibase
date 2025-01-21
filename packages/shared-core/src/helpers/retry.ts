import { wait } from "./async"

interface RetryOpts {
  times?: number
}

export async function retry<T>(
  fn: () => Promise<T>,
  opts?: RetryOpts
): Promise<T> {
  const { times = 3 } = opts || {}
  if (times < 1) {
    throw new Error(`invalid retry count: ${times}`)
  }

  let lastError: any
  for (let i = 0; i < times; i++) {
    const backoff = 1.5 ** i * 1000 * (Math.random() + 0.5)
    await wait(backoff)

    try {
      return await fn()
    } catch (e) {
      lastError = e
    }
  }
  throw lastError
}
