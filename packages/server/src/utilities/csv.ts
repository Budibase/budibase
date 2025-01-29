import csv from "csvtojson"

export async function jsonFromCsvString(csvString: string) {
  const possibleDelimeters = [",", ";", ":", "|", "~", "\t", " "]

  for (let i = 0; i < possibleDelimeters.length; i++) {
    let numOfHeaders: number | undefined = undefined
    let headerMismatch = false

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
      const columns = Object.keys(r)
      if (numOfHeaders == null) {
        numOfHeaders = columns.length
      }
      if (numOfHeaders !== columns.length) {
        headerMismatch = true
        break
      }
      for (const [key] of Object.entries(r).filter(
        ([, value]) => value === ""
      )) {
        // if (castedWithEmptyValues[i][key] === undefined) {
        //   r[key] = null
        // }
      }
    }
    if (headerMismatch) {
      continue
    } else {
      return result
    }
  }
  throw new Error("Unable to determine delimiter")
}
