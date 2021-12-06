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
 */
export const deepGet = (obj, key) => {
  if (!obj || !key) {
    return null
  }
  if (obj[key] != null) {
    return obj[key]
  }
  const split = key.split(".")
  let value = obj
  for (let i = 0; i < split.length; i++) {
    value = value?.[split[i]]
  }
  return value
}
