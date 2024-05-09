import {
  ConnectionInfo,
  DatasourceFeature,
  DatasourceFieldType,
  DatasourcePlus,
  FieldType,
  Integration,
  Operation,
  PaginationJson,
  QueryJson,
  QueryType,
  Row,
  Schema,
  SearchFilters,
  SortJson,
  Table,
  TableRequest,
  TableSourceType,
  DatasourcePlusQueryResponse,
} from "@budibase/types"
import {
  buildExternalTableId,
  checkExternalTables,
  finaliseExternalTables,
} from "./utils"
// import { GoogleSpreadsheet, GoogleSpreadsheetRow } from "google-spreadsheet"
import { google } from "googleapis"
import { OAuth2Client } from "googleapis-common"
import fetch from "node-fetch"
import { cache, configs, context, HTTPError } from "@budibase/backend-core"
import { dataFilters, utils } from "@budibase/shared-core"
import { GOOGLE_SHEETS_PRIMARY_KEY } from "../constants"

interface GoogleSheetsConfig {
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

const ALLOWED_TYPES = [
  FieldType.STRING,
  FieldType.FORMULA,
  FieldType.NUMBER,
  FieldType.LONGFORM,
  FieldType.DATETIME,
  FieldType.OPTIONS,
  FieldType.BOOLEAN,
  FieldType.BARCODEQR,
  FieldType.BB_REFERENCE,
]

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

class GoogleSheetsIntegration implements DatasourcePlus {
  private readonly config: GoogleSheetsConfig
  // private client: sheets_v4.Schema$Spreadsheet = undefined!
  private spreadsheetId: string

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
      await setupCreationAuth(this.config)

      // Initialise oAuth client
      const googleConfig = await configs.getGoogleDatasourceConfig()
      if (!googleConfig) {
        throw new HTTPError("Google config not found", 400)
      }

      const oauthClient = new google.auth.OAuth2({
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

      // this.client = new GoogleSpreadsheet(this.spreadsheetId, oauthClient)
      // this.client = (
      //   await google
      //     .sheets("v4")
      //     .spreadsheets.get({ spreadsheetId: this.spreadsheetId })
      // ).data
      // this.client.use(oauthClient)
      // await this.client.loadInfo()
      return oauthClient
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
    const sheets = this.client.sheets!
    return sheets.map(s => s.properties!.title!)
  }

  getTableSchema(
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
    const sheets = this.client.sheets!
    const tables: Record<string, Table> = {}
    let errors: Record<string, string> = {}
    await utils.parallelForeach(
      sheets,
      async sheet => {
        // must fetch rows to determine schema
        try {
          sheet.rowGroups
        } catch (err) {
          // We expect this to always be an Error so if it's not, rethrow it to
          // make sure we don't fail quietly.
          if (!(err instanceof Error)) {
            throw err
          }

          if (err.message.startsWith("No values in the header row")) {
            errors[sheet.title] = err.message
          } else {
            // If we get an error we don't expect, rethrow to avoid failing
            // quietly.
            throw err
          }
          return
        }

        const id = buildExternalTableId(datasourceId, sheet.title)
        tables[sheet.title] = this.getTableSchema(
          sheet.title,
          sheet.headerValues,
          datasourceId,
          id
        )
      },
      10
    )
    let externalTables = finaliseExternalTables(tables, entities)
    errors = { ...errors, ...checkExternalTables(externalTables) }
    return { tables: externalTables, errors }
  }

  async query(json: QueryJson): Promise<DatasourcePlusQueryResponse> {
    const sheet = json.endpoint.entityId

    const columnCount = Object.keys(json.meta.table.schema).length
    const rangeLimit = this.getAlphabetCharacter(columnCount)

    switch (json.endpoint.operation) {
      case Operation.CREATE:
        return this.create({ sheet, row: json.body as Row })
      case Operation.BULK_CREATE:
        return this.createBulk({ sheet, rows: json.body as Row[] })
      case Operation.READ:
        return this.read({ ...json, sheet, rangeLimit })
      case Operation.UPDATE:
        return this.update({
          // exclude the header row and zero index
          rowIndex: json.extra?.idFilter?.equal?.rowNumber,
          sheet,
          row: json.body,
          rangeLimit,
        })
      case Operation.DELETE:
        return this.delete({
          // exclude the header row and zero index
          rowIndex: json.extra?.idFilter?.equal?.rowNumber,
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
      const auth = await this.connect()
      await google.sheets("v4").spreadsheets.batchUpdate({
        auth,
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: name,
                },
              },
            },
          ],
        },
      })

      await google.sheets("v4").spreadsheets.values.update({
        auth,
        spreadsheetId: this.spreadsheetId,
        range: `${name}!A1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [[name]],
        },
      })
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
      await sheetToDelete.delete()
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
        this.buildRowObject(
          sheet.headerValues,
          row.toObject() as any,
          row.rowNumber
        ),
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
        this.buildRowObject(
          sheet.headerValues,
          row.toObject() as any,
          row.rowNumber
        )
      )
    } catch (err) {
      console.error("Error bulk writing to google sheets", err)
      throw err
    }
  }

  private getAlphabetCharacter(number: number) {
    let result = ""
    const alphabetLength = 26

    while (number > 0) {
      const remainder = (number - 1) % alphabetLength
      result = String.fromCharCode(65 + remainder) + result
      number = Math.floor((number - 1) / alphabetLength)
    }

    return result
  }

  async read(query: {
    sheet: string
    filters?: SearchFilters
    sort?: SortJson
    paginate?: PaginationJson
    rangeLimit: string
  }) {
    try {
      const auth = await this.connect()
      const hasFilters = dataFilters.hasFilters(query.filters)
      const limit = query.paginate?.limit || 100
      const page: number =
        typeof query.paginate?.page === "number"
          ? query.paginate.page
          : parseInt(query.paginate?.page || "1")
      const offset = (page - 1) * limit

      let range = query.sheet
      if (query.paginate && !hasFilters) {
        range = `${query.sheet}!A${2 + offset}:${query.rangeLimit}${
          1 + offset + limit
        }`
      } else {
        range = `${query.sheet}!A:${query.rangeLimit}`
      }
      const getResponse = await google
        .sheets("v4")
        .spreadsheets.values.batchGet({
          auth,
          spreadsheetId: this.spreadsheetId,
          ranges: [`${query.sheet}!A1:${query.rangeLimit}1`, range],
        })

      const [headers] = getResponse.data!.valueRanges![0].values!

      let rowNumber = offset
      const rows =
        getResponse.data!.valueRanges![1].values?.map(r =>
          this.buildRowObject(headers, r, rowNumber++)
        ) || []

      // this is a special case - need to handle the _id, it doesn't exist
      // we cannot edit the returned structure from google, it does not have
      // setter functions and is immutable, easier to update the filters
      // to look for the _rowNumber property rather than rowNumber
      if (query.filters?.equal) {
        const idFilterKeys = Object.keys(query.filters.equal).filter(filter =>
          filter.includes(GOOGLE_SHEETS_PRIMARY_KEY)
        )
        for (let idFilterKey of idFilterKeys) {
          const id = query.filters.equal[idFilterKey]
          delete query.filters.equal[idFilterKey]
          query.filters.equal[`_id`] = id
        }
      }

      let response = dataFilters.runLuceneQuery(rows, query.filters)
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

  private async getRowByIndex(
    auth: OAuth2Client,
    sheetTitle: string,
    rowIndex: number,
    rangeLimit: string
  ) {
    const res = await google.sheets("v4").spreadsheets.values.batchGet({
      auth,
      spreadsheetId: this.spreadsheetId,
      ranges: [
        `${sheetTitle}!A1:${rangeLimit}1`,
        `${sheetTitle}!A${rowIndex + 2}:${rangeLimit}${rowIndex + 2}`,
      ],
    })

    const [headers, row] = res?.data.valueRanges || []
    return { headers, row }
  }

  async update(query: {
    sheet: string
    rowIndex: number
    row: any
    rangeLimit: string
  }) {
    try {
      const auth = await this.connect()

      const { data: headers } = await google
        .sheets("v4")
        .spreadsheets.values.get({
          auth,
          spreadsheetId: this.spreadsheetId,
          range: `${query.sheet}!A1:${query.rangeLimit}1`,
        })

      const updateValues =
        typeof query.row === "string" ? JSON.parse(query.row) : query.row

      const valuesArray = []
      for (const column of headers.values![0]) {
        valuesArray.push(updateValues[column])
      }

      await google.sheets("v4").spreadsheets.values.update({
        includeValuesInResponse: true,
        auth,
        spreadsheetId: this.spreadsheetId,
        range: `${query.sheet}!A${query.rowIndex + 2}:${query.rangeLimit}${
          query.rowIndex + 2
        }`,
        valueInputOption: "RAW",
        requestBody: { values: [valuesArray] },
      })

      return [{ ...query.row, rowNumber: query.rowIndex }]
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
