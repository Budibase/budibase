exports.csv = function (headers, rows) {
  let csv = headers.map(key => `"${key}"`).join(",")

  for (let row of rows) {
    csv = `${csv}\n${headers
      .map(header => {
        let val = row[header]
        val =
          typeof val === "object" && !(val instanceof Date)
            ? `"${JSON.stringify(val).replace(/"/g, "'")}"`
            : `"${val}"`
        return val.trim()
      })
      .join(",")}`
  }
  return csv
}

exports.json = function (headers, rows) {
  return JSON.stringify(rows, undefined, 2)
}

exports.ExportFormats = {
  CSV: "csv",
  JSON: "json",
}
