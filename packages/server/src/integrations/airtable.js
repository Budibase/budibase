const Airtable = require("airtable")
const { FIELD_TYPES, QUERY_TYPES } = require("./Integration")

const SCHEMA = {
  docs: "https://airtable.com/api",
  datasource: {
    apiKey: {
      type: FIELD_TYPES.STRING,
      default: "enter api key",
      required: true,
    },
    base: {
      type: FIELD_TYPES.STRING,
      default: "mybase",
      required: true,
    },
  },
  query: {
    create: {
      type: QUERY_TYPES.FIELDS,
      customisable: true,
      fields: {
        table: {
          type: FIELD_TYPES.STRING,
          required: true,
        },
      },
    },
    read: {
      type: QUERY_TYPES.FIELDS,
      fields: {
        table: {
          type: FIELD_TYPES.STRING,
          required: true,
        },
        view: {
          type: FIELD_TYPES.STRING,
          required: true,
        },
      },
    },
    update: {
      type: QUERY_TYPES.FIELDS,
      customisable: true,
      fields: {
        id: {
          type: FIELD_TYPES.STRING,
          required: true,
        },
      },
    },
    delete: {
      type: FIELD_TYPES.JSON,
    },
  },
}

class AirtableIntegration {
  constructor(config) {
    this.config = config
    this.client = new Airtable(config).base(config.base)
  }

  async create(query) {
    const { table, json } = query

    try {
      const records = await this.client(table).create([
        {
          fields: json,
        },
      ])
      return records
    } catch (err) {
      console.error("Error writing to airtable", err)
      throw err
    }
  }

  async read(query) {
    try {
      const records = await this.client(query.table)
        .select({ maxRecords: query.numRecords || 10, view: query.view })
        .firstPage()
      return records.map(({ fields }) => fields)
    } catch (err) {
      console.error("Error writing to airtable", err)
      return []
    }
  }

  async update(query) {
    const { table, id, json } = query

    try {
      const records = await this.client(table).update([
        {
          id,
          fields: json,
        },
      ])
      return records
    } catch (err) {
      console.error("Error writing to airtable", err)
      throw err
    }
  }

  async delete(query) {
    try {
      const records = await this.client(query.table).destroy(query.ids)
      return records
    } catch (err) {
      console.error("Error writing to airtable", err)
      throw err
    }
  }
}

module.exports = {
  schema: SCHEMA,
  integration: AirtableIntegration,
}
