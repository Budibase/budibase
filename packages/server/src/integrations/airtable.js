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
    table: {
      type: "string",
      default: "mytable",
      required: true,
    },
  },
  query: {
    Custom: {
      type: "fields",
      custom: true,
    },
    "Airtable Ids": {
      type: "list",
    },
  },
}

class AirtableIntegration {
  constructor(config) {
    this.config = config
    this.client = new Airtable(config).base(config.base)
  }

  async create(record) {
    try {
      const records = await this.client(this.config.table).create([
        {
          fields: record,
        },
      ])
      return records
    } catch (err) {
      console.error("Error writing to airtable", err)
      throw err
    }
  }

  async read() {
    const records = await this.client(this.config.table)
      .select({ maxRecords: this.query.records, view: this.query.view })
      .firstPage()
    return records.map(({ fields }) => fields)
  }

  async update(document) {
    const { id, ...rest } = document

    try {
      const records = await this.client(this.config.table).update([
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

  async delete(id) {
    try {
      const records = await this.client(this.config.table).destroy([id])
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
