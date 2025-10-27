export type CheckMailOutput =
  | {
      proceed: false
      reason: string
      messages?: undefined
    }
  | {
      proceed: true
      messages: Record<string, string | undefined>[]
      reason?: undefined
    }
