export const generateID = () => {
  const rand = Math.random().toString(32).substring(2)

  // Starts with a letter so that its a valid DOM ID
  return `A${rand}`
}

export const capitalise = s => s.substring(0, 1).toUpperCase() + s.substring(1)

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
export const deepGet = (obj, key) => {
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

/**
 * Sets a key within an object. The key supports dot syntax for retrieving deep
 * fields - e.g. "a.b.c".
 * Exact matches of keys with dots in them take precedence over nested keys of
 * the same path - e.g. setting "a.b" of { "a.b": "foo", a: { b: "bar" } }
 * will override the value "foo" rather than "bar".
 * If a deep path is specified and the parent keys don't exist then these will
 * be created.
 * @param obj the object
 * @param key the key
 * @param value the value
 */
export const deepSet = (obj, key, value) => {
  if (!obj || !key) {
    return
  }
  if (Object.prototype.hasOwnProperty.call(obj, key)) {
    obj[key] = value
    return
  }
  const split = key.split(".")
  for (let i = 0; i < split.length - 1; i++) {
    const nextKey = split[i]
    if (obj && obj[nextKey] == null) {
      obj[nextKey] = {}
    }
    obj = obj?.[nextKey]
  }
  if (!obj) {
    return
  }
  obj[split[split.length - 1]] = value
}
