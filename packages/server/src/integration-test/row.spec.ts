import { faker } from "@faker-js/faker"
import {
  generateMakeRequest,
  MakeRequestResponse,
} from "../api/routes/public/tests/utils"

import * as setup from "../api/routes/tests/utilities"
import { Datasource, FieldType, SourceName } from "@budibase/types"

const config = setup.getConfig()
let apiKey, makeRequest: MakeRequestResponse, postgresDatasource: Datasource

beforeEach(async () => {
  await config.init()
  apiKey = await config.generateApiKey()
  postgresDatasource = await config.createDatasource({
    type: "datasource",
    source: SourceName.POSTGRES,
    plus: true,
    config: {
      host: "192.168.1.98",
      port: 54321,
      database: "postgres",
      user: "root",
      password: "root",
      schema: "public",
      ssl: false,
      rejectUnauthorized: false,
      ca: false,
    },
  })

  makeRequest = generateMakeRequest(apiKey)
})

afterAll(async () => {
  await config.end()
})

describe("row api", () => {
  describe("create a row", () => {
    test("Given than no row exists, adding a new rows persists it", async () => {
      const tableName = faker.lorem.word()

      const table = await config.createTable({
        name: tableName,
        schema: {
          name: {
            name: "name",
            type: FieldType.STRING,
            constraints: {
              presence: true,
            },
          },
          description: {
            name: "description",
            type: FieldType.STRING,
          },
          value: {
            name: "value",
            type: FieldType.NUMBER,
          },
        },
        sourceId: postgresDatasource._id,
      })

      const newRow = {
        name: faker.name.fullName(),
        description: faker.lorem.paragraphs(),
        value: +faker.random.numeric(),
      }

      const res = await makeRequest("post", `/tables/${table._id}/rows`, newRow)

      expect(res.status).toBe(200)

      const persistedRows = await config.getRows(table._id!)
      expect(persistedRows).toHaveLength(1)
      expect(persistedRows).toEqual([
        expect.objectContaining({
          ...res.body.data,
          ...newRow,
        }),
      ])
    })

    test("Given than no row exists, multiple rows can be persisted", async () => {
      const tableName = faker.lorem.word()

      const table = await config.createTable({
        name: tableName,
        schema: {
          name: {
            name: "name",
            type: FieldType.STRING,
            constraints: {
              presence: true,
            },
          },
          description: {
            name: "description",
            type: FieldType.STRING,
          },
          value: {
            name: "value",
            type: FieldType.NUMBER,
          },
        },
        sourceId: postgresDatasource._id,
      })

      const numberOfRows = 10
      const newRows = Array(numberOfRows).fill({
        name: faker.name.fullName(),
        description: faker.lorem.paragraphs(),
        value: +faker.random.numeric(),
      })

      for (const newRow of newRows) {
        const res = await makeRequest(
          "post",
          `/tables/${table._id}/rows`,
          newRow
        )
        expect(res.status).toBe(200)
      }

      const persistedRows = await config.getRows(table._id!)
      expect(persistedRows).toHaveLength(numberOfRows)
      expect(persistedRows).toEqual(
        expect.arrayContaining(newRows.map(expect.objectContaining))
      )
    })
  })
})
