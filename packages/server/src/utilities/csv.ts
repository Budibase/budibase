import csv from "csvtojson"

export async function jsonFromCsvString(csvString: string) {
  const castedWithEmptyStrings = await csv().fromString(csvString)
  if (!castedWithEmptyStrings.length) {
    return []
  }

  // By default the csvtojson library casts empty values as empty strings. This is causing issues on conversion.
  // ignoreEmpty will remove the key completly if empty, so creating this empty object will ensure we return the values with the keys but empty values
  const emptyObject = Object.keys(castedWithEmptyStrings[0]).reduce(
    (p, v) => ({ ...p, [v]: undefined }),
    {}
  )

  let result = await csv({ ignoreEmpty: true }).fromString(csvString)
  result = result.map(r => ({ ...emptyObject, ...r }))
  return result
}
