import { setEnv as setCoreEnv } from "@budibase/backend-core"
import nock from "nock"

import TestConfiguration from "../../tests/utilities/TestConfiguration"
import {
  Datasource,
  FieldType,
  SourceName,
  TableSourceType,
} from "@budibase/types"
import { access } from "node:fs"
import { GoogleSheetsMock } from "./utils/googlesheets"

describe("Google Sheets Integration", () => {
  const config = new TestConfiguration()

  let cleanupEnv: () => void
  let datasource: Datasource
  let mock: GoogleSheetsMock

  beforeAll(async () => {
    cleanupEnv = setCoreEnv({
      GOOGLE_CLIENT_ID: "test",
      GOOGLE_CLIENT_SECRET: "test",
    })

    await config.init()

    datasource = await config.api.datasource.create({
      name: "Test Datasource",
      type: "datasource",
      source: SourceName.GOOGLE_SHEETS,
      config: {
        spreadsheetId: "randomId",
        auth: {
          appId: "appId",
          accessToken: "accessToken",
          refreshToken: "refreshToken",
        },
      },
    })
  })

  afterAll(async () => {
    cleanupEnv()
    config.end()
  })

  beforeEach(async () => {
    nock.cleanAll()
    mock = GoogleSheetsMock.forDatasource(datasource)
    mock.mockAuth()
  })

  describe("create", () => {
    it("creates a new table", async () => {
      nock("https://sheets.googleapis.com/", {
        reqheaders: { authorization: "Bearer test" },
      })
        .get("/v4/spreadsheets/randomId/")
        .reply(200, {})

      const table = await config.api.table.save({
        name: "Test Table",
        type: "table",
        sourceId: datasource._id!,
        sourceType: TableSourceType.EXTERNAL,
        schema: {
          name: {
            name: "name",
            type: FieldType.STRING,
            constraints: {
              type: "string",
            },
          },
          description: {
            name: "description",
            type: FieldType.STRING,
            constraints: {
              type: "string",
            },
          },
        },
      })
    })
  })
})
