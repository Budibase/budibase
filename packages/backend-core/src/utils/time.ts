import { Duration } from "./Duration"

export async function time<T>(f: () => Promise<T>): Promise<[T, Duration]> {
  const start = performance.now()
  const result = await f()
  return [result, Duration.fromMilliseconds(performance.now() - start)]
}
