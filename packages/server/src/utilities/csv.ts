import * as csvUtils from "csv/sync"

export async function jsonFromCsvString(csvString: string) {
  const result = csvUtils.parse(csvString, {
    columns: true,
    cast: value => {
      if (value === "true") {
        return true
      }
      if (value === "false") {
        return false
      }

      return value
    },
  })
  return result
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
