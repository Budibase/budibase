exports.csv = function(headers, rows) {
  let csv = headers.map(key => `"${key}"`).join(",")

  for (let row of rows) {
    csv = `${csv}\n${headers
      .map(header => `"${row[header]}"`.trim())
      .join(",")}`
  }
  return csv
}

exports.json = function(headers, rows) {
  return JSON.stringify(rows, undefined, 2)
}
