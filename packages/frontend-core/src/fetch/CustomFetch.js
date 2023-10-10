import DataFetch from "./DataFetch.js"

export default class CustomFetch extends DataFetch {
  // Gets the correct Budibase type for a JS value
  getType(value) {
    if (value == null) {
      return "string"
    }
    const type = typeof value
    if (type === "object") {
      if (Array.isArray(value)) {
        // Use our custom array type to render badges
        return "array"
      }
      // Use JSON for objects to ensure they are stringified
      return "json"
    } else if (!isNaN(value)) {
      return "number"
    } else {
      return "string"
    }
  }

  // Parses the custom data into an array format
  parseCustomData(data) {
    if (!data) {
      return []
    }

    // Happy path - already an array
    if (Array.isArray(data)) {
      return data
    }

    // For strings, try JSON then fall back to attempting a CSV
    if (typeof data === "string") {
      try {
        const js = JSON.parse(data)
        return Array.isArray(js) ? js : [js]
      } catch (error) {
        // Ignore
      }

      // Try splitting by newlines first
      if (data.includes("\n")) {
        return data.split("\n").map(x => x.trim())
      }

      // Split by commas next
      return data.split(",").map(x => x.trim())
    }

    // Other cases we just assume it's a single object and wrap it
    return [data]
  }

  // Enriches the custom data to ensure the structure and format is usable
  enrichCustomData(data) {
    if (!data?.length) {
      return []
    }

    // Filter out any invalid values
    data = data.filter(x => x != null && x !== "" && !Array.isArray(x))

    // Ensure all values are packed into objects
    return data.map(value => {
      if (typeof value === "object") {
        return value
      }

      // Try parsing strings
      if (typeof value === "string") {
        const split = value.split(",").map(x => x.trim())
        let obj = {}
        for (let i = 0; i < split.length; i++) {
          const suffix = i === 0 ? "" : ` ${i + 1}`
          const key = `Value${suffix}`
          obj[key] = split[i]
        }
        return obj
      }

      // For anything else, wrap in an object
      return { Value: value }
    })
  }

  // Extracts and parses the custom data from the datasource definition
  getCustomData(datasource) {
    return this.enrichCustomData(this.parseCustomData(datasource?.data))
  }

  async getDefinition(datasource) {
    // Try and work out the schema from the array provided
    let schema = {}
    const data = this.getCustomData(datasource)
    if (!data?.length) {
      return { schema }
    }

    // Go through every object and extract all valid keys
    for (let datum of data) {
      for (let key of Object.keys(datum)) {
        if (key === "_id") {
          continue
        }
        if (!schema[key]) {
          let type = this.getType(datum[key])
          let constraints = {}

          // Determine whether we should render text columns as options instead
          if (type === "string") {
            const uniqueValues = [...new Set(data.map(x => x[key]))]
            const uniqueness = uniqueValues.length / data.length
            if (uniqueness <= 0.8 && uniqueValues.length > 1) {
              type = "options"
              constraints.inclusion = uniqueValues
            }
          }

          // Generate options for array columns
          else if (type === "array") {
            constraints.inclusion = [...new Set(data.map(x => x[key]).flat())]
          }

          schema[key] = {
            type,
            constraints,
          }
        }
      }
    }
    return { schema }
  }

  async getData() {
    const { datasource } = this.options
    return {
      rows: this.getCustomData(datasource),
      hasNextPage: false,
      cursor: null,
    }
  }
}
