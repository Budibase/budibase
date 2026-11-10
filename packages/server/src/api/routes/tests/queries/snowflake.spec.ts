import { Datasource, SourceName } from "@budibase/types"
import TestConfiguration from "../../../../tests/utilities/TestConfiguration"
import {
  basicDatasource,
  basicQuery,
} from "../../../../tests/utilities/structures"

interface SnowflakeExecution {
  sqlText: string
  binds: (string | number | null)[]
  complete: (
    error: undefined,
    statement: undefined,
    rows: { id: number }[]
  ) => void
}

const execute = jest.fn(({ complete }: SnowflakeExecution) =>
  complete(undefined, undefined, [{ id: 1 }])
)

jest.mock("snowflake-sdk", () => ({
  __esModule: true,
  default: {
    createConnection: jest.fn(() => ({
      connect: jest.fn((callback: () => void) => callback()),
      execute,
      isUp: () => true,
    })),
  },
}))

describe("Snowflake query bindings", () => {
  const config = new TestConfiguration()
  let datasource: Datasource

  beforeEach(() => {
    jest.clearAllMocks()
  })

  beforeAll(async () => {
    await config.init()
    datasource = await config.api.datasource.create({
      ...basicDatasource().datasource,
      source: SourceName.SNOWFLAKE,
      config: {
        account: "account",
        username: "username",
        password: "password",
        warehouse: "warehouse",
        database: "database",
        schema: "schema",
      },
    })
  })

  afterAll(async () => {
    await config.end()
  })

  it.each([false, true])(
    "preserves native null separately from the string null with nullDefaultSupport=%s",
    async nullDefaultSupport => {
      const query = await config.api.query.save({
        ...basicQuery(datasource._id!),
        fields: { sql: "CALL example_procedure({{ value }}, {{ text }})" },
        parameters: [
          { name: "value", default: "null" },
          { name: "text", default: "null" },
        ],
      })
      await config.api.query.save({ ...query, nullDefaultSupport })

      await config.api.query.execute(query._id!, {
        parameters: { value: null, text: "null" },
      })

      expect(execute).toHaveBeenLastCalledWith(
        expect.objectContaining({
          sqlText: "CALL example_procedure(?, ?)",
          binds: [null, "null"],
        })
      )
    }
  )

  it.each([
    { name: "customData", value: null },
    { name: "customData", value: "null" },
    { name: "json", value: null },
    { name: "json", value: "null" },
    { name: "requestBody", value: null },
    { name: "requestBody", value: "null" },
  ])(
    "preserves the $name parameter with value $value",
    async ({ name, value }) => {
      const query = await config.api.query.save({
        ...basicQuery(datasource._id!),
        fields: { sql: `CALL example_procedure({{ ${name} }})` },
        parameters: [{ name, default: "default" }],
      })
      await config.api.query.save({ ...query, nullDefaultSupport: false })

      await config.api.query.execute(query._id!, {
        parameters: { [name]: value },
      })

      expect(execute).toHaveBeenLastCalledWith(
        expect.objectContaining({
          sqlText: "CALL example_procedure(?)",
          binds: [value],
        })
      )
    }
  )

  it.each([false, true])(
    "preserves null over static variables with nullDefaultSupport=%s",
    async nullDefaultSupport => {
      const staticDatasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        source: SourceName.SNOWFLAKE,
        config: {
          ...datasource.config,
          staticVariables: { amount: "123", missing: "456", empty: "789" },
        },
      })
      const query = await config.api.query.save({
        ...basicQuery(staticDatasource._id!),
        fields: {
          sql: "CALL example_procedure({{ amount }}, {{ missing }}, {{ empty }}, {{ unset }})",
        },
        parameters: [
          { name: "amount", default: "default" },
          { name: "missing", default: "" },
          { name: "empty", default: "" },
          { name: "unset", default: "" },
        ],
      })
      await config.api.query.save({ ...query, nullDefaultSupport })

      await config.api.query.execute(query._id!, {
        parameters: { amount: null, empty: "" },
      })

      expect(execute).toHaveBeenLastCalledWith(
        expect.objectContaining({
          sqlText: "CALL example_procedure(?, ?, ?, ?)",
          binds: [null, "456", "789", nullDefaultSupport ? null : ""],
        })
      )
    }
  )

  it.each([false, true])(
    "forwards null into dynamic SQL queries with nullDefaultSupport=%s",
    async nullDefaultSupport => {
      const nestedQuery = await config.api.query.save({
        ...basicQuery(datasource._id!),
        fields: {
          sql: "CALL nested_procedure({{ amount }}, {{ missing }}, {{ empty }})",
        },
        parameters: [
          { name: "amount", default: "123" },
          { name: "missing", default: "456" },
          { name: "empty", default: "789" },
        ],
      })
      await config.api.query.save({ ...nestedQuery, nullDefaultSupport })
      const dynamicDatasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        source: SourceName.SNOWFLAKE,
        config: {
          ...datasource.config,
          dynamicVariables: [
            {
              queryId: nestedQuery._id!,
              name: "result",
              value: "{{ data[0].id }}",
            },
          ],
        },
      })
      const query = await config.api.query.save({
        ...basicQuery(dynamicDatasource._id!),
        fields: { sql: "CALL example_procedure({{ result }})" },
        parameters: [
          { name: "amount", default: "default" },
          { name: "missing", default: "" },
          { name: "empty", default: "" },
        ],
      })

      await config.api.query.execute(query._id!, {
        parameters: { amount: null, empty: "" },
      })

      expect(execute).toHaveBeenCalledWith(
        expect.objectContaining({
          sqlText: "CALL nested_procedure(?, ?, ?)",
          binds: [null, "456", "789"],
        })
      )
    }
  )

  it.each([
    { sql: "SELECT {{ value }} AS value", expected: "SELECT ? AS value" },
    {
      sql: "SELECT '{{ value }}' AS value",
      expected: "SELECT concat('', ?, '') AS value",
    },
  ])(
    "keeps SQL injection payloads bound in $sql",
    async ({ sql, expected }) => {
      const query = await config.api.query.save({
        ...basicQuery(datasource._id!),
        fields: { sql },
        parameters: [{ name: "value", default: "" }],
      })
      const payload = "'; DROP TABLE users; --"

      await config.api.query.execute(query._id!, {
        parameters: { value: payload },
      })

      expect(execute).toHaveBeenLastCalledWith(
        expect.objectContaining({ sqlText: expected, binds: [payload] })
      )
    }
  )
})
