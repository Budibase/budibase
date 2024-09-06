import { Datasource } from "@budibase/types"
import nock from "nock"
import { GoogleSheetsConfig } from "../../googlesheets"

type Value = string | number | boolean
type Dimension = "ROWS" | "COLUMNS"

interface Range {
  row: number | "ALL"
  column: number | "ALL"
}

interface DimensionProperties {
  hiddenByFilter: boolean
  hiddenByUser: boolean
  pixelSize: number
  // developerMetadata: DeveloperMetadata[]
  // dataSourceColumnReference: DataSourceColumnReference
}

interface ValueRange {
  range: string
  majorDimension: Dimension
  values: Value[][]
}

interface UpdateValuesResponse {
  spreadsheetId: string
  updatedRange: string
  updatedRows: number
  updatedColumns: number
  updatedCells: number
  updatedData: ValueRange
}

interface AddSheetResponse {
  properties: SheetProperties
}

interface Response {
  addSheet?: AddSheetResponse
}

interface BatchUpdateResponse {
  spreadsheetId: string
  replies: Response[]
  updatedSpreadsheet: Spreadsheet
}

interface GridProperties {
  rowCount: number
  columnCount: number
  frozenRowCount: number
  frozenColumnCount: number
  hideGridlines: boolean
  rowGroupControlAfter: boolean
  columnGroupControlAfter: boolean
}

interface SheetProperties {
  sheetId: number
  title: string
  gridProperties: GridProperties
}

interface AddSheetRequest {
  properties: SheetProperties
}

interface Request {
  addSheet?: AddSheetRequest
}

interface BatchUpdateRequest {
  requests: Request[]
  includeSpreadsheetInResponse: boolean
  responseRanges: string[]
  responseIncludeGridData: boolean
}

interface ErrorValue {
  type: string
  message: string
}

interface ExtendedValue {
  stringValue?: string
  numberValue?: number
  boolValue?: boolean
  formulaValue?: string
  errorValue?: ErrorValue
}

interface CellData {
  userEnteredValue: ExtendedValue
}

interface RowData {
  values: CellData[]
}

interface GridData {
  startRow: number
  startColumn: number
  rowData: RowData[]
  rowMetadata: DimensionProperties[]
  columnMetadata: DimensionProperties[]
}

interface Sheet {
  properties: SheetProperties
  data: GridData[]
}

interface SpreadsheetProperties {
  title: string
}

interface Spreadsheet {
  properties: SpreadsheetProperties
  spreadsheetId: string
  sheets: Sheet[]
}

export class GoogleSheetsMock {
  private config: GoogleSheetsConfig
  private sheet: Spreadsheet

  static forDatasource(datasource: Datasource): GoogleSheetsMock {
    return new GoogleSheetsMock(datasource.config as GoogleSheetsConfig)
  }

  private constructor(config: GoogleSheetsConfig) {
    this.config = config
    this.sheet = {
      properties: {
        title: "Test Spreadsheet",
      },
      spreadsheetId: config.spreadsheetId,
      sheets: [],
    }
  }

  init() {
    nock("https://www.googleapis.com/").post("/oauth2/v4/token").reply(200, {
      grant_type: "client_credentials",
      client_id: "your-client-id",
      client_secret: "your-client-secret",
    })
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

    nock("https://sheets.googleapis.com/", {
      reqheaders: { authorization: "Bearer test" },
    })
      .get("/v4/spreadsheets/randomId/")
      .reply(200, () => this.sheet)
      .persist()

    nock("https://sheets.googleapis.com/", {
      reqheaders: { authorization: "Bearer test" },
    })
      .post(`/v4/spreadsheets/${this.config.spreadsheetId}/:batchUpdate`)
      .reply(200, (uri: string, request: nock.Body): nock.Body => {
        const batchUpdateRequest = request as BatchUpdateRequest
        const replies: Response[] = []

        for (const request of batchUpdateRequest.requests) {
          if (request.addSheet) {
            const properties: SheetProperties = {
              title: request.addSheet.properties.title,
              sheetId: this.sheet.sheets.length,
              gridProperties: {
                rowCount: 100,
                columnCount: 26,
                frozenRowCount: 0,
                frozenColumnCount: 0,
                hideGridlines: false,
                rowGroupControlAfter: false,
                columnGroupControlAfter: false,
              },
            }

            this.sheet.sheets.push({
              properties,
              data: [this.createEmptyGrid(100, 26)],
            })

            replies.push({ addSheet: { properties } })
          }
        }

        const response: BatchUpdateResponse = {
          spreadsheetId: this.sheet.spreadsheetId,
          replies,
          updatedSpreadsheet: this.sheet,
        }
        return response
      })
      .persist()

    nock("https://sheets.googleapis.com/", {
      reqheaders: { authorization: "Bearer test" },
    })
      .put(
        new RegExp(`/v4/spreadsheets/${this.config.spreadsheetId}/values/.*`)
      )
      .reply(200, (uri, request) =>
        this.handleValueUpdate(request as ValueRange)
      )
  }

  private handleValueUpdate(valueRange: ValueRange): UpdateValuesResponse {
    if (valueRange.majorDimension !== "ROWS") {
      throw new Error("Only row-major updates are supported")
    }

    const { sheet, topLeft, bottomRight } = this.parseA1Notation(
      valueRange.range
    )

    if (topLeft.row === "ALL") {
      topLeft.row = 0
    }
    if (bottomRight.row === "ALL") {
      bottomRight.row = sheet.properties.gridProperties.rowCount - 1
    }
    if (topLeft.column === "ALL") {
      topLeft.column = 0
    }
    if (bottomRight.column === "ALL") {
      bottomRight.column = sheet.properties.gridProperties.columnCount - 1
    }

    for (let row = topLeft.row; row <= bottomRight.row; row++) {
      for (
        let column = topLeft.column;
        column <= bottomRight.column;
        column++
      ) {
        const cell = this.getCellNumericIndexes(sheet, row, column)
        if (!cell) {
          continue
        }
        const value =
          valueRange.values[row - topLeft.row][column - topLeft.column]
        cell.userEnteredValue = this.createValue(value)
      }
    }

    const response: UpdateValuesResponse = {
      spreadsheetId: this.sheet.spreadsheetId,
      updatedRange: valueRange.range,
      updatedRows: valueRange.values.length,
      updatedColumns: valueRange.values[0].length,
      updatedCells: valueRange.values.length * valueRange.values[0].length,
      updatedData: valueRange,
    }
    return response
  }

  private createValue(from: Value): ExtendedValue {
    if (typeof from === "string") {
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

  private createEmptyGrid(numRows: number, numCols: number): GridData {
    const rowData: RowData[] = []
    for (let row = 0; row < numRows; row++) {
      const cells: CellData[] = []
      for (let col = 0; col < numCols; col++) {
        cells.push({
          userEnteredValue: {
            stringValue: "",
          },
        })
      }
      rowData.push({
        values: cells,
      })
    }
    const rowMetadata: DimensionProperties[] = []
    for (let row = 0; row < numRows; row++) {
      rowMetadata.push({
        hiddenByFilter: false,
        hiddenByUser: false,
        pixelSize: 100,
      })
    }
    const columnMetadata: DimensionProperties[] = []
    for (let col = 0; col < numCols; col++) {
      columnMetadata.push({
        hiddenByFilter: false,
        hiddenByUser: false,
        pixelSize: 100,
      })
    }

    return {
      startRow: 0,
      startColumn: 0,
      rowData,
      rowMetadata,
      columnMetadata,
    }
  }

  getCell(sheetName: string, ref: string): CellData | undefined {
    const sheet = this.getSheetByName(sheetName)
    if (!sheet) {
      return undefined
    }
    const { row, column } = this.parseCell(ref)
    if (row === "ALL" || column === "ALL") {
      throw new Error("Only single cell references are supported")
    }
    return this.getCellNumericIndexes(sheet, row, column)
  }

  private getCellNumericIndexes(
    sheet: Sheet,
    row: number,
    column: number
  ): CellData | undefined {
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

  private parseA1Notation(range: string): {
    sheet: Sheet
    topLeft: Range
    bottomRight: Range
  } {
    let [sheetName, rest] = range.split("!")
    const [topLeft, bottomRight] = rest.split(":")

    if (sheetName.startsWith("'") && sheetName.endsWith("'")) {
      sheetName = sheetName.slice(1, -1)
    }

    const sheet = this.getSheetByName(sheetName)
    if (!sheet) {
      throw new Error(`Sheet ${sheetName} not found`)
    }

    return {
      sheet,
      topLeft: this.parseCell(topLeft),
      bottomRight: this.parseCell(bottomRight),
    }
  }

  /**
   * Parses a cell reference into a row and column.
   * @param cell a string of the form A1, B2, etc.
   * @returns
   */
  private parseCell(cell: string): Range {
    const firstChar = cell.slice(0, 1)
    if (this.isInteger(firstChar)) {
      return { row: parseInt(cell) - 1, column: "ALL" }
    }
    const column = this.letterToNumber(firstChar)
    if (cell.length === 1) {
      return { row: "ALL", column }
    }
    const number = cell.slice(1)
    return { row: parseInt(number) - 1, column }
  }

  private isInteger(value: string): boolean {
    return !isNaN(parseInt(value))
  }

  private letterToNumber(letter: string): number {
    return letter.charCodeAt(0) - 65
  }

  private getSheetByName(name: string): Sheet | undefined {
    return this.sheet.sheets.find(sheet => sheet.properties.title === name)
  }
}
