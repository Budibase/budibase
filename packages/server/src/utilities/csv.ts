import csv from "csvtojson"

export async function jsonFromCsvString(csvString: string) {
  const result = await csv().fromString(csvString)
  return result
}
