import DataFetch from "./DataFetch.js"

export default class CustomFetch extends DataFetch {
  getType(value) {
    if (value == null) {
      return "string"
    }
    const type = typeof value
    if (type === "object") {
      if (Array.isArray(value)) {
        return "array"
      }
      return "json"
    } else {
      return type
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

    // Handle string cases
    if (typeof data === "string") {
      // Try JSON parsing
      try {
        data = JSON.parse(data)
        if (Array.isArray(data)) {
          return data
        }
      } catch (error) {
        // Ignore
      }

      // Try a simple CSV
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
    data = data.filter(x => x != null && !Array.isArray(x))

    // Ensure all values are packed into objects
    return data.map(x => (typeof x === "object" ? x : { value: x }))
  }

  getCustomData(datasource) {
    return this.enrichCustomData(this.parseCustomData(datasource?.data))
  }

  async getDefinition(datasource) {
    // Try and work out the schema from the array provided
    let schema = {}
    const data = this.getCustomData(datasource)

    // Go through every object and extract all valid keys
    for (let datum of data) {
      for (let key of Object.keys(datum)) {
        if (key === "_id") {
          continue
        }
        if (!schema[key]) {
          schema[key] = { type: this.getType(datum[key]) }
        }
      }
    }

    return {
      schema,
    }
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
