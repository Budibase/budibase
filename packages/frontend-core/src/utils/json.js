import { utils } from "@budibase/shared-core"

/**
 * Gets the schema for a datasource which is targeting a JSON array, including
 * nested JSON arrays. The returned schema is a squashed, table-like schema
 * which is fully compatible with the rest of the platform.
 * @param tableSchema the full schema for the table this JSON field is in
 * @param datasource the datasource configuration
 */
export const getJSONArrayDatasourceSchema = (tableSchema, datasource) => {
  let jsonSchema = tableSchema
  let keysToSchema = []

  // If we are already deep inside a JSON field then we need to account
  // for the keys that brought us here, so we can get the schema for the
  // depth we're actually at
  if (datasource.prefixKeys) {
    keysToSchema = datasource.prefixKeys.concat(["schema"])
  }

  // We parse the label of the datasource to work out where we are inside
  // the structure. We can use this to know which part of the schema
  // is available underneath our current position.
  keysToSchema = keysToSchema.concat(datasource.label.split(".").slice(2))

  // Follow the JSON key path until we reach the schema for the level
  // we are at
  for (let i = 0; i < keysToSchema.length; i++) {
    jsonSchema = jsonSchema?.[keysToSchema[i]]
    if (jsonSchema?.schema) {
      jsonSchema = jsonSchema.schema
    }
  }

  // We need to convert the JSON schema into a more typical looking table
  // schema so that it works with the rest of the platform
  return convertJSONSchemaToTableSchema(jsonSchema, {
    squashObjects: true,
    prefixKeys: keysToSchema,
  })
}

/**
 * Converts a JSON field schema (or sub-schema of a nested field) into a schema
 * that looks like a typical table schema.
 * @param jsonSchema the JSON field schema or sub-schema
 * @param options
 */
export const convertJSONSchemaToTableSchema = (jsonSchema, options) => {
  if (!jsonSchema) {
    return null
  }

  // Add default options
  options = { squashObjects: false, prefixKeys: null, ...options }

  // Immediately strip the wrapper schema for objects, or wrap shallow values in
  // a fake "value" schema
  if (jsonSchema.schema) {
    jsonSchema = jsonSchema.schema
  } else {
    jsonSchema = {
      value: jsonSchema,
    }
  }

  // Extract all deep keys from the schema
  const keys = extractJSONSchemaKeys(jsonSchema, options.squashObjects)

  // Form a full schema from all the deep schema keys
  let schema = {}
  keys.forEach(({ key, type }) => {
    schema[key] = { type, name: key, prefixKeys: options.prefixKeys }
  })
  return schema
}

/**
 * Recursively builds paths to all leaf fields in a JSON field schema structure,
 * stopping when leaf nodes or arrays are reached.
 * @param jsonSchema the JSON field schema or sub-schema
 * @param squashObjects whether to recurse into objects or not
 */
const extractJSONSchemaKeys = (jsonSchema, squashObjects = false) => {
  if (!jsonSchema || !Object.keys(jsonSchema).length) {
    return []
  }

  // Iterate through every schema key
  let keys = []
  Object.keys(jsonSchema).forEach(key => {
    const type = jsonSchema[key].type

    // If we encounter an object, then only go deeper if we want to squash
    // object paths
    if (type === "json" && squashObjects) {
      // Find all keys within this objects schema
      const childKeys = extractJSONSchemaKeys(
        jsonSchema[key].schema,
        squashObjects
      )

      // Append child paths onto the current path to build the full path
      keys = keys.concat(
        childKeys.map(childKey => ({
          key: `${key}.${childKey.key}`,
          type: childKey.type,
        }))
      )
    }

    // Otherwise add this as a lead node.
    // We transform array types from "array" into "jsonarray" here to avoid
    // confusion with the existing "array" type that represents a multi-select.
    else {
      keys.push({
        key,
        type: type === "array" ? "jsonarray" : type,
      })
    }
  })
  return keys
}

export const generateQueryArraySchemas = (schema, nestedSchemaFields) => {
  for (let key in schema) {
    if (
      schema[key]?.type === "json" &&
      schema[key]?.subtype === "array" &&
      utils.hasSchema(nestedSchemaFields[key])
    ) {
      schema[key] = {
        schema: {
          schema: Object.entries(nestedSchemaFields[key] || {}).reduce(
            (acc, [nestedKey, fieldSchema]) => {
              acc[nestedKey] = {
                name: nestedKey,
                type: fieldSchema.type,
                subtype: fieldSchema.subtype,
              }
              return acc
            },
            {}
          ),
          type: "json",
        },
        type: "json",
        subtype: "array",
      }
    }
  }
  return schema
}
