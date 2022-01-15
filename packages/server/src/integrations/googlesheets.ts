import {
  DatasourceFieldTypes,
  Integration,
  QueryJson,
  QueryTypes,
} from "../definitions/datasource"
import { OAuth2Client } from "google-auth-library"
import { DatasourcePlus } from "./base/datasourcePlus"
import { Row, Table, TableSchema } from "../definitions/common"
import { buildExternalTableId } from "./utils"
import { DataSourceOperation, FieldTypes } from "../constants"
import { GoogleSpreadsheet } from "google-spreadsheet"

module GoogleSheetsModule {
  const { getGlobalDB } = require("@budibase/backend-core/tenancy")
  const { getScopedConfig } = require("@budibase/backend-core/db")
  const { Configs } = require("@budibase/backend-core/constants")

  interface GoogleSheetsConfig {
    spreadsheetId: string
    auth: OAuthClientConfig
  }

  interface OAuthClientConfig {
    appId: string
    accessToken: string
    refreshToken: string
  }

  const SCHEMA: Integration = {
    plus: true,
    auth: {
      type: "google",
    },
    docs: "https://developers.google.com/sheets/api/quickstart/nodejs",
    description:
      "Create and collaborate on online spreadsheets in real-time and from any device. ",
    friendlyName: "Google Sheets",
    datasource: {
      spreadsheetId: {
        type: DatasourceFieldTypes.STRING,
        required: true,
      },
    },
    query: {
      create: {
        type: QueryTypes.FIELDS,
        fields: {
          sheet: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
          row: {
            type: QueryTypes.JSON,
            required: true,
          },
        },
      },
      read: {
        type: QueryTypes.FIELDS,
        fields: {
          sheet: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
        },
      },
      update: {
        type: QueryTypes.FIELDS,
        fields: {
          sheet: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
          rowIndex: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
          row: {
            type: QueryTypes.JSON,
            required: true,
          },
        },
      },
      delete: {
        type: QueryTypes.FIELDS,
        fields: {
          sheet: {
            type: DatasourceFieldTypes.STRING,
            required: true,
          },
          rowIndex: {
            type: DatasourceFieldTypes.NUMBER,
            required: true,
          },
        },
      },
    },
  }

  class GoogleSheetsIntegration implements DatasourcePlus {
    private readonly config: GoogleSheetsConfig
    private client: any
    public tables: Record<string, Table> = {}
    public schemaErrors: Record<string, string> = {}

    constructor(config: GoogleSheetsConfig) {
      this.config = config
      const spreadsheetId = this.cleanSpreadsheetUrl(this.config.spreadsheetId)
      this.client = new GoogleSpreadsheet(spreadsheetId)
    }

    /**
     * Pull the spreadsheet ID out from a valid google sheets URL
     * @param spreadsheetId - the URL or standard spreadsheetId of the google sheet
     * @returns spreadsheet Id of the google sheet
     */
    cleanSpreadsheetUrl(spreadsheetId: string) {
      const parts = spreadsheetId.split("/")
      return parts.length > 5 ? parts[5] : spreadsheetId
    }

    async connect() {
      try {
        // Initialise oAuth client
        const db = getGlobalDB()
        const googleConfig = await getScopedConfig(db, {
          type: Configs.GOOGLE,
        })
        const oauthClient = new OAuth2Client({
          clientId: googleConfig.clientID,
          clientSecret: googleConfig.clientSecret,
        })
        oauthClient.credentials.access_token = this.config.auth.accessToken
        oauthClient.credentials.refresh_token = this.config.auth.refreshToken
        this.client.useOAuth2Client(oauthClient)
        await this.client.loadInfo()
      } catch (err) {
        console.error("Error connecting to google sheets", err)
        throw err
      }
    }

    async buildSchema(datasourceId: string) {
      await this.connect()
      const sheets = await this.client.sheetsByIndex
      const tables: Record<string, Table> = {}
      for (let sheet of sheets) {
        // must fetch rows to determine schema
        await sheet.getRows()
        // build schema
        const schema: TableSchema = {}

        // build schema from headers
        for (let header of sheet.headerValues) {
          schema[header] = {
            name: header,
            type: FieldTypes.STRING,
          }
        }

        // create tables
        tables[sheet.title] = {
          _id: buildExternalTableId(datasourceId, sheet.title),
          name: sheet.title,
          primary: ["rowNumber"],
          schema,
        }
      }

      this.tables = tables
    }

    async query(json: QueryJson) {
      const sheet = json.endpoint.entityId

      if (json.endpoint.operation === DataSourceOperation.CREATE) {
        return await this.create({
          sheet,
          row: json.body,
        })
      }

      if (json.endpoint.operation === DataSourceOperation.READ) {
        return await this.read({ sheet })
      }

      if (json.endpoint.operation === DataSourceOperation.UPDATE) {
        return await this.update({
          // exclude the header row and zero index
          rowIndex: json.extra?.idFilter?.equal?.rowNumber - 2,
          sheet,
          row: json.body,
        })
      }

      if (json.endpoint.operation === DataSourceOperation.DELETE) {
        return await this.delete({
          // exclude the header row and zero index
          rowIndex: json.extra?.idFilter?.equal?.rowNumber - 2,
          sheet,
        })
      }
    }

    buildRowObject(headers: string[], values: string[], rowNumber: number) {
      const rowObject: { rowNumber: number; [key: string]: any } = { rowNumber }
      for (let i = 0; i < headers.length; i++) {
        rowObject._id = rowNumber
        rowObject[headers[i]] = values[i]
      }
      return rowObject
    }

    async create(query: { sheet: string; row: any }) {
      try {
        await this.connect()
        const sheet = await this.client.sheetsByTitle[query.sheet]
        const rowToInsert =
          typeof query.row === "string" ? JSON.parse(query.row) : query.row
        const row = await sheet.addRow(rowToInsert)
        return [
          this.buildRowObject(sheet.headerValues, row._rawData, row._rowNumber),
        ]
      } catch (err) {
        console.error("Error writing to google sheets", err)
        throw err
      }
    }

    async read(query: { sheet: string }) {
      try {
        await this.connect()
        const sheet = await this.client.sheetsByTitle[query.sheet]
        const rows = await sheet.getRows()
        const headerValues = sheet.headerValues
        const response = []
        for (let row of rows) {
          response.push(
            this.buildRowObject(headerValues, row._rawData, row._rowNumber)
          )
        }
        return response
      } catch (err) {
        console.error("Error reading from google sheets", err)
        throw err
      }
    }

    async update(query: { sheet: string; rowIndex: number; row: any }) {
      try {
        await this.connect()
        const sheet = await this.client.sheetsByTitle[query.sheet]
        const rows = await sheet.getRows()
        const row = rows[query.rowIndex]
        if (row) {
          const updateValues = query.row
          for (let key in updateValues) {
            row[key] = updateValues[key]
          }
          await row.save()
          return [
            this.buildRowObject(
              sheet.headerValues,
              row._rawData,
              row._rowNumber
            ),
          ]
        } else {
          throw new Error("Row does not exist.")
        }
      } catch (err) {
        console.error("Error reading from google sheets", err)
        throw err
      }
    }

    async delete(query: { sheet: string; rowIndex: number }) {
      await this.connect()
      const sheet = await this.client.sheetsByTitle[query.sheet]
      const rows = await sheet.getRows()
      const row = rows[query.rowIndex]
      if (row) {
        await row.delete()
        return [{ deleted: query.rowIndex }]
      } else {
        throw new Error("Row does not exist.")
      }
    }
  }

  module.exports = {
    schema: SCHEMA,
    integration: GoogleSheetsIntegration,
  }
}
