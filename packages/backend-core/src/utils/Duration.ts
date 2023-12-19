export enum DurationType {
  MILLISECONDS = "milliseconds",
  SECONDS = "seconds",
  MINUTES = "minutes",
  HOURS = "hours",
  DAYS = "days",
}

const conversion: Record<DurationType, number> = {
  milliseconds: 1,
  seconds: 1000,
  minutes: 60 * 1000,
  hours: 60 * 60 * 1000,
  days: 24 * 60 * 60 * 1000,
}

export class Duration {
  static convert(from: DurationType, to: DurationType, duration: number) {
    const milliseconds = duration * conversion[from]
    return milliseconds / conversion[to]
  }

  static from(from: DurationType, duration: number) {
    return {
      to: (to: DurationType) => {
        return Duration.convert(from, to, duration)
      },
      toMs: () => {
        return Duration.convert(from, DurationType.MILLISECONDS, duration)
      },
      toSeconds: () => {
        return Duration.convert(from, DurationType.SECONDS, duration)
      },
    }
  }

  static fromSeconds(duration: number) {
    return Duration.from(DurationType.SECONDS, duration)
  }

  static fromMinutes(duration: number) {
    return Duration.from(DurationType.MINUTES, duration)
  }

  static fromHours(duration: number) {
    return Duration.from(DurationType.HOURS, duration)
  }

  static fromDays(duration: number) {
    return Duration.from(DurationType.DAYS, duration)
  }

  static fromMilliseconds(duration: number) {
    return Duration.from(DurationType.MILLISECONDS, duration)
  }
}
