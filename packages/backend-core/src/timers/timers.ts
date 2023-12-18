let intervals: NodeJS.Timeout[] = []

export function set(callback: () => any, period: number) {
  const interval = setInterval(callback, period)
  intervals.push(interval)
  return interval
}

export function clear(interval: NodeJS.Timeout) {
  const idx = intervals.indexOf(interval)
  if (idx !== -1) {
    intervals.splice(idx, 1)
  }
  clearInterval(interval)
}

export function cleanup() {
  for (let interval of intervals) {
    clearInterval(interval)
  }
  intervals = []
}

export class ExecutionTimeTracker {
  static withLimit(limitMs: number) {
    return new ExecutionTimeTracker(limitMs)
  }

  constructor(private limitMs: number) {}

  private totalTimeMs = 0

  track<T>(f: () => T): T {
    const [startSeconds, startNanoseconds] = process.hrtime()
    const startMs = startSeconds * 1000 + startNanoseconds / 1e6
    try {
      return f()
    } finally {
      const [endSeconds, endNanoseconds] = process.hrtime()
      const endMs = endSeconds * 1000 + endNanoseconds / 1e6
      this.increment(endMs - startMs)
    }
  }

  private increment(byMs: number) {
    this.totalTimeMs += byMs

    if (this.totalTimeMs > this.limitMs) {
      throw new Error(
        `Execution time limit of ${this.limitMs}ms exceeded: ${this.totalTimeMs}ms`
      )
    }
  }
}
