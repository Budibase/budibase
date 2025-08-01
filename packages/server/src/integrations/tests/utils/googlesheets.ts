// In this file is a mock implementation of the Google Sheets API.  It is used
// to test the Google Sheets integration, and it keeps track of a single
// spreadsheet with many sheets. It aims to be a faithful recreation of the
// Google Sheets API, but it is not a perfect recreation. Some fields are
// missing if they aren't relevant to our use of the API. It's possible that
// this will cause problems for future feature development, but the original
// development of these tests involved hitting Google's APIs directly and
// examining the responses. If we couldn't find a good example of something in
// use, it wasn't included.
import { Datasource } from "@budibase/types"
import nock from "nock"
import { GoogleSheetsConfig } from "../../googlesheets"
import type {
  SpreadsheetProperties,
  ExtendedValue,
  WorksheetDimension,
  WorksheetDimensionProperties,
  WorksheetProperties,
  WorksheetGridProperties,
  CellData,
  CellBorder,
  CellFormat,
  CellPadding,
  Color,
  GridRange,
  DataSourceSheetProperties,
} from "google-spreadsheet/src/lib/types/sheets-types"

const BLACK: Color = { red: 0, green: 0, blue: 0 }
const WHITE: Color = { red: 1, green: 1, blue: 1 }
const NO_PADDING: CellPadding = { top: 0, right: 0, bottom: 0, left: 0 }
const DEFAULT_BORDER: CellBorder = {
  style: "SOLID",
  width: 1,
  color: BLACK,
  colorStyle: { rgbColor: BLACK },
}
const DEFAULT_CELL_FORMAT: CellFormat = {
  hyperlinkDisplayType: "PLAIN_TEXT",
  horizontalAlignment: "LEFT",
  verticalAlignment: "BOTTOM",
  wrapStrategy: "OVERFLOW_CELL",
  textDirection: "LEFT_TO_RIGHT",
  textRotation: { angle: 0, vertical: false },
  padding: NO_PADDING,
  backgroundColorStyle: { rgbColor: BLACK },
  borders: {
    top: DEFAULT_BORDER,
    bottom: DEFAULT_BORDER,
    left: DEFAULT_BORDER,
    right: DEFAULT_BORDER,
  },
  numberFormat: {
    type: "NUMBER",
    pattern: "General",
  },
  backgroundColor: WHITE,
  textFormat: {
    foregroundColor: BLACK,
    fontFamily: "Arial",
    fontSize: 10,
    bold: false,
    italic: false,
    strikethrough: false,
    underline: false,
  },
}

// https://protobuf.dev/reference/protobuf/google.protobuf/#value
type Value = string | number | boolean | null

interface Range {
  row: number
  column: number
}

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values#ValueRange
interface ValueRange {
  range: string
  majorDimension: WorksheetDimension
  values: Value[][]
}

// https://developers.google.com/sheets/api/reference/rest/v4/UpdateValuesResponse
interface UpdateValuesResponse {
  spreadsheetId: string
  updatedRange: string
  updatedRows: number
  updatedColumns: number
  updatedCells: number
  updatedData: ValueRange
}

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#AddSheetRequest
interface AddSheetRequest {
  properties: Partial<WorksheetProperties>
}

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/response#AddSheetResponse
interface AddSheetResponse {
  properties: WorksheetProperties
}

// https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets/request#UpdateSheetPropertiesRequest
interface UpdateSheetPropertiesRequest {
  properties: Partial<WorksheetProperties>
  fields: string
}

interface DeleteRangeRequest {
  range: GridRange
  shiftDimension: WorksheetDimension
}

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request#DeleteSheetRequest
interface DeleteSheetRequest {
  sheetId: number
}

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/request
interface BatchUpdateRequest {
  requests: {
    addSheet?: AddSheetRequest
    deleteRange?: DeleteRangeRequest
    deleteSheet?: DeleteSheetRequest
    updateSheetProperties?: UpdateSheetPropertiesRequest
  }[]
  includeSpreadsheetInResponse: boolean
  responseRanges: string[]
  responseIncludeGridData: boolean
}

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/response
interface BatchUpdateResponse {
  spreadsheetId: string
  replies: {
    addSheet?: AddSheetResponse
  }[]
  updatedSpreadsheet: Spreadsheet
}

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/sheets#RowData
interface RowData {
  values: CellData[]
}

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/sheets#GridData
interface GridData {
  startRow: number
  startColumn: number
  rowData: RowData[]
  rowMetadata: WorksheetDimensionProperties[]
  columnMetadata: WorksheetDimensionProperties[]
}

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/sheets#Sheet
interface Sheet {
  properties: WorksheetProperties
  data: GridData[]
}

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets#Spreadsheet
interface Spreadsheet {
  properties: SpreadsheetProperties
  spreadsheetId: string
  sheets: Sheet[]
}

// https://developers.google.com/sheets/api/reference/rest/v4/ValueInputOption
type ValueInputOption =
  | "USER_ENTERED"
  | "RAW"
  | "INPUT_VALUE_OPTION_UNSPECIFIED"

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append#InsertDataOption
type InsertDataOption = "OVERWRITE" | "INSERT_ROWS"

// https://developers.google.com/sheets/api/reference/rest/v4/ValueRenderOption
type ValueRenderOption = "FORMATTED_VALUE" | "UNFORMATTED_VALUE" | "FORMULA"

// https://developers.google.com/sheets/api/reference/rest/v4/DateTimeRenderOption
type DateTimeRenderOption = "SERIAL_NUMBER" | "FORMATTED_STRING"

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append#query-parameters
interface AppendParams {
  valueInputOption?: ValueInputOption
  insertDataOption?: InsertDataOption
  includeValuesInResponse?: boolean
  responseValueRenderOption?: ValueRenderOption
  responseDateTimeRenderOption?: DateTimeRenderOption
}

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchGet#query-parameters
interface BatchGetParams {
  ranges: string[]
  majorDimension?: WorksheetDimension
  valueRenderOption?: ValueRenderOption
  dateTimeRenderOption?: DateTimeRenderOption
}

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchGet#response-body
interface BatchGetResponse {
  spreadsheetId: string
  valueRanges: ValueRange[]
}

interface AppendRequest {
  range: string
  params: AppendParams
  body: ValueRange
}

// https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append#response-body
interface AppendResponse {
  spreadsheetId: string
  tableRange: string
  updates: UpdateValuesResponse
}

export class GoogleSheetsMock {
  private config: GoogleSheetsConfig
  private spreadsheet: Spreadsheet

  static forDatasource(datasource: Datasource): GoogleSheetsMock {
    return new GoogleSheetsMock(datasource.config as GoogleSheetsConfig)
  }

  private constructor(config: GoogleSheetsConfig) {
    this.config = config
    this.spreadsheet = {
      properties: {
        title: "Test Spreadsheet",
        locale: "en_US",
        autoRecalc: "ON_CHANGE",
        timeZone: "America/New_York",
        defaultFormat: {},
        iterativeCalculationSettings: {},
        spreadsheetTheme: {},
      },
      spreadsheetId: config.spreadsheetId,
      sheets: [],
    }

    this.mockAuth()
    this.mockAPI()
  }

  public cell(cell: string): Value | undefined {
    const cellData = this.cellData(cell)
    if (!cellData) {
      return undefined
    }
    return this.cellValue(cellData)
  }

  public set(cell: string, value: Value): void {
    const cellData = this.cellData(cell)
    if (!cellData) {
      throw new Error(`Cell ${cell} not found`)
    }
    cellData.userEnteredValue = this.createValue(value)
  }

  public swapColumns(columnA: string, columnB: string): void {
    const rangeA = this.parseA1Notation(columnA)
    const rangeB = this.parseA1Notation(columnB)

    if (rangeA.sheetId !== rangeB.sheetId) {
      throw new Error("Cannot swap columns from different sheets")
    }

    const sheet = this.getSheetById(rangeA.sheetId)
    if (!sheet) {
      throw new Error(`Sheet ${rangeA.sheetId} not found`)
    }

    sheet.data[0].rowData.forEach(row => {
      const temp = row.values[rangeA.startColumnIndex]
      row.values[rangeA.startColumnIndex] = row.values[rangeB.startColumnIndex]
      row.values[rangeB.startColumnIndex] = temp
    })
  }

  public sheet(name: string | number): Sheet | undefined {
    if (typeof name === "number") {
      return this.getSheetById(name)
    }
    return this.getSheetByName(name)
  }

  public createSheet(opts: Partial<WorksheetProperties>): Sheet {
    const properties = this.defaultWorksheetProperties(opts)
    if (this.getSheetByName(properties.title)) {
      throw new Error(`Sheet ${properties.title} already exists`)
    }
    const resp = this.handleAddSheet({ properties })
    return this.getSheetById(resp.properties.sheetId)!
  }

  private route(
    method: "get" | "put" | "post",
    path: string | RegExp,
    handler: (uri: string, request: nock.Body) => nock.Body
  ): nock.Scope {
    const headers = { reqheaders: { authorization: "Bearer test" } }
    const scope = nock("https://sheets.googleapis.com/", headers)
    return scope[method](path).reply(200, handler).persist()
  }

  private get(
    path: string | RegExp,
    handler: (uri: string, request: nock.Body) => nock.Body
  ): nock.Scope {
    return this.route("get", path, handler)
  }

  private put(
    path: string | RegExp,
    handler: (uri: string, request: nock.Body) => nock.Body
  ): nock.Scope {
    return this.route("put", path, handler)
  }

  private post(
    path: string | RegExp,
    handler: (uri: string, request: nock.Body) => nock.Body
  ): nock.Scope {
    return this.route("post", path, handler)
  }

  private mockAuth() {
    nock("https://www.googleapis.com/")
      .post("/oauth2/v4/token")
      .reply(200, {
        grant_type: "client_credentials",
        client_id: "your-client-id",
        client_secret: "your-client-secret",
      })
      .persist()

    nock("https://oauth2.googleapis.com/")
      .post("/token", {
        client_id: "test",
        client_secret: "test",
        grant_type: "refresh_token",
        refresh_token: "refreshToken",
      })
      .reply(200, {
        access_token: "test",
        expires_in: 3600,
        token_type: "Bearer",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      })
      .persist()
  }

  private mockAPI() {
    const spreadsheetId = this.config.spreadsheetId

    this.get(`/v4/spreadsheets/${spreadsheetId}/`, () =>
      this.handleGetSpreadsheet()
    )

    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchUpdate
    this.post(
      `/v4/spreadsheets/${spreadsheetId}/:batchUpdate`,
      (_uri, request) => this.handleBatchUpdate(request as BatchUpdateRequest)
    )

    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/update
    this.put(
      new RegExp(`/v4/spreadsheets/${spreadsheetId}/values/.*`),
      (_uri, request) => this.handleValueUpdate(request as ValueRange)
    )

    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/batchGet
    this.get(
      new RegExp(`/v4/spreadsheets/${spreadsheetId}/values:batchGet.*`),
      uri => {
        const url = new URL(uri, "https://sheets.googleapis.com/")
        const params: BatchGetParams = {
          ranges: url.searchParams.getAll("ranges"),
          majorDimension:
            (url.searchParams.get("majorDimension") as WorksheetDimension) ||
            "ROWS",
          valueRenderOption:
            (url.searchParams.get("valueRenderOption") as ValueRenderOption) ||
            undefined,
          dateTimeRenderOption:
            (url.searchParams.get(
              "dateTimeRenderOption"
            ) as DateTimeRenderOption) || undefined,
        }
        return this.handleBatchGet(params as unknown as BatchGetParams)
      }
    )

    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/get
    this.get(new RegExp(`/v4/spreadsheets/${spreadsheetId}/values/.*`), uri => {
      const range = uri.split("/").pop()
      if (!range) {
        throw new Error("No range provided")
      }
      return this.getValueRange(decodeURIComponent(range))
    })

    // https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets.values/append
    this.post(
      new RegExp(`/v4/spreadsheets/${spreadsheetId}/values/.*:append`),
      (_uri, request) => {
        const url = new URL(_uri, "https://sheets.googleapis.com/")
        const params: Record<string, any> = Object.fromEntries(
          url.searchParams.entries()
        )

        if (params.includeValuesInResponse === "true") {
          params.includeValuesInResponse = true
        } else {
          params.includeValuesInResponse = false
        }

        let range = url.pathname.split("/").pop()
        if (!range) {
          throw new Error("No range provided")
        }

        if (range.endsWith(":append")) {
          range = range.slice(0, -7)
        }

        range = decodeURIComponent(range)

        return this.handleValueAppend({
          range,
          params,
          body: request as ValueRange,
        })
      }
    )
  }

  private handleValueAppend(request: AppendRequest): AppendResponse {
    const { range, params, body } = request
    const { sheetId, endRowIndex } = this.parseA1Notation(range)
    const sheet = this.getSheetById(sheetId)
    if (!sheet) {
      throw new Error(`Sheet ${sheetId} not found`)
    }

    // Ensure new rows have the same column count as the sheet
    const currentColumnCount = sheet.properties.gridProperties.columnCount
    const newRows = body.values.map(v => {
      const rowData = this.valuesToRowData(v)
      // Pad the row with empty cells if needed to match the sheet's column count
      while (rowData.values.length < currentColumnCount) {
        rowData.values.push(this.createCellData(null))
      }
      return rowData
    })

    const newMetadata = newRows.map(() => ({
      hiddenByUser: false,
      hiddenByFilter: false,
      pixelSize: 100,
      developerMetadata: [],
    }))
    const toDelete =
      params.insertDataOption === "INSERT_ROWS" ? newRows.length : 0
    sheet.data[0].rowData.splice(endRowIndex + 1, toDelete, ...newRows)
    sheet.data[0].rowMetadata.splice(endRowIndex + 1, toDelete, ...newMetadata)

    // It's important to give back a correct updated range because the API
    // library we use makes use of it to assign the correct row IDs to rows.
    const updatedRange = this.createA1({
      sheetId,
      startRowIndex: endRowIndex + 1,
      startColumnIndex: 0,
      endRowIndex: endRowIndex + newRows.length,
      endColumnIndex: 0,
    })

    sheet.properties.gridProperties.rowCount = sheet.data[0].rowData.length

    return {
      spreadsheetId: this.spreadsheet.spreadsheetId,
      tableRange: range,
      updates: {
        spreadsheetId: this.spreadsheet.spreadsheetId,
        updatedRange,
        updatedRows: body.values.length,
        updatedColumns: body.values[0].length,
        updatedCells: body.values.length * body.values[0].length,
        updatedData: body,
      },
    }
  }

  private handleBatchGet(params: BatchGetParams): BatchGetResponse {
    const { ranges, majorDimension } = params

    if (majorDimension && majorDimension !== "ROWS") {
      throw new Error("Only row-major updates are supported")
    }

    return {
      spreadsheetId: this.spreadsheet.spreadsheetId,
      valueRanges: ranges.map(range => this.getValueRange(range)),
    }
  }

  private handleBatchUpdate(
    batchUpdateRequest: BatchUpdateRequest
  ): BatchUpdateResponse {
    const response: BatchUpdateResponse = {
      spreadsheetId: this.spreadsheet.spreadsheetId,
      replies: [],
      updatedSpreadsheet: this.spreadsheet,
    }

    for (const request of batchUpdateRequest.requests) {
      if (request.addSheet) {
        response.replies.push({
          addSheet: this.handleAddSheet(request.addSheet),
        })
      }
      if (request.deleteRange) {
        this.handleDeleteRange(request.deleteRange)
        response.replies.push({})
      }
      if (request.deleteSheet) {
        this.handleDeleteSheet(request.deleteSheet)
        response.replies.push({})
      }
      if (request.updateSheetProperties) {
        this.handleUpdateSheetProperties(request.updateSheetProperties)
        response.replies.push({})
      }
    }

    return response
  }

  private defaultWorksheetProperties(
    opts: Partial<WorksheetProperties>
  ): WorksheetProperties {
    return {
      index: this.spreadsheet.sheets.length,
      hidden: false,
      rightToLeft: false,
      tabColor: BLACK,
      tabColorStyle: { rgbColor: BLACK },
      sheetType: "GRID",
      title: "Sheet",
      sheetId: this.spreadsheet.sheets.length,
      gridProperties: {
        rowCount: 5,
        columnCount: 5,
      },
      dataSourceSheetProperties: {} as DataSourceSheetProperties,
      ...opts,
    }
  }

  private handleAddSheet(request: AddSheetRequest): AddSheetResponse {
    const properties = this.defaultWorksheetProperties(request.properties)
    this.spreadsheet.sheets.push({
      properties,
      data: [
        this.createEmptyGrid(
          properties.gridProperties.rowCount,
          properties.gridProperties.columnCount
        ),
      ],
    })
    return { properties }
  }

  private handleDeleteRange(request: DeleteRangeRequest) {
    const { range, shiftDimension } = request

    if (shiftDimension !== "ROWS") {
      throw new Error("Only row-based deletes are supported")
    }

    const sheet = this.getSheetById(range.sheetId)
    if (!sheet) {
      throw new Error(`Sheet ${range.sheetId} not found`)
    }

    if (range.startRowIndex === undefined || range.endRowIndex === undefined) {
      throw new Error("Range must have start and end row indexes")
    }

    const totalRows = sheet.data[0].rowData.length
    if (totalRows < range.endRowIndex) {
      throw new Error(
        `Cannot delete range ${JSON.stringify(range)} from sheet ${
          sheet.properties.title
        }. Only ${totalRows} rows exist.`
      )
    }

    const rowsToDelete = range.endRowIndex - range.startRowIndex
    sheet.data[0].rowData.splice(range.startRowIndex, rowsToDelete)
    sheet.data[0].rowMetadata.splice(range.startRowIndex, rowsToDelete)
    sheet.properties.gridProperties.rowCount -= rowsToDelete
  }

  private handleDeleteSheet(request: DeleteSheetRequest) {
    const { sheetId } = request
    this.spreadsheet.sheets.splice(sheetId, 1)
  }

  private handleUpdateSheetProperties(request: UpdateSheetPropertiesRequest) {
    if (request.fields !== "gridProperties") {
      throw new Error(
        `Only 'gridProperties' field updates are supported, got: ${request.fields}`
      )
    }

    if (!request.properties || !request.properties.gridProperties) {
      throw new Error("No grid properties provided for update")
    }

    if (request.properties.sheetId === undefined) {
      throw new Error("No sheet ID provided for update")
    }

    this.resizeGrid(
      request.properties.sheetId,
      request.properties.gridProperties
    )
  }

  private resizeGrid(
    sheetId: number,
    newGridProperties: WorksheetGridProperties
  ) {
    const sheet = this.getSheetById(sheetId)
    if (!sheet) {
      throw new Error(`Sheet with ID ${sheetId} not found`)
    }

    const currentGridProperties = sheet.properties.gridProperties
    if (!newGridProperties) {
      throw new Error("No grid properties provided for update")
    }

    if (newGridProperties.rowCount !== undefined) {
      const diff = newGridProperties.rowCount - currentGridProperties.rowCount
      if (diff < 0) {
        this.removeRows(sheet, currentGridProperties.rowCount + diff, -diff)
      } else if (diff > 0) {
        this.addEmptyRows(sheet, diff)
      }
    }

    if (newGridProperties.columnCount !== undefined) {
      const diff =
        newGridProperties.columnCount - currentGridProperties.columnCount

      if (diff < 0) {
        this.removeColumns(
          sheet,
          currentGridProperties.columnCount + diff,
          -diff
        )
      } else if (diff > 0) {
        this.addEmptyColumns(sheet, diff)
      }
    }
  }

  private addEmptyRows(sheet: Sheet, count: number): void {
    const rowData = sheet.data[0].rowData
    const rowMetadata = sheet.data[0].rowMetadata

    const newRows = this.createEmptyRows(count, rowData[0].values.length)
    rowData.push(...newRows)

    const newMetadata = this.createDimensionMetadata(count)
    rowMetadata.push(...newMetadata)

    sheet.properties.gridProperties.rowCount += count
  }

  private removeRows(sheet: Sheet, startIndex: number, count: number): void {
    sheet.data[0].rowData.splice(startIndex, count)
    sheet.data[0].rowMetadata.splice(startIndex, count)
    sheet.properties.gridProperties.rowCount -= count
  }

  private addEmptyColumns(sheet: Sheet, count: number): void {
    for (const row of sheet.data[0].rowData) {
      row.values.push(...this.createEmptyCells(count))
    }

    const newMetadata = this.createDimensionMetadata(count)
    sheet.data[0].columnMetadata.push(...newMetadata)

    sheet.properties.gridProperties.columnCount += count
  }

  private removeColumns(sheet: Sheet, startIndex: number, count: number): void {
    for (const row of sheet.data[0].rowData) {
      row.values.splice(startIndex, count)
    }
    sheet.data[0].columnMetadata.splice(startIndex, count)
    sheet.properties.gridProperties.columnCount -= count
  }

  private handleGetSpreadsheet(): Spreadsheet {
    return this.spreadsheet
  }

  private handleValueUpdate(valueRange: ValueRange): UpdateValuesResponse {
    this.iterateValueRange(valueRange, (cell, value) => {
      cell.userEnteredValue = this.createValue(value)
    })

    const response: UpdateValuesResponse = {
      spreadsheetId: this.spreadsheet.spreadsheetId,
      updatedRange: valueRange.range,
      updatedRows: valueRange.values.length,
      updatedColumns: valueRange.values[0].length,
      updatedCells: valueRange.values.length * valueRange.values[0].length,
      updatedData: valueRange,
    }
    return response
  }

  private iterateValueRange(
    valueRange: ValueRange,
    cb: (cell: CellData, value: Value) => void
  ) {
    if (valueRange.majorDimension !== "ROWS") {
      throw new Error("Only row-major updates are supported")
    }

    const {
      sheetId,
      startColumnIndex,
      startRowIndex,
      endColumnIndex,
      endRowIndex,
    } = this.parseA1Notation(valueRange.range)

    for (let row = startRowIndex; row <= endRowIndex; row++) {
      for (let col = startColumnIndex; col <= endColumnIndex; col++) {
        const cell = this.getCellNumericIndexes(sheetId, row, col)
        if (!cell) {
          const sheet = this.getSheetById(sheetId)
          if (!sheet) {
            throw new Error(`Sheet ${sheetId} not found`)
          }
          const sheetRows = sheet.data[0].rowData.length
          const sheetCols = sheet.data[0].rowData[0].values.length
          throw new Error(
            `Failed to find cell at ${row}, ${col}. Range: ${valueRange.range}. Sheet dimensions: ${sheetRows}x${sheetCols}.`
          )
        }
        const value =
          valueRange.values[row - startRowIndex][col - startColumnIndex]
        cb(cell, value)
      }
    }
  }

  private getValueRange(range: string): ValueRange {
    const {
      sheetId,
      startRowIndex,
      endRowIndex,
      startColumnIndex,
      endColumnIndex,
    } = this.parseA1Notation(range)

    const sheet = this.getSheetById(sheetId)
    if (!sheet) {
      throw new Error(`Sheet ${sheetId} not found`)
    }

    const valueRange: ValueRange = {
      range,
      majorDimension: "ROWS",
      values: [],
    }

    const data = sheet.data[0]

    for (let row = startRowIndex; row <= endRowIndex; row++) {
      const values: Value[] = []
      const rowData = data.rowData[row]

      for (let col = startColumnIndex; col <= endColumnIndex; col++) {
        let cellValue: Value = null

        if (rowData && rowData.values && rowData.values[col]) {
          cellValue = this.cellValue(rowData.values[col])
        }

        values.push(cellValue)
      }

      valueRange.values.push(values)
    }

    const trimmed = this.trimValueRange(valueRange)
    return trimmed
  }

  private printValueRange(valueRange: ValueRange): string {
    if (!valueRange.values || valueRange.values.length === 0) {
      return `**Range:** ${valueRange.range}\n\n*No data*`
    }

    const values = valueRange.values

    // Find the maximum number of columns across all rows
    const maxCols = Math.max(...values.map(row => row.length))

    // Pad all rows to have the same number of columns
    const paddedValues = values.map(row => {
      const paddedRow = [...row]
      while (paddedRow.length < maxCols) {
        paddedRow.push("")
      }
      return paddedRow.map(cell => cell?.toString() || "")
    })

    // Create markdown table
    let table = `**Range:** ${valueRange.range}\n\n`

    if (paddedValues.length > 0) {
      // Header row (first row of data)
      const headerRow = paddedValues[0]
      table += "| " + headerRow.join(" | ") + " |\n"

      // Separator row
      table += "| " + headerRow.map(() => "---").join(" | ") + " |\n"

      // Data rows (remaining rows)
      for (let i = 1; i < paddedValues.length; i++) {
        table += "| " + paddedValues[i].join(" | ") + " |\n"
      }
    }

    return table
  }

  // When Google Sheets returns a value range, it will trim the data down to the
  // smallest possible size. It does all of the following:
  //
  // 1. Converts cells in non-empty rows up to the first value to empty strings.
  // 2. Removes all cells after the last non-empty cell in a row.
  // 3. Removes all rows after the last non-empty row.
  // 4. Rows that are before the first non-empty row that are empty are replaced with [].
  //
  // We replicate this behaviour here.
  private trimValueRange(valueRange: ValueRange): ValueRange {
    for (const row of valueRange.values) {
      if (row.every(v => v == null)) {
        row.splice(0, row.length)
        continue
      }

      let lastNonEmptyIndex = -1
      for (let i = row.length - 1; i >= 0; i--) {
        const cell = row[i]
        if (cell != null && cell !== "") {
          lastNonEmptyIndex = i
          break
        }
      }
      row.splice(lastNonEmptyIndex + 1)

      for (let i = 0; i < row.length; i++) {
        const cell = row[i]
        if (cell == null) {
          row[i] = ""
        } else {
          break
        }
      }
    }

    for (let i = valueRange.values.length - 1; i >= 0; i--) {
      const row = valueRange.values[i]
      if (row.length === 0) {
        valueRange.values.pop()
      } else {
        break
      }
    }

    return valueRange
  }

  private valuesToRowData(values: Value[]): RowData {
    return {
      values: values.map(v => {
        return this.createCellData(v)
      }),
    }
  }

  private unwrapValue(from: ExtendedValue): Value {
    if ("stringValue" in from) {
      return from.stringValue
    } else if ("numberValue" in from) {
      return from.numberValue
    } else if ("boolValue" in from) {
      return from.boolValue
    } else if ("formulaValue" in from) {
      return from.formulaValue
    } else {
      return null
    }
  }

  private cellValue(from: CellData): Value {
    return this.unwrapValue(from.userEnteredValue)
  }

  private createValue(from: Value): ExtendedValue {
    if (from == null) {
      return {} as ExtendedValue
    } else if (typeof from === "string") {
      return {
        stringValue: from,
      }
    } else if (typeof from === "number") {
      return {
        numberValue: from,
      }
    } else if (typeof from === "boolean") {
      return {
        boolValue: from,
      }
    } else {
      throw new Error("Unsupported value type")
    }
  }

  /**
   * Because the structure of a CellData is very nested and contains a lot of
   * extraneous formatting information, this function abstracts it away and just
   * lets you create a cell containing a given value.
   *
   * When you want to read the value back out, use {@link cellValue}.
   *
   * @param value value to store in the returned cell
   * @returns a CellData containing the given value. Read it back out with
   * {@link cellValue}
   */
  private createCellData(value: Value): CellData {
    return {
      userEnteredValue: this.createValue(value),
      effectiveValue: this.createValue(value),
      formattedValue: value?.toString() || "",
      userEnteredFormat: DEFAULT_CELL_FORMAT,
      effectiveFormat: DEFAULT_CELL_FORMAT,
    }
  }

  private createEmptyCells(cols: number): CellData[] {
    const cells: CellData[] = []
    for (let i = 0; i < cols; i++) {
      cells.push(this.createCellData(null))
    }
    return cells
  }

  private createEmptyRowData(cols: number): RowData {
    return { values: this.createEmptyCells(cols) }
  }

  private createEmptyRows(count: number, cols: number): RowData[] {
    const rows: RowData[] = []
    for (let i = 0; i < count; i++) {
      rows.push(this.createEmptyRowData(cols))
    }
    return rows
  }

  private createDimensionMetadata(
    count: number
  ): WorksheetDimensionProperties[] {
    const metadata: WorksheetDimensionProperties[] = []
    for (let i = 0; i < count; i++) {
      metadata.push({
        hiddenByFilter: false,
        hiddenByUser: false,
        pixelSize: 100,
        developerMetadata: [],
      })
    }
    return metadata
  }

  private createEmptyGrid(numRows: number, numCols: number): GridData {
    const rowData = this.createEmptyRows(numRows, numCols)
    const rowMetadata = this.createDimensionMetadata(numRows)
    const columnMetadata = this.createDimensionMetadata(numCols)
    return {
      startRow: 0,
      startColumn: 0,
      rowData,
      rowMetadata,
      columnMetadata,
    }
  }

  private cellData(cell: string): CellData | undefined {
    const { sheetId, startColumnIndex, startRowIndex } =
      this.parseA1Notation(cell)
    return this.getCellNumericIndexes(sheetId, startRowIndex, startColumnIndex)
  }

  private getCellNumericIndexes(
    sheet: Sheet | number,
    row: number,
    column: number
  ): CellData | undefined {
    if (typeof sheet === "number") {
      const foundSheet = this.getSheetById(sheet)
      if (!foundSheet) {
        return undefined
      }
      sheet = foundSheet
    }

    const data = sheet.data[0]
    const rowData = data.rowData[row]
    if (!rowData) {
      return undefined
    }
    const cell = rowData.values[column]
    if (!cell) {
      return undefined
    }
    return cell
  }

  // https://developers.google.com/sheets/api/guides/concepts#cell
  //
  // Examples from
  //   https://code.luasoftware.com/tutorials/google-sheets-api/google-sheets-api-range-parameter-a1-notation
  //
  //   "Sheet1!A1"     -> First cell on Row 1 Col 1
  //   "Sheet1!A1:C1"  -> Col 1-3 (A, B, C) on Row 1 = A1, B1, C1
  //   "A1"            -> First visible sheet (if sheet name is ommitted)
  //   "'My Sheet'!A1" -> If sheet name which contain space or start with a bracket.
  //   "Sheet1"        -> All cells in Sheet1.
  //   "Sheet1!A:A"    -> All cells on Col 1.
  //   "Sheet1!A:B"    -> All cells on Col 1 and 2.
  //   "Sheet1!1:1"    -> All cells on Row 1.
  //   "Sheet1!1:2"    -> All cells on Row 1 and 2.
  //
  // How that translates to our code below, omitting the `sheet` property:
  //
  //   "Sheet1!A1"     -> { topLeft: { row: 0, column: 0 }, bottomRight: { row: 0, column: 0 } }
  //   "Sheet1!A1:C1"  -> { topLeft: { row: 0, column: 0 }, bottomRight: { row: 0, column: 2 } }
  //   "A1"            -> { topLeft: { row: 0, column: 0 }, bottomRight: { row: 0, column: 0 } }
  //   "Sheet1"        -> { topLeft: { row: 0, column: 0 }, bottomRight: { row: 100, column: 25 } }
  //                    -> This is because we default to having a 100x26 grid.
  //   "Sheet1!A:A"    -> { topLeft: { row: 0, column: 0 }, bottomRight: { row: 99, column: 0 } }
  //   "Sheet1!A:B"    -> { topLeft: { row: 0, column: 0 }, bottomRight: { row: 99, column: 1 } }
  //   "Sheet1!1:1"    -> { topLeft: { row: 0, column: 0 }, bottomRight: { row: 0, column: 25 } }
  //   "Sheet1!1:2"    -> { topLeft: { row: 0, column: 0 }, bottomRight: { row: 1, column: 25 } }
  private parseA1Notation(range: string): Required<GridRange> {
    let sheet: Sheet
    let rest: string
    if (!range.includes("!")) {
      sheet = this.spreadsheet.sheets[0]
      rest = range
    } else {
      let sheetName = range.split("!")[0]
      if (sheetName.startsWith("'") && sheetName.endsWith("'")) {
        sheetName = sheetName.slice(1, -1)
      }
      const foundSheet = this.getSheetByName(sheetName)
      if (!foundSheet) {
        throw new Error(`Sheet ${sheetName} not found`)
      }
      sheet = foundSheet
      rest = range.split("!")[1]
    }

    const [topLeft, bottomRight] = rest.split(":")

    const parsedTopLeft = topLeft ? this.parseCell(topLeft) : undefined
    let parsedBottomRight = bottomRight
      ? this.parseCell(bottomRight)
      : undefined

    if (!parsedTopLeft && !parsedBottomRight) {
      throw new Error("No range provided")
    }

    if (!parsedTopLeft) {
      throw new Error("No top left cell provided")
    }

    if (!parsedBottomRight) {
      parsedBottomRight = parsedTopLeft
    }

    return this.ensureGridRange({
      sheetId: sheet.properties.sheetId,
      startRowIndex: parsedTopLeft.row,
      endRowIndex: parsedBottomRight.row,
      startColumnIndex: parsedTopLeft.column,
      endColumnIndex: parsedBottomRight.column,
    })
  }

  private ensureGridRange(range: GridRange): Required<GridRange> {
    const sheet = this.getSheetById(range.sheetId)
    if (!sheet) {
      throw new Error(`Sheet ${range.sheetId} not found`)
    }

    return {
      sheetId: range.sheetId,
      startRowIndex: range.startRowIndex ?? 0,
      endRowIndex:
        range.endRowIndex ?? sheet.properties.gridProperties.rowCount - 1,
      startColumnIndex: range.startColumnIndex ?? 0,
      endColumnIndex:
        range.endColumnIndex ?? sheet.properties.gridProperties.columnCount - 1,
    }
  }

  private createA1(range: Required<GridRange>) {
    const {
      sheetId,
      startColumnIndex,
      startRowIndex,
      endColumnIndex,
      endRowIndex,
    } = range

    const sheet = this.getSheetById(sheetId)
    if (!sheet) {
      throw new Error(`Sheet ${range.sheetId} not found`)
    }

    let title = sheet.properties.title
    if (title.includes(" ")) {
      title = `'${title}'`
    }
    const topLeftLetters = this.numberToLetters(startColumnIndex)
    const bottomRightLetters = this.numberToLetters(endColumnIndex)
    const topLeftRow = startRowIndex + 1
    const bottomRightRow = endRowIndex + 1
    return `${title}!${topLeftLetters}${topLeftRow}:${bottomRightLetters}${bottomRightRow}`
  }

  private parseCell(cell: string): Partial<Range> {
    // Check if the cell starts with a number (row-only reference like "1")
    const firstChar = cell.slice(0, 1)
    if (this.isInteger(firstChar)) {
      return { row: parseInt(cell) - 1 }
    }

    // Find where the letters end and numbers begin
    let letterEnd = 0
    for (let i = 0; i < cell.length; i++) {
      if (this.isInteger(cell[i])) {
        break
      }
      letterEnd = i + 1
    }

    // Extract the column letters
    const columnLetters = cell.slice(0, letterEnd)
    const column = this.lettersToNumber(columnLetters)

    // If there's no number part, it's a column-only reference
    if (letterEnd === cell.length) {
      return { column }
    }

    // Extract and parse the row number
    const number = cell.slice(letterEnd)
    return { row: parseInt(number) - 1, column }
  }

  private lettersToNumber(letters: string): number {
    let result = 0
    for (let i = 0; i < letters.length; i++) {
      result = result * 26 + (letters.charCodeAt(i) - 64)
    }
    return result - 1 // Convert to 0-based indexing
  }

  private numberToLetters(number: number): string {
    let result = ""
    number = number + 1 // Convert from 0-based to 1-based

    while (number > 0) {
      number--
      result = String.fromCharCode((number % 26) + 65) + result
      number = Math.floor(number / 26)
    }

    return result
  }

  private isInteger(value: string): boolean {
    return !isNaN(parseInt(value))
  }

  private getSheetByName(name: string): Sheet | undefined {
    return this.spreadsheet.sheets.find(
      sheet => sheet.properties.title === name
    )
  }

  private getSheetById(id: number): Sheet | undefined {
    return this.spreadsheet.sheets.find(
      sheet => sheet.properties.sheetId === id
    )
  }
}
