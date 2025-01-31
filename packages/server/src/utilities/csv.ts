import csv from "csvtojson"

export async function jsonFromCsvString(csvString: string) {
  const possibleDelimiters = [",", ";", ":", "|", "~", "\t", " "]

  for (let i = 0; i < possibleDelimiters.length; i++) {
    let headers: string[] | undefined = undefined
    let headerMismatch = false

    try {
      // By default the csvtojson library casts empty values as empty strings. This
      // is causing issues on conversion.  ignoreEmpty will remove the key completly
      // if empty, so creating this empty object will ensure we return the values
      // with the keys but empty values
      const result = await csv({
        ignoreEmpty: false,
        delimiter: possibleDelimiters[i],
      }).fromString(csvString)
      for (const [, row] of result.entries()) {
        // The purpose of this is to find rows that have been split
        // into the wrong number of columns - Any valid .CSV file will have
        // the same number of colums in each row
        // If the number of columms in each row is different to
        // the number of headers, this isn't the right delimiter
        const columns = Object.keys(row)
        if (headers == null) {
          headers = columns
        }
        if (headers.length === 1 || headers.length !== columns.length) {
          headerMismatch = true
          break
        }

        for (const header of headers) {
          if (row[header] === undefined || row[header] === "") {
            row[header] = null
          }
        }
      }
      if (headerMismatch) {
        continue
      } else {
        return result
      }
    } catch (err) {
      // Splitting on the wrong delimiter sometimes throws CSV parsing error
      // (eg unterminated strings), which tells us we've picked the wrong delimiter
      continue
    }
  }
  throw new Error("Unable to determine delimiter")
}
