export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type ISO8601 = string

export type RequiredKeys<T> = {
  [K in keyof Required<T>]: T[K]
}
