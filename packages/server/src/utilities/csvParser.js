const csv = require("csvtojson")
const { FieldTypes } = require("../constants")

const VALIDATORS = {
  [FieldTypes.STRING]: () => true,
  [FieldTypes.OPTIONS]: () => true,
  [FieldTypes.BARCODEQR]: () => true,
  [FieldTypes.NUMBER]: attribute => {
    // allow not to be present
    if (!attribute) {
      return true
    }
    return !isNaN(Number(attribute))
  },
  [FieldTypes.DATETIME]: attribute => {
    // allow not to be present
    if (!attribute) {
      return true
    }
    return !isNaN(new Date(attribute).getTime())
  },
}

const PARSERS = {
  [FieldTypes.NUMBER]: attribute => {
    if (!attribute) {
      return attribute
    }
    return Number(attribute)
  },
  [FieldTypes.DATETIME]: attribute => {
    if (!attribute) {
      return attribute
    }
    return new Date(attribute).toISOString()
  },
}

function parse(csvString, parsers) {
  const result = csv().fromString(csvString)

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
    result.subscribe(row => {
      // For each CSV row parse all the columns that need parsed
      for (let key of Object.keys(parsers)) {
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

function updateSchema({ schema, existingTable }) {
  if (!schema) {
    return schema
  }
  const finalSchema = {}
  const schemaKeyMap = {}
  Object.keys(schema).forEach(key => (schemaKeyMap[key.toLowerCase()] = key))
  for (let [key, field] of Object.entries(existingTable.schema)) {
    const lcKey = key.toLowerCase()
    const foundKey = schemaKeyMap[lcKey]
    if (foundKey) {
      finalSchema[key] = schema[foundKey]
      finalSchema[key].type = field.type
    }
  }
  return finalSchema
}

async function transform({ schema, csvString, existingTable }) {
  const colParser = {}

  // make sure the table has all the columns required for import
  if (existingTable) {
    schema = updateSchema({ schema, existingTable })
  }

  for (let [key, field] of Object.entries(schema)) {
    // don't import data to auto columns
    if (!field.autocolumn) {
      colParser[key] = PARSERS[field.type] || field.type
    }
  }

  try {
    const data = await csv({ colParser }).fromString(csvString)
    const schemaKeyMap = {}
    Object.keys(schema).forEach(key => (schemaKeyMap[key.toLowerCase()] = key))
    for (let element of data) {
      if (!data) {
        continue
      }
      for (let key of Object.keys(element)) {
        const mappedKey = schemaKeyMap[key.toLowerCase()]
        // isn't a column in the table, remove it
        if (mappedKey == null) {
          delete element[key]
        }
        // casing is different, fix it in row
        else if (key !== mappedKey) {
          element[mappedKey] = element[key]
          delete element[key]
        }
      }
    }
    return data
  } catch (err) {
    console.error(`Error transforming CSV to JSON for data import`, err)
    throw err
  }
}

module.exports = {
  parse,
  transform,
  updateSchema,
}
