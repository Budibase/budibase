const QUERY_START_REGEX = /\d[0-9]*:/g

export function removeKeyNumbering(key: any): string {
  if (typeof key === "string" && key.match(QUERY_START_REGEX) != null) {
    const parts = key.split(":")
    // remove the number
    parts.shift()
    return parts.join(":")
  } else {
    return key
  }
}
