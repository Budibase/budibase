enum TimeUnit {
  Millisecond = 1,
  Second = 1000,
  Minute = 60000,
  Hour = 3600000,
  Day = 86400000,
}

export function daysAgo(days: number) {
  return new Date(new Date().getTime() - TimeUnit.Day * days)
}
