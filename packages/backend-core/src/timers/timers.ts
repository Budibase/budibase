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
