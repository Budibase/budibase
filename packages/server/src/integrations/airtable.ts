import {
  ConnectionInfo,
  DatasourceFeature,
  DatasourceFieldType,
  Integration,
  IntegrationBase,
  QueryType,
} from "@budibase/types"

import Airtable from "airtable"

interface AirtableConfig {
  apiKey: string
  base: string
}

const SCHEMA: Integration = {
  docs: "https://airtable.com/api",
  description:
    "Airtable is a spreadsheet-database hybrid, with the features of a database but applied to a spreadsheet.",
  friendlyName: "Airtable",
  type: "Spreadsheet",
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
  },
  datasource: {
    apiKey: {
      type: DatasourceFieldType.PASSWORD,
      default: "enter api key",
      required: true,
    },
    base: {
      type: DatasourceFieldType.STRING,
      default: "mybase",
      required: true,
    },
  },
  query: {
    create: {
      type: QueryType.FIELDS,
      customisable: true,
      fields: {
        table: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
    read: {
      type: QueryType.FIELDS,
      fields: {
        table: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
        view: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
        numRecords: {
          type: DatasourceFieldType.NUMBER,
          default: 10,
        },
      },
    },
    update: {
      type: QueryType.FIELDS,
      customisable: true,
      fields: {
        id: {
          display: "Record ID",
          type: DatasourceFieldType.STRING,
          required: true,
        },
        table: {
          type: DatasourceFieldType.STRING,
          required: true,
        },
      },
    },
    delete: {
      type: QueryType.JSON,
    },
  },
}

class AirtableIntegration implements IntegrationBase {
  private config: AirtableConfig
  private client

  constructor(config: AirtableConfig) {
    this.config = config
    this.client = new Airtable(config).base(config.base)
  }

  async testConnection(): Promise<ConnectionInfo> {
    const mockTable = Date.now().toString()
    try {
      await this.client.makeRequest({
        path: `/${mockTable}`,
      })

      return { connected: true }
    } catch (e: any) {
      if (
        e.message ===
        `Could not find table ${mockTable} in application ${this.config.base}`
      ) {
        // The request managed to check the application, so the credentials are valid
        return { connected: true }
      }

      return {
        connected: false,
        error: e.message as string,
      }
    }
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

export default {
  schema: SCHEMA,
  integration: AirtableIntegration,
}
