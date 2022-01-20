import DataFetch from "./DataFetch.js"

export default class FieldFetch extends DataFetch {
  async getDefinition(datasource) {
    // Field sources have their schema statically defined
    let schema
    if (datasource.fieldType === "attachment") {
      schema = {
        url: {
          type: "string",
        },
        name: {
          type: "string",
        },
      }
    } else if (datasource.fieldType === "array") {
      schema = {
        value: {
          type: "string",
        },
      }
    }
    return { schema }
  }

  async getData() {
    const { datasource } = this.options

    // These sources will be available directly from context
    const data = datasource?.value || []
    let rows
    if (Array.isArray(data) && data[0] && typeof data[0] !== "object") {
      rows = data.map(value => ({ value }))
    } else {
      rows = data
    }

    return {
      rows: rows || [],
      hasNextPage: false,
      cursor: null,
    }
  }
}
