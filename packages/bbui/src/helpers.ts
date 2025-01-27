import { helpers } from "@budibase/shared-core"
import dayjs from "dayjs"

export const deepGet = helpers.deepGet

/**
 * Generates a DOM safe UUID.
 * Starting with a letter is important to make it DOM safe.
 */
export function uuid(): string {
  return "cxxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Capitalises a string
 */
export const capitalise = (string?: string | null): string => {
  if (!string) {
    return ""
  }
  return string.substring(0, 1).toUpperCase() + string.substring(1)
}

/**
 * Computes a short hash of a string
 */
export const hashString = (string?: string | null): string => {
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
 */
export const deepSet = (
  obj: Record<string, any> | null,
  key: string | null,
  value: any
): void => {
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
 */
export const cloneDeep = <T>(obj: T): T => {
  if (!obj) {
    return obj
  }
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Copies a value to the clipboard
 */
export const copyToClipboard = (value: any): Promise<void> => {
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

// Parse a date value. This is usually an ISO string, but can be a
// bunch of different formats and shapes depending on schema flags.
export const parseDate = (
  value: string | dayjs.Dayjs | null,
  { enableTime = true }
): dayjs.Dayjs | null => {
  // If empty then invalid
  if (!value) {
    return null
  }

  // Certain string values need transformed
  if (typeof value === "string") {
    // Check for time only values
    if (!isNaN(new Date(`0-${value}`).valueOf())) {
      value = `0-${value}`
    }

    // If date only, check for cases where we received a UTC string
    else if (!enableTime && value.endsWith("Z")) {
      value = value.split("Z")[0]
    }
  }

  // Parse value and check for validity
  const parsedDate = dayjs(value)
  if (!parsedDate.isValid()) {
    return null
  }

  // By rounding to the nearest second we avoid locking up in an endless
  // loop in the builder, caused by potentially enriching {{ now }} to every
  // millisecond.
  return dayjs(Math.floor(parsedDate.valueOf() / 1000) * 1000)
}

// Stringifies a dayjs object to create an ISO string that respects the various
// schema flags
export const stringifyDate = (
  value: null | dayjs.Dayjs,
  { enableTime = true, timeOnly = false, ignoreTimezones = false } = {}
): string | null => {
  if (!value) {
    return null
  }

  // Time only fields always ignore timezones, otherwise they make no sense.
  // For non-timezone-aware fields, create an ISO 8601 timestamp of the exact
  // time picked, without timezone
  const offsetForTimezone = (enableTime && ignoreTimezones) || timeOnly
  if (offsetForTimezone) {
    // Ensure we use the correct offset for the date
    const referenceDate = value.toDate()
    const offset = referenceDate.getTimezoneOffset() * 60000
    const date = new Date(value.valueOf() - offset)
    if (timeOnly) {
      // Extract HH:mm
      return date.toISOString().slice(11, 16)
    }
    return date.toISOString().slice(0, -1)
  }

  // For date-only fields, construct a manual timestamp string without a time
  // or time zone
  else if (!enableTime) {
    const year = value.year()
    const month = `${value.month() + 1}`.padStart(2, "0")
    const day = `${value.date()}`.padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Otherwise use a normal ISO string with time and timezone
  else {
    return value.toISOString()
  }
}

// Determine the dayjs-compatible format of the browser's default locale
const getPatternForPart = (part: Intl.DateTimeFormatPart): string => {
  switch (part.type) {
    case "day":
      return "D".repeat(part.value.length)
    case "month":
      return "M".repeat(part.value.length)
    case "year":
      return "Y".repeat(part.value.length)
    case "literal":
      return part.value
    default:
      console.log("Unsupported date part", part)
      return ""
  }
}
const localeDateFormat = new Intl.DateTimeFormat()
  .formatToParts(new Date("2021-01-01"))
  .map(getPatternForPart)
  .join("")

// Formats a dayjs date according to schema flags
export const getDateDisplayValue = (
  value: dayjs.Dayjs | null,
  { enableTime = true, timeOnly = false } = {}
): string => {
  if (!value?.isValid()) {
    return ""
  }
  if (timeOnly) {
    return value.format("HH:mm")
  } else if (!enableTime) {
    return value.format(localeDateFormat)
  } else {
    return value.format(`${localeDateFormat} HH:mm`)
  }
}

export const hexToRGBA = (color: string, opacity: number): string => {
  if (color.includes("#")) {
    color = color.replace("#", "")
  }
  const r = parseInt(color.substring(0, 2), 16)
  const g = parseInt(color.substring(2, 4), 16)
  const b = parseInt(color.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}
