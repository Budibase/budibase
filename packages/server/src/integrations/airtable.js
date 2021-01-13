const Airtable = require("airtable")

const SCHEMA = {
  datasource: {
    apiKey: {
      type: "string",
      default: "enter api key",
      required: true,
    },
    base: {
      type: "string",
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
            type: "string",
            required: true,
          },
        },
      },
    },
    read: {
      Table: {
        type: "fields",
        fields: {
          table: {
            type: "string",
            required: true,
          },
          view: {
            type: "string",
            required: true,
          },
        },
      },
    },
    update: {
      Fields: {
        type: "fields",
        customisable: true,
        fields: {
          id: {
            type: "string",
            required: true,
          },
        },
      },
    },
    delete: {
      "Airtable Ids": {
        type: "list",
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
