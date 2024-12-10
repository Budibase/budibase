export async function retry<T extends (...arg0: any[]) => any>(
  fn: T,
  maxTry = 5,
  retryCount = 1
): Promise<Awaited<ReturnType<T>>> {
  const currRetry = typeof retryCount === "number" ? retryCount : 1
  try {
    const result = await fn()
    return result
  } catch (e) {
    console.log(`Retry ${currRetry} failed.`)
    if (currRetry > maxTry) {
      console.log(`All ${maxTry} retry attempts exhausted`)
      throw e
    }
    return retry(fn, maxTry, currRetry + 1)
  }
}
