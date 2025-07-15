export type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONObject
  | JSONArray

export interface JSONObject {
  [key: string]: JSONValue
}

export interface JSONArray extends Array<JSONValue> {}

export interface UpgradeContext {
  set(key: string, value: JSONValue): void
  get<T extends JSONValue = JSONValue>(key: string): T
  clear(): void
}
