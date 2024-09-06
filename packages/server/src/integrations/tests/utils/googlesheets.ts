import { Datasource } from "@budibase/types"
import nock from "nock"
import { GoogleSheetsConfig } from "../../googlesheets"

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
}

interface Sheet {
  properties: {
    sheetId: string
    title: string
  }
  data: GridData[]
}

interface Spreadsheet {
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
      .reply(200, {})

    nock("https://sheets.googleapis.com/", {
      reqheaders: { authorization: "Bearer test" },
    })
      .post(`/v4/spreadsheets/${this.config.spreadsheetId}/:batchUpdate`)
      .reply(200, () => {})
  }
}
