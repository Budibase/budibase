export type CheckMailOutput =
  | {
      proceed: false
      reason: string
      fields?: undefined
    }
  | {
      proceed: true
      fields: Record<string, string | undefined>
      reason?: undefined
    }
