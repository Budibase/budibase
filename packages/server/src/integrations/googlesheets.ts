import {
  DatasourceFieldType,
  DatasourcePlus,
  FieldType,
  Integration,
  Operation,
  PaginationJson,
  QueryJson,
  QueryType,
  Row,
  SearchFilters,
  SortJson,
  Table,
  TableRequest,
} from "@budibase/types"
import { OAuth2Client } from "google-auth-library"
import { buildExternalTableId, finaliseExternalTables } from "./utils"
import { GoogleSpreadsheet } from "google-spreadsheet"
import fetch from "node-fetch"
import { configs, HTTPError } from "@budibase/backend-core"
import { dataFilters } from "@budibase/shared-core"
import { GOOGLE_SHEETS_PRIMARY_KEY } from "../constants"

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

const ALLOWED_TYPES = [
  FieldType.STRING,
  FieldType.FORMULA,
  FieldType.NUMBER,
  FieldType.LONGFORM,
  FieldType.DATETIME,
  FieldType.OPTIONS,
  FieldType.BOOLEAN,
  FieldType.BARCODEQR,
]

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
  private client: GoogleSpreadsheet
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
    const response = await fetch("https://www.googleapis.com/oauth2/v4/token", {
      method: "POST",
      body: JSON.stringify({
        ...payload,
        grant_type: "refresh_token",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })

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
      let googleConfig = await configs.getGoogleDatasourceConfig()
      if (!googleConfig) {
        throw new HTTPError("Google config not found", 400)
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
    } catch (err: any) {
      // this happens for xlsx imports
      if (err.message?.includes("operation is not supported")) {
        err.message =
          "This operation is not supported - XLSX sheets must be converted."
      }
      console.error("Error connecting to google sheets", err)
      throw err
    }
  }

  getTableSchema(title: string, headerValues: string[], id?: string) {
    // base table
    const table: Table = {
      name: title,
      primary: [GOOGLE_SHEETS_PRIMARY_KEY],
      schema: {},
    }
    if (id) {
      table._id = id
    }
    // build schema from headers
    for (let header of headerValues) {
      table.schema[header] = {
        name: header,
        type: FieldType.STRING,
      }
    }
    return table
  }

  async buildSchema(datasourceId: string, entities: Record<string, Table>) {
    // not fully configured yet
    if (!this.config.auth) {
      return
    }
    await this.connect()
    const sheets = this.client.sheetsByIndex
    const tables: Record<string, Table> = {}
    for (let sheet of sheets) {
      // must fetch rows to determine schema
      await sheet.getRows()

      const id = buildExternalTableId(datasourceId, sheet.title)
      tables[sheet.title] = this.getTableSchema(
        sheet.title,
        sheet.headerValues,
        id
      )
    }
    const final = finaliseExternalTables(tables, entities)
    this.tables = final.tables
    this.schemaErrors = final.errors
  }

  async query(json: QueryJson) {
    const sheet = json.endpoint.entityId
    switch (json.endpoint.operation) {
      case Operation.CREATE:
        return this.create({ sheet, row: json.body as Row })
      case Operation.BULK_CREATE:
        return this.createBulk({ sheet, rows: json.body as Row[] })
      case Operation.READ:
        return this.read({ ...json, sheet })
      case Operation.UPDATE:
        return this.update({
          // exclude the header row and zero index
          rowIndex: json.extra?.idFilter?.equal?.rowNumber - 2,
          sheet,
          row: json.body,
        })
      case Operation.DELETE:
        return this.delete({
          // exclude the header row and zero index
          rowIndex: json.extra?.idFilter?.equal?.rowNumber - 2,
          sheet,
        })
      case Operation.CREATE_TABLE:
        return this.createTable(json?.table?.name)
      case Operation.UPDATE_TABLE:
        return this.updateTable(json.table!)
      case Operation.DELETE_TABLE:
        return this.deleteTable(json?.table?.name)
      default:
        throw new Error(
          `GSheets integration does not support "${json.endpoint.operation}".`
        )
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

  async createTable(name?: string) {
    if (!name) {
      throw new Error("Must provide name for new sheet.")
    }
    try {
      await this.connect()
      return await this.client.addSheet({ title: name, headerValues: [name] })
    } catch (err) {
      console.error("Error creating new table in google sheets", err)
      throw err
    }
  }

  async updateTable(table: TableRequest) {
    await this.connect()
    const sheet = this.client.sheetsByTitle[table.name]
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
      try {
        await sheet.setHeaderRow(headers)
      } catch (err) {
        console.error("Error updating column name in google sheets", err)
        throw err
      }
    } else {
      const updatedHeaderValues = [...sheet.headerValues]

      // add new column - doesn't currently exist
      for (let [key, column] of Object.entries(table.schema)) {
        if (!ALLOWED_TYPES.includes(column.type)) {
          throw new Error(
            `Column type: ${column.type} not allowed for GSheets integration.`
          )
        }
        if (
          !sheet.headerValues.includes(key) &&
          column.type !== FieldType.FORMULA
        ) {
          updatedHeaderValues.push(key)
        }
      }

      // clear out deleted columns
      for (let key of sheet.headerValues) {
        if (!Object.keys(table.schema).includes(key)) {
          const idx = updatedHeaderValues.indexOf(key)
          updatedHeaderValues.splice(idx, 1)
        }
      }

      try {
        await sheet.setHeaderRow(updatedHeaderValues)
      } catch (err) {
        console.error("Error updating table in google sheets", err)
        throw err
      }
    }
  }

  async deleteTable(sheet: any) {
    try {
      await this.connect()
      const sheetToDelete = this.client.sheetsByTitle[sheet]
      return await sheetToDelete.delete()
    } catch (err) {
      console.error("Error deleting table in google sheets", err)
      throw err
    }
  }

  async create(query: { sheet: string; row: any }) {
    try {
      await this.connect()
      const sheet = this.client.sheetsByTitle[query.sheet]
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

  async createBulk(query: { sheet: string; rows: any[] }) {
    try {
      await this.connect()
      const sheet = this.client.sheetsByTitle[query.sheet]
      let rowsToInsert = []
      for (let row of query.rows) {
        rowsToInsert.push(typeof row === "string" ? JSON.parse(row) : row)
      }
      const rows = await sheet.addRows(rowsToInsert)
      return rows.map(row =>
        this.buildRowObject(sheet.headerValues, row._rawData, row._rowNumber)
      )
    } catch (err) {
      console.error("Error bulk writing to google sheets", err)
      throw err
    }
  }

  async read(query: {
    sheet: string
    filters?: SearchFilters
    sort?: SortJson
    paginate?: PaginationJson
  }) {
    try {
      await this.connect()
      const sheet = this.client.sheetsByTitle[query.sheet]
      const rows = await sheet.getRows()
      const filtered = dataFilters.runLuceneQuery(rows, query.filters)
      const headerValues = sheet.headerValues
      let response = []
      for (let row of filtered) {
        response.push(
          this.buildRowObject(headerValues, row._rawData, row._rowNumber)
        )
      }

      if (query.sort) {
        if (Object.keys(query.sort).length !== 1) {
          console.warn("Googlesheets does not support multiple sorting", {
            sortInfo: query.sort,
          })
        }
        const [sortField, sortInfo] = Object.entries(query.sort)[0]
        response = dataFilters.luceneSort(
          response,
          sortField,
          sortInfo.direction,
          sortInfo.type
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
      const sheet = this.client.sheetsByTitle[query.sheet]
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
          this.buildRowObject(sheet.headerValues, row._rawData, row._rowNumber),
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
    const sheet = this.client.sheetsByTitle[query.sheet]
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

export default {
  schema: SCHEMA,
  integration: GoogleSheetsIntegration,
}
