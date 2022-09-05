import {
  DatasourceFieldType,
  Integration,
  QueryType,
  Table,
  TableSchema,
  QueryJson,
  DatasourcePlus,
} from "@budibase/types"
import { OAuth2Client } from "google-auth-library"
import { buildExternalTableId } from "./utils"
import { DataSourceOperation, FieldTypes } from "../constants"
import { GoogleSpreadsheet } from "google-spreadsheet"
import env from "../environment"

module GoogleSheetsModule {
  const { getGlobalDB } = require("@budibase/backend-core/tenancy")
  const { getScopedConfig } = require("@budibase/backend-core/db")
  const { Configs } = require("@budibase/backend-core/constants")
  const fetch = require("node-fetch")

  interface GoogleSheetsConfig {
    spreadsheetId: string
    auth: OAuthClientConfig
  }

  interface OAuthClientConfig {
    appId: string
    accessToken: string
    refreshToken: string
  }

  interface AuthTokenRequest {
    client_id: string
    client_secret: string
    refresh_token: string
  }

  interface AuthTokenResponse {
    access_token: string
  }

  const SCHEMA: Integration = {
    plus: true,
    auth: {
      type: "google",
    },
    relationships: false,
    docs: "https://developers.google.com/sheets/api/quickstart/nodejs",
    description:
      "Create and collaborate on online spreadsheets in real-time and from any device. ",
    friendlyName: "Google Sheets",
    type: "Spreadsheet",
    datasource: {
      spreadsheetId: {
        display: "Google Sheet URL",
        type: DatasourceFieldType.STRING,
        required: true,
      },
    },
    query: {
      create: {
        type: QueryType.FIELDS,
        fields: {
          sheet: {
            type: DatasourceFieldType.STRING,
            required: true,
          },
          row: {
            type: QueryType.JSON,
            required: true,
          },
        },
      },
      read: {
        type: QueryType.FIELDS,
        fields: {
          sheet: {
            type: DatasourceFieldType.STRING,
            required: true,
          },
        },
      },
      update: {
        type: QueryType.FIELDS,
        fields: {
          sheet: {
            type: DatasourceFieldType.STRING,
            required: true,
          },
          rowIndex: {
            type: DatasourceFieldType.STRING,
            required: true,
          },
          row: {
            type: QueryType.JSON,
            required: true,
          },
        },
      },
      delete: {
        type: QueryType.FIELDS,
        fields: {
          sheet: {
            type: DatasourceFieldType.STRING,
            required: true,
          },
          rowIndex: {
            type: DatasourceFieldType.NUMBER,
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

    getBindingIdentifier() {
      return ""
    }

    getStringConcat(parts: string[]) {
      return ""
    }

    /**
     * Pull the spreadsheet ID out from a valid google sheets URL
     * @param spreadsheetId - the URL or standard spreadsheetId of the google sheet
     * @returns spreadsheet Id of the google sheet
     */
    cleanSpreadsheetUrl(spreadsheetId: string) {
      if (!spreadsheetId) {
        throw new Error(
          "You must set a spreadsheet ID in your configuration to fetch tables."
        )
      }
      const parts = spreadsheetId.split("/")
      return parts.length > 5 ? parts[5] : spreadsheetId
    }

    async fetchAccessToken(
      payload: AuthTokenRequest
    ): Promise<AuthTokenResponse> {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v4/token",
        {
          method: "POST",
          body: JSON.stringify({
            ...payload,
            grant_type: "refresh_token",
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      const json = await response.json()

      if (response.status !== 200) {
        throw new Error(
          `Error authenticating with google sheets. ${json.error_description}`
        )
      }

      return json
    }

    async connect() {
      try {
        // Initialise oAuth client
        const db = getGlobalDB()
        let googleConfig = await getScopedConfig(db, {
          type: Configs.GOOGLE,
        })

        if (!googleConfig) {
          googleConfig = {
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          }
        }

        const oauthClient = new OAuth2Client({
          clientId: googleConfig.clientID,
          clientSecret: googleConfig.clientSecret,
        })

        const tokenResponse = await this.fetchAccessToken({
          client_id: googleConfig.clientID,
          client_secret: googleConfig.clientSecret,
          refresh_token: this.config.auth.refreshToken,
        })

        oauthClient.setCredentials({
          refresh_token: this.config.auth.refreshToken,
          access_token: tokenResponse.access_token,
        })

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

      const handlers = {
        [DataSourceOperation.CREATE]: () =>
          this.create({ sheet, row: json.body }),
        [DataSourceOperation.READ]: () => this.read({ sheet }),
        [DataSourceOperation.UPDATE]: () =>
          this.update({
            // exclude the header row and zero index
            rowIndex: json.extra?.idFilter?.equal?.rowNumber - 2,
            sheet,
            row: json.body,
          }),
        [DataSourceOperation.DELETE]: () =>
          this.delete({
            // exclude the header row and zero index
            rowIndex: json.extra?.idFilter?.equal?.rowNumber - 2,
            sheet,
          }),
        [DataSourceOperation.CREATE_TABLE]: () =>
          this.createTable(json?.table?.name),
        [DataSourceOperation.UPDATE_TABLE]: () => this.updateTable(json.table),
        [DataSourceOperation.DELETE_TABLE]: () =>
          this.deleteTable(json?.table?.name),
      }

      const internalQueryMethod = handlers[json.endpoint.operation]

      return await internalQueryMethod()
    }

    buildRowObject(headers: string[], values: string[], rowNumber: number) {
      const rowObject: { rowNumber: number; [key: string]: any } = { rowNumber }
      for (let i = 0; i < headers.length; i++) {
        rowObject._id = rowNumber
        rowObject[headers[i]] = values[i]
      }
      return rowObject
    }

    async createTable(name?: string) {
      try {
        await this.connect()
        const sheet = await this.client.addSheet({ title: name })
        return sheet
      } catch (err) {
        console.error("Error creating new table in google sheets", err)
        throw err
      }
    }

    async updateTable(table?: any) {
      try {
        await this.connect()
        const sheet = await this.client.sheetsByTitle[table.name]
        await sheet.loadHeaderRow()

        if (table._rename) {
          const headers = []
          for (let header of sheet.headerValues) {
            if (header === table._rename.old) {
              headers.push(table._rename.updated)
            } else {
              headers.push(header)
            }
          }
          await sheet.setHeaderRow(headers)
        } else {
          let newField = Object.keys(table.schema).find(
            key => !sheet.headerValues.includes(key)
          )
          await sheet.setHeaderRow([...sheet.headerValues, newField])
        }
      } catch (err) {
        console.error("Error updating table in google sheets", err)
        throw err
      }
    }

    async deleteTable(sheet: any) {
      try {
        await this.connect()
        const sheetToDelete = await this.client.sheetsByTitle[sheet]
        return await sheetToDelete.delete()
      } catch (err) {
        console.error("Error deleting table in google sheets", err)
        throw err
      }
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
          const updateValues =
            typeof query.row === "string" ? JSON.parse(query.row) : query.row
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
