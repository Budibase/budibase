import * as csvUtils from "csv/sync"

export function jsonFromCsvString<T = any>(csvString: string) {
  const result = csvUtils.parse(csvString, {
    columns: true,
    cast: value => {
      if (value === "true") {
        return true
      }
      if (value === "false") {
        return false
      }

      try {
        const casted = JSON.parse(value)
        return casted
      } catch {
        return value
      }
    },
  })
  return result as T
}

function getHeaders(
  headers: string[],
  customHeaders: { [key: string]: string }
) {
  return headers.map(header => customHeaders[header] || header)
}

export function csv(
  headers: string[],
  data: object[],
  delimiter: string = ",",
  customHeaders: { [key: string]: string } = {}
) {
  const result = csvUtils.stringify(data, {
    delimiter,
    header: true,
    columns: getHeaders(headers, customHeaders),
    cast: {
      boolean: function (value) {
        if (value === true) {
          return "true"
        }
        if (value === false) {
          return "false"
        }
        return ""
      },
    },
  })
  return result
}
