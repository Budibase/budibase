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
  query: {},
}

class AirtableIntegration {
  constructor(config) {
    this.config = config
    this.client = new Airtable(config).base(config.base)
  }

  // async create() {

  // }

  async read() {
    const response = await this.client.query(this.queryString)
    return response.rows
  }

  // async update() {

  // }

  // async delete() {

  // }

  async query() {
    const records = await this.client(this.config.table)
      .select({ maxRecords: 10, view: "Grid view" })
      .firstPage()
    return records.map(({ fields }) => fields)
  }
}

module.exports = {
  schema: SCHEMA,
  integration: AirtableIntegration,
}
