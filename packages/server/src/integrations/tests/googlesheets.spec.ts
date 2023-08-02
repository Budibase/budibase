import type { GoogleSpreadsheetWorksheet } from "google-spreadsheet"

jest.mock("google-auth-library")
const { OAuth2Client } = require("google-auth-library")

const setCredentialsMock = jest.fn()
const getAccessTokenMock = jest.fn()

OAuth2Client.mockImplementation(() => {
  return {
    setCredentials: setCredentialsMock,
    getAccessToken: getAccessTokenMock,
  }
})

jest.mock("google-spreadsheet")
const { GoogleSpreadsheet } = require("google-spreadsheet")

const sheetsByTitle: { [title: string]: GoogleSpreadsheetWorksheet } = {}
const sheetsByIndex: GoogleSpreadsheetWorksheet[] = []
const mockGoogleIntegration = {
  useOAuth2Client: jest.fn(),
  loadInfo: jest.fn(),
  sheetsByTitle,
  sheetsByIndex,
}

GoogleSpreadsheet.mockImplementation(() => mockGoogleIntegration)

import { structures } from "@budibase/backend-core/tests"
import TestConfiguration from "../../tests/utilities/TestConfiguration"
import GoogleSheetsIntegration from "../googlesheets"
import { FieldType, Table, TableSchema } from "@budibase/types"

describe("Google Sheets Integration", () => {
  let integration: any,
    config = new TestConfiguration()

  beforeAll(() => {
    config.setGoogleAuth("test")
  })

  afterAll(async () => {
    await config.end()
  })

  beforeEach(async () => {
    integration = new GoogleSheetsIntegration.integration({
      spreadsheetId: "randomId",
      auth: {
        appId: "appId",
        accessToken: "accessToken",
        refreshToken: "refreshToken",
      },
    })
    await config.init()

    jest.clearAllMocks()
  })

  function createBasicTable(name: string, columns: string[]): Table {
    return {
      name,
      schema: {
        ...columns.reduce((p, c) => {
          p[c] = {
            name: c,
            type: FieldType.STRING,
            constraints: {
              type: "string",
            },
          }
          return p
        }, {} as TableSchema),
      },
    }
  }

  function createSheet({
    headerValues,
  }: {
    headerValues: string[]
  }): GoogleSpreadsheetWorksheet {
    return {
      // to ignore the unmapped fields
      ...({} as any),
      loadHeaderRow: jest.fn(),
      headerValues,
      setHeaderRow: jest.fn(),
    }
  }

  describe("update table", () => {
    it("adding a new field will be adding a new header row", async () => {
      await config.doInContext(structures.uuid(), async () => {
        const tableColumns = ["name", "description", "new field"]
        const table = createBasicTable(structures.uuid(), tableColumns)

        const sheet = createSheet({ headerValues: ["name", "description"] })
        sheetsByTitle[table.name] = sheet
        await integration.updateTable(table)

        expect(sheet.loadHeaderRow).toBeCalledTimes(1)
        expect(sheet.setHeaderRow).toBeCalledTimes(1)
        expect(sheet.setHeaderRow).toBeCalledWith(tableColumns)
      })
    })

    it("removing an existing field will remove the header from the google sheet", async () => {
      const sheet = await config.doInContext(structures.uuid(), async () => {
        const tableColumns = ["name"]
        const table = createBasicTable(structures.uuid(), tableColumns)

        const sheet = createSheet({
          headerValues: ["name", "description", "location"],
        })
        sheetsByTitle[table.name] = sheet
        await integration.updateTable(table)
        return sheet
      })
      expect(sheet.loadHeaderRow).toBeCalledTimes(1)
      expect(sheet.setHeaderRow).toBeCalledTimes(1)
      expect(sheet.setHeaderRow).toBeCalledWith(["name"])

      // No undefined are sent
      expect((sheet.setHeaderRow as any).mock.calls[0][0]).toHaveLength(1)
    })
  })

  describe("getTableNames", () => {
    it("can fetch table names", async () => {
      await config.doInContext(structures.uuid(), async () => {
        const sheetNames: string[] = []
        for (let i = 0; i < 5; i++) {
          const sheet = createSheet({ headerValues: [] })
          sheetsByIndex.push(sheet)
          sheetNames.push(sheet.title)
        }

        const res = await integration.getTableNames()

        expect(mockGoogleIntegration.loadInfo).toBeCalledTimes(1)
        expect(res).toEqual(sheetNames)
      })
    })
  })

  describe("testConnection", () => {
    it("can test successful connections", async () => {
      await config.doInContext(structures.uuid(), async () => {
        const res = await integration.testConnection()

        expect(mockGoogleIntegration.loadInfo).toBeCalledTimes(1)
        expect(res).toEqual({ connected: true })
      })
    })
  })
})
