import csv from "csvtojson"

export async function jsonFromCsvString(csvString: string) {
  const possibleDelimeters = [",", ";", ":", "|", "~", "\t", " "]

  for (let i = 0; i < possibleDelimeters.length; i++) {
    let numOfHeaders: number | undefined = undefined
    let headerMismatch = false

    try {
      const castedWithEmptyValues = await csv({
        ignoreEmpty: true,
        delimiter: possibleDelimeters[i],
      }).fromString(csvString)

      // By default the csvtojson library casts empty values as empty strings. This
      // is causing issues on conversion.  ignoreEmpty will remove the key completly
      // if empty, so creating this empty object will ensure we return the values
      // with the keys but empty values
      const result = await csv({
        ignoreEmpty: false,
        delimiter: possibleDelimeters[i],
      }).fromString(csvString)
      for (const [i, r] of result.entries()) {
        // The purpose of this is to find rows that have been split
        // into the wrong number of columns - Any valid .CSV file will have
        // the same number of colums in each row
        // If the number of columms in each row is different to
        // the number of headers, this isn't the right delimiter
        const columns = Object.keys(r)
        if (numOfHeaders == null) {
          numOfHeaders = columns.length
        }
        if (numOfHeaders === 1 || numOfHeaders !== columns.length) {
          headerMismatch = true
          break
        }
        for (const [key] of Object.entries(r).filter(
          ([, value]) => value === ""
        )) {
          if (castedWithEmptyValues[i][key] === undefined) {
            r[key] = null
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
