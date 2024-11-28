import {
  ConnectionInfo,
  DatasourceFeature,
  DatasourceFieldType,
  DatasourcePlus,
  FieldType,
  Integration,
  Operation,
  PaginationJson,
  QueryType,
  Row,
  Schema,
  SearchFilters,
  SortJson,
  Table,
  TableRequest,
  TableSourceType,
  DatasourcePlusQueryResponse,
  BBReferenceFieldSubType,
  EnrichedQueryJson,
} from "@budibase/types"
import { OAuth2Client } from "google-auth-library"
import {
  buildExternalTableId,
  checkExternalTables,
  finaliseExternalTables,
} from "./utils"
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet"
import fetch from "node-fetch"
import { cache, configs, context, HTTPError } from "@budibase/backend-core"
import { dataFilters, utils } from "@budibase/shared-core"
import { GOOGLE_SHEETS_PRIMARY_KEY } from "../constants"

export interface GoogleSheetsConfig {
  spreadsheetId: string
  auth: OAuthClientConfig
  continueSetupId?: string
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

const isTypeAllowed: Record<FieldType, boolean> = {
  [FieldType.STRING]: true,
  [FieldType.FORMULA]: true,
  [FieldType.AI]: true,
  [FieldType.NUMBER]: true,
  [FieldType.LONGFORM]: true,
  [FieldType.DATETIME]: true,
  [FieldType.OPTIONS]: true,
  [FieldType.BOOLEAN]: true,
  [FieldType.BARCODEQR]: true,
  [FieldType.BB_REFERENCE]: true,
  [FieldType.BB_REFERENCE_SINGLE]: true,
  [FieldType.ARRAY]: false,
  [FieldType.ATTACHMENTS]: false,
  [FieldType.ATTACHMENT_SINGLE]: false,
  [FieldType.LINK]: false,
  [FieldType.AUTO]: false,
  [FieldType.JSON]: false,
  [FieldType.INTERNAL]: false,
  [FieldType.BIGINT]: false,
  [FieldType.SIGNATURE_SINGLE]: false,
}

const ALLOWED_TYPES = Object.entries(isTypeAllowed)
  .filter(([_, allowed]) => allowed)
  .map(([type]) => type as FieldType)

const SCHEMA: Integration = {
  plus: true,
  auth: {
    type: "google",
  },
  relationships: false,
  docs: "https://developers.google.com/sheets/api/quickstart/nodejs",
  description:
    "Create and collaborate on online spreadsheets in real-time and from any device.",
  friendlyName: "Google Sheets",
  type: "Spreadsheet",
  features: {
    [DatasourceFeature.CONNECTION_CHECKING]: true,
    [DatasourceFeature.FETCH_TABLE_NAMES]: true,
  },
  datasource: {
    spreadsheetId: {
      display: "Spreadsheet URL",
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

export class GoogleSheetsIntegration implements DatasourcePlus {
  private readonly config: GoogleSheetsConfig
  private readonly spreadsheetId: string
  private client: GoogleSpreadsheet = undefined!

  constructor(config: GoogleSheetsConfig) {
    this.config = config
    this.spreadsheetId = this.cleanSpreadsheetUrl(this.config.spreadsheetId)
  }

  async testConnection(): Promise<ConnectionInfo> {
    try {
      await this.connect()
      return { connected: true }
    } catch (e: any) {
      return {
        connected: false,
        error: e.message as string,
      }
    }
  }

  getBindingIdentifier() {
    return ""
  }

  getStringConcat(_parts: string[]) {
    return ""
  }

  /**
   * Pull the spreadsheet ID out from a valid google sheets URL
   * @param spreadsheetId - the URL or standard spreadsheetId of the google sheet
   * @returns spreadsheet Id of the google sheet
   */
  private cleanSpreadsheetUrl(spreadsheetId: string) {
    if (!spreadsheetId) {
      throw new Error(
        "You must set a spreadsheet ID in your configuration to fetch tables."
      )
    }
    const parts = spreadsheetId.split("/")
    return parts.length > 5 ? parts[5] : spreadsheetId
  }

  private async fetchAccessToken(
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

  private async connect() {
    try {
      const bbCtx = context.getCurrentContext()
      let oauthClient = bbCtx?.googleSheets?.oauthClient

      if (!oauthClient) {
        await setupCreationAuth(this.config)

        // Initialise oAuth client
        const googleConfig = await configs.getGoogleDatasourceConfig()
        if (!googleConfig) {
          throw new HTTPError("Google config not found", 400)
        }

        oauthClient = new OAuth2Client({
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
        if (bbCtx && !bbCtx.googleSheets) {
          bbCtx.googleSheets = {
            oauthClient,
            clients: {},
          }
          bbCtx.cleanup = bbCtx.cleanup || []
        }
      }

      let client = bbCtx?.googleSheets?.clients[this.spreadsheetId]
      if (!client) {
        client = new GoogleSpreadsheet(this.spreadsheetId, oauthClient)
        await client.loadInfo()

        if (bbCtx?.googleSheets?.clients) {
          bbCtx.googleSheets.clients[this.spreadsheetId] = client
        }
      }

      this.client = client
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

  async getTableNames(): Promise<string[]> {
    await this.connect()
    const sheets = this.client.sheetsByIndex
    return sheets.map(s => s.title)
  }

  private getTableSchema(
    title: string,
    headerValues: string[],
    datasourceId: string,
    id?: string
  ) {
    // base table
    const table: Table = {
      type: "table",
      name: title,
      primary: [GOOGLE_SHEETS_PRIMARY_KEY],
      schema: {},
      sourceId: datasourceId,
      sourceType: TableSourceType.EXTERNAL,
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

  async buildSchema(
    datasourceId: string,
    entities: Record<string, Table>
  ): Promise<Schema> {
    // not fully configured yet
    if (!this.config.auth) {
      return { tables: {}, errors: {} }
    }
    await this.connect()

    const sheets = this.client.sheetsByIndex
    const tables: Record<string, Table> = {}
    let errors: Record<string, string> = {}

    await utils.parallelForeach(
      sheets,
      async sheet => {
        try {
          await sheet.getRows({ limit: 1 })
        } catch (err) {
          // We expect this to always be an Error so if it's not, rethrow it to
          // make sure we don't fail quietly.
          if (!(err instanceof Error)) {
            throw err
          }

          if (
            err.message.startsWith("No values in the header row") ||
            err.message.startsWith("All your header cells are blank")
          ) {
            errors[
              sheet.title
            ] = `Failed to find a header row in sheet "${sheet.title}", is the first row blank?`
            return
          }

          // If we get an error we don't expect, rethrow to avoid failing
          // quietly.
          throw err
        }
      },
      10
    )

    for (const sheet of sheets) {
      const id = buildExternalTableId(datasourceId, sheet.title)
      tables[sheet.title] = this.getTableSchema(
        sheet.title,
        sheet.headerValues,
        datasourceId,
        id
      )
    }

    let externalTables = finaliseExternalTables(tables, entities)
    errors = { ...errors, ...checkExternalTables(externalTables) }
    return { tables: externalTables, errors }
  }

  async query(json: EnrichedQueryJson): Promise<DatasourcePlusQueryResponse> {
    const sheet = json.table.name
    switch (json.operation) {
      case Operation.CREATE:
        return this.create({ sheet, row: json.body as Row })
      case Operation.BULK_CREATE:
        return this.createBulk({ sheet, rows: json.body as Row[] })
      case Operation.BULK_UPSERT:
        // This is technically not correct because it won't update existing
        // rows, but it's better than not having this functionality at all.
        return this.createBulk({ sheet, rows: json.body as Row[] })
      case Operation.READ:
        return this.read({ ...json, sheet })
      case Operation.UPDATE:
        return this.update({
          // exclude the header row and zero index
          rowIndex: json.extra?.idFilter?.equal?.rowNumber,
          sheet,
          row: json.body,
          table: json.table,
        })
      case Operation.DELETE:
        return this.delete({
          // exclude the header row and zero index
          rowIndex: json.extra?.idFilter?.equal?.rowNumber,
          sheet,
        })
      case Operation.CREATE_TABLE:
        if (!json.table) {
          throw new Error(
            "attempted to create a table without specifying the table to create"
          )
        }
        return this.createTable(json.table)
      case Operation.UPDATE_TABLE:
        if (!json.table) {
          throw new Error(
            "attempted to create a table without specifying the table to create"
          )
        }
        return this.updateTable(json.table)
      case Operation.DELETE_TABLE:
        return this.deleteTable(json?.table?.name)
      default:
        throw new Error(
          `GSheets integration does not support "${json.operation}".`
        )
    }
  }

  private buildRowObject(
    headers: string[],
    values: Record<string, string>,
    rowNumber: number
  ) {
    const rowObject: { rowNumber: number } & Row = {
      rowNumber,
      _id: rowNumber.toString(),
    }
    for (let i = 0; i < headers.length; i++) {
      rowObject[headers[i]] = values[headers[i]]
    }
    return rowObject
  }

  private async createTable(table: Table) {
    try {
      await this.connect()
      await this.client.addSheet({
        title: table.name,
        headerValues: Object.keys(table.schema),
      })
    } catch (err) {
      console.error("Error creating new table in google sheets", err)
      throw err
    }
  }

  private async updateTable(table: TableRequest) {
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
          column.type !== FieldType.FORMULA &&
          column.type !== FieldType.AI
        ) {
          updatedHeaderValues.push(key)
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

  private async deleteTable(sheet: any) {
    try {
      await this.connect()
      const sheetToDelete = this.client.sheetsByTitle[sheet]
      await sheetToDelete.delete()
    } catch (err) {
      console.error("Error deleting table in google sheets", err)
      throw err
    }
  }

  async create(query: { sheet: string; row: Row }) {
    try {
      await this.connect()
      const sheet = this.client.sheetsByTitle[query.sheet]
      const rowToInsert =
        typeof query.row === "string" ? JSON.parse(query.row) : query.row
      const row = await sheet.addRow(rowToInsert)
      return [
        this.buildRowObject(sheet.headerValues, row.toObject(), row.rowNumber),
      ]
    } catch (err) {
      console.error("Error writing to google sheets", err)
      throw err
    }
  }

  private async createBulk(query: { sheet: string; rows: Row[] }) {
    try {
      await this.connect()
      const sheet = this.client.sheetsByTitle[query.sheet]
      let rowsToInsert = []
      for (let row of query.rows) {
        rowsToInsert.push(typeof row === "string" ? JSON.parse(row) : row)
      }
      const rows = await sheet.addRows(rowsToInsert)
      return rows.map(row =>
        this.buildRowObject(sheet.headerValues, row.toObject(), row.rowNumber)
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
      const hasFilters = dataFilters.hasFilters(query.filters)
      const limit = query.paginate?.limit || 100
      let offset = query.paginate?.offset || 0

      let page = query.paginate?.page
      if (typeof page === "string") {
        page = parseInt(page)
      }
      if (page !== undefined) {
        offset = page * limit
      }

      const sheet = this.client.sheetsByTitle[query.sheet]
      let rows: GoogleSpreadsheetRow[] = []
      if (query.paginate && !hasFilters) {
        rows = await sheet.getRows({
          limit,
          offset,
        })
      } else {
        rows = await sheet.getRows()
      }

      let response = rows.map(row =>
        this.buildRowObject(sheet.headerValues, row.toObject(), row.rowNumber)
      )
      response = dataFilters.runQuery(response, query.filters || {})

      if (hasFilters && query.paginate) {
        response = response.slice(offset, offset + limit)
      }

      if (query.sort) {
        if (Object.keys(query.sort).length !== 1) {
          console.warn("Googlesheets does not support multiple sorting", {
            sortInfo: query.sort,
          })
        }
        const [sortField, sortInfo] = Object.entries(query.sort)[0]
        response = dataFilters.sort(
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

  private async getRowByIndex(sheetTitle: string, rowIndex: number) {
    const sheet = this.client.sheetsByTitle[sheetTitle]
    const rows = await sheet.getRows()
    // We substract 2, as the SDK is skipping the header automatically and Google Spreadsheets is base 1
    const row = rows[rowIndex - 2]
    return { sheet, row }
  }

  async update(query: {
    sheet: string
    rowIndex: number
    row: any
    table: Table
  }) {
    try {
      await this.connect()
      const { sheet, row } = await this.getRowByIndex(
        query.sheet,
        query.rowIndex
      )
      if (row) {
        const updateValues =
          typeof query.row === "string" ? JSON.parse(query.row) : query.row
        for (let key in updateValues) {
          row.set(key, updateValues[key])

          if (row.get(key) === null) {
            row.set(key, "")
          }

          const { type, subtype, constraints } = query.table.schema[key]
          const isDeprecatedSingleUser =
            type === FieldType.BB_REFERENCE &&
            subtype === BBReferenceFieldSubType.USER &&
            constraints?.type !== "array"
          if (isDeprecatedSingleUser && Array.isArray(row.get(key))) {
            row.set(key, row.get(key)[0])
          }
        }
        await row.save()
        return [
          this.buildRowObject(
            sheet.headerValues,
            row.toObject(),
            row.rowNumber
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
    const { row } = await this.getRowByIndex(query.sheet, query.rowIndex)
    if (row) {
      await row.delete()
      return [
        {
          deleted: query.rowIndex,
          [GOOGLE_SHEETS_PRIMARY_KEY]: query.rowIndex,
        },
      ]
    } else {
      throw new Error("Row does not exist.")
    }
  }
}

export async function setupCreationAuth(datasouce: GoogleSheetsConfig) {
  if (datasouce.continueSetupId) {
    const appId = context.getAppId()
    const tokens = await cache.get(
      `datasource:creation:${appId}:google:${datasouce.continueSetupId}`
    )

    datasouce.auth = tokens.tokens
    delete datasouce.continueSetupId
  }
}

export default {
  schema: SCHEMA,
  integration: GoogleSheetsIntegration,
}
