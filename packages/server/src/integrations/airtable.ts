import {
  Integration,
  DatasourceFieldTypes,
  QueryTypes,
} from "../definitions/datasource"

module AirtableModule {
  const Airtable = require("airtable")

  interface AirtableConfig {
    apiKey: string
    base: string
  }

  const SCHEMA: Integration = {
    docs: "https://airtable.com/api",
    description:
      "Airtable is a spreadsheet-database hybrid, with the features of a database but applied to a spreadsheet.",
    friendlyName: "Airtable",
    datasource: {
      apiKey: {
        type: DatasourceFieldTypes.PASSWORD,
        default: "enter api key",
        required: true,
      },
      base: {
        type: DatasourceFieldTypes.STRING,
        default: "mybase",
        required: true,
      },
    },
    query: {
      create: {
        type: QueryTypes.FIELDS,
        customisable: true,
        fields: {
          table: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
        },
      },
      read: {
        type: QueryTypes.FIELDS,
        fields: {
          table: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
          view: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
          numRecords: {
            type: DatasourceFieldTypes.NUMBER,
            default: 10,
          },
        },
      },
      update: {
        type: QueryTypes.FIELDS,
        customisable: true,
        fields: {
          id: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
        },
      },
      delete: {
        type: QueryTypes.JSON,
      },
    },
  }

  class AirtableIntegration {
    private config: AirtableConfig
    private client: any

    constructor(config: AirtableConfig) {
      this.config = config
      this.client = new Airtable(config).base(config.base)
    }

    async create(query: { table: any; json: any }) {
      const { table, json } = query

      try {
        return await this.client(table).create([
          {
            fields: json,
          },
        ])
      } catch (err) {
        console.error("Error writing to airtable", err)
        throw err
      }
    }

    async read(query: { table: any; numRecords: any; view: any }) {
      try {
        const records = await this.client(query.table)
          .select({ maxRecords: query.numRecords || 10, view: query.view })
          .firstPage()
        // @ts-ignore
        return records.map(({ fields }) => fields)
      } catch (err) {
        console.error("Error writing to airtable", err)
        return []
      }
    }

    async update(query: { table: any; id: any; json: any }) {
      const { table, id, json } = query

      try {
        return await this.client(table).update([
          {
            id,
            fields: json,
          },
        ])
      } catch (err) {
        console.error("Error writing to airtable", err)
        throw err
      }
    }

    async delete(query: { table: any; ids: any }) {
      try {
        return await this.client(query.table).destroy(query.ids)
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
}
