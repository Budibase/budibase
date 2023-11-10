import csv from "csvtojson"

export async function jsonFromCsvString(csvString: string) {
  const castedWithEmptyValues = await csv({ ignoreEmpty: true }).fromString(
    csvString
  )

  // By default the csvtojson library casts empty values as empty strings. This is causing issues on conversion.
  // ignoreEmpty will remove the key completly if empty, so creating this empty object will ensure we return the values with the keys but empty values
  const result = await csv({ ignoreEmpty: false }).fromString(csvString)
  result.forEach((r, i) => {
    for (const [key] of Object.entries(r).filter(
      ([key, value]) => value === ""
    )) {
      if (castedWithEmptyValues[i][key] === undefined) {
        r[key] = null
      }
    }
  })

  return result
}
