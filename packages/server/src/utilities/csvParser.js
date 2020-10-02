const csv = require("csvtojson")

const VALIDATORS = {
  string: () => true,
  number: attribute => !isNaN(Number(attribute)),
  datetime: attribute => !isNaN(new Date(attribute).getTime()),
}

const PARSERS = {
  string: attribute => attribute.toString(),
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
    result.fromFile(path).subscribe(row => {
      // For each CSV row
      // parse all the columns that need parsed
      for (let key in parsers) {
        // if the schema has already borked for a parser, skip this column
        if (!schema[key] || !schema[key].success) continue

        // get the validator
        const validator = VALIDATORS[parsers[key].type]

        try {
          schema[key].success = !!validator(row[key])
        } catch (err) {
          schema[key].success = false
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

// TODO: significant refactor
async function transform({ schema, path }) {
  const colParser = {}

  for (let key in schema) {
    colParser[key] = PARSERS[schema[key].type]
  }

  try {
    const json = await csv({ colParser }).fromFile(path)
    return json
  } catch (err) {
    console.error(`Error transforming CSV to JSON for data import`, err)
  }
}

module.exports = {
  parse,
  transform,
}
