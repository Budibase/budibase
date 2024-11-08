export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type ISO8601 = string

/**
 * RequiredKeys make it such that you _must_ assign a value to every key in the
 * type. It differs subtly from Required<T> in that it doesn't change the type
 * of the fields, you can specify undefined as a value and that's fine.
 *
 * Example:
 *
 * ```ts
 * interface Foo {
 *   bar: string
 *   baz?: string
 * }
 *
 * type FooRequiredKeys = RequiredKeys<Foo>
 * type FooRequired = Required<Foo>
 *
 * const a: FooRequiredKeys = { bar: "hello", baz: undefined }
 * const b: FooRequired = { bar: "hello", baz: undefined }
 * ```
 *
 * In this code, a passes type checking whereas b does not. This is because
 * Required<Foo> makes baz non-optional.
 */
export type RequiredKeys<T> = {
  [K in keyof Required<T>]: T[K]
}

export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>
