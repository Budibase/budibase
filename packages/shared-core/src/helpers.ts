/**
 * Gets a key within an object. The key supports dot syntax for retrieving deep
 * fields - e.g. "a.b.c".
 * Exact matches of keys with dots in them take precedence over nested keys of
 * the same path - e.g. getting "a.b" from { "a.b": "foo", a: { b: "bar" } }
 * will return "foo" over "bar".
 * @param obj the object
 * @param key the key
 * @return {*|null} the value or null if a value was not found for this key
 */
export const deepGet = (obj: { [x: string]: any }, key: string) => {
  if (!obj || !key) {
    return null
  }
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    return obj[key]
  }
  const split = key.split(".")
  for (let i = 0; i < split.length; i++) {
    obj = obj?.[split[i]]
  }
  return obj
}
