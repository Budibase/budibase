const csv = require("csvtojson")

const VALIDATORS = {
  string: () => true,
  number: attribute => !isNaN(Number(attribute)),
  datetime: attribute => !isNaN(new Date(attribute).getTime()),
}

const PARSERS = {
  number: attribute => Number(attribute),
  datetime: attribute => new Date(attribute).toISOString(),
}

function parse(path, parsers) {
  const result = csv().fromFile(path)

  const schema = {}

  return new Promise((resolve, reject) => {
    result.on("header", headers => {
      for (let header of headers) {
        schema[header] = {
          type: parsers[header] ? parsers[header].type : "string",
          success: true,
        }
      }
    })
    result.subscribe((row, lineNumber) => {
      // For each CSV row parse all the columns that need parsed
      for (let key in parsers) {
        if (!schema[key] || schema[key].success) {
          // get the validator for the column type
          const validator = VALIDATORS[parsers[key].type]

          try {
            // allow null/undefined values
            schema[key].success = !row[key] || validator(row[key])
          } catch (err) {
            schema[key].success = false
          }
        }
      }
    })
    result.on("done", error => {
      if (error) {
        console.error(error)
        reject(error)
      }

      resolve(schema)
    })
  })
}

async function transform({ schema, path }) {
  const colParser = {}

  for (let key in schema) {
    colParser[key] = PARSERS[schema[key].type] || schema[key].type
  }

  try {
    const json = await csv({ colParser }).fromFile(path)
    return json
  } catch (err) {
    console.error(`Error transforming CSV to JSON for data import`, err)
    throw err
  }
}

module.exports = {
  parse,
  transform,
}
