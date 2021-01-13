const Airtable = require("airtable")
const { FIELD_TYPES, QUERY_TYPES } = require("./Integration")

const SCHEMA = {
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
      "Airtable Record": {
        type: "fields",
        customisable: true,
        fields: {
          table: {
            type: FIELD_TYPES.STRING,
            required: true,
          },
        },
      },
    },
    read: {
      Table: {
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
    },
    update: {
      Fields: {
        type: QUERY_TYPES.FIELDS,
        customisable: true,
        fields: {
          id: {
            type: FIELD_TYPES.STRING,
            required: true,
          },
        },
      },
    },
    delete: {
      "Airtable Ids": {
        type: FIELD_TYPES.LIST,
      },
    },
  },
}

class AirtableIntegration {
  constructor(config) {
    this.config = config
    this.client = new Airtable(config).base(config.base)
  }

  async create(query) {
    const { table, ...rest } = query

    try {
      const records = await this.client(table).create([
        {
          fields: rest,
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
        .select({ maxRecords: 10, view: query.view })
        .firstPage()
      return records.map(({ fields }) => fields)
    } catch (err) {
      console.error("Error writing to airtable", err)
      return []
    }
  }

  async update(query) {
    const { table, id, ...rest } = query

    try {
      const records = await this.client(table).update([
        {
          id,
          fields: rest,
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
