import { helpers } from "@budibase/shared-core"
export const deepGet = helpers.deepGet

/**
 * Generates a DOM safe UUID.
 * Starting with a letter is important to make it DOM safe.
 * @return {string} a random DOM safe UUID
 */
export function uuid() {
  return "cxxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Capitalises a string
 * @param string the string to capitalise
 * @return {string} the capitalised string
 */
export const capitalise = string => {
  if (!string) {
    return string
  }
  return string.substring(0, 1).toUpperCase() + string.substring(1)
}

/**
 * Computes a short hash of a string
 * @param string the string to compute a hash of
 * @return {string} the hash string
 */
export const hashString = string => {
  if (!string) {
    return "0"
  }
  let hash = 0
  for (let i = 0; i < string.length; i++) {
    let char = string.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString()
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

/**
 * Deeply clones an object. Functions are not supported.
 * @param obj the object to clone
 */
export const cloneDeep = obj => {
  if (!obj) {
    return obj
  }
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Copies a value to the clipboard
 * @param value the value to copy
 */
export const copyToClipboard = value => {
  return new Promise(res => {
    if (navigator.clipboard && window.isSecureContext) {
      // Try using the clipboard API first
      navigator.clipboard.writeText(value).then(res)
    } else {
      // Fall back to the textarea hack
      let textArea = document.createElement("textarea")
      textArea.value = value
      textArea.style.position = "fixed"
      textArea.style.left = "-9999px"
      textArea.style.top = "-9999px"
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand("copy")
      textArea.remove()
      res()
    }
  })
}
