jest.mock("../../sdk", () => ({
  __esModule: true,
  default: {
    queries: {
      enrichContext: jest.fn(
        async (bindings: string[], parameters: Record<string, string>) =>
          bindings.map(binding => parameters[binding.replace(/[{} ]/g, "")])
      ),
      enrichArrayContext: jest.fn(
        async (bindings: string[], parameters: Record<string, string>) =>
          bindings.map(binding => parameters[binding.replace(/[{} ]/g, "")])
      ),
    },
  },
}))

jest.mock("@budibase/backend-core", () => {
  const actual = jest.requireActual("@budibase/backend-core")
  return {
    ...actual,
    utils: { ...actual.utils, resolveSafeHostIp: jest.fn() },
  }
})

import { utils } from "@budibase/backend-core"
import { SourceName } from "@budibase/types"
import snowflake from "../snowflake"
import { interpolateSQL } from "../queries/sql"

const execute = jest.fn()
const connect = jest.fn()
const isUp = jest.fn()
// What the connector passed, copied before the SDK fills in fields of its own.
const sentOptions: Record<string, unknown>[] = []
let runSdkConfig = true

// createConnection runs the real SDK's option checks and host building, which
// make no network request; the returned connection is a fake.
jest.mock("snowflake-sdk", () => {
  const actual = jest.requireActual("snowflake-sdk")
  return {
    __esModule: true,
    default: {
      createConnection: jest.fn((options: Record<string, unknown>) => {
        sentOptions.push({ ...options })
        if (runSdkConfig) {
          actual.createConnection(options)
        }
        return { connect, execute, isUp }
      }),
    },
  }
})

const resolveSafeHostIp = jest.mocked(utils.resolveSafeHostIp)

const config = (account = "account") => ({
  account,
  username: "username",
  password: "password",
  privateKey: "",
  authenticator: "",
  warehouse: "warehouse",
  database: "database",
  schema: "schema",
})

describe("snowflake integration", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    sentOptions.length = 0
    runSdkConfig = true
    isUp.mockReturnValue(false)
    connect.mockImplementation(callback => callback(undefined))
    execute.mockImplementation(({ complete }) =>
      complete(undefined, undefined, [{ id: 1 }])
    )
  })

  it("passes query bindings to the snowflake driver", async () => {
    const integration = new snowflake.integration({
      account: "account",
      username: "username",
      password: "password",
      privateKey: "",
      authenticator: "",
      warehouse: "warehouse",
      database: "database",
      schema: "schema",
    })

    await integration.read({
      sql: "SELECT * FROM users WHERE email = ?",
      bindings: ["test@example.com"],
    })

    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({
        sqlText: "SELECT * FROM users WHERE email = ?",
        binds: ["test@example.com"],
      })
    )
  })

  it("binds a webhook value instead of adding it to Snowflake SQL", async () => {
    const integration = new snowflake.integration({
      account: "account",
      username: "username",
      password: "password",
      privateKey: "",
      authenticator: "",
      warehouse: "warehouse",
      database: "database",
      schema: "schema",
    })
    const payload = "' OR 1=1 --"
    const query = await interpolateSQL(
      SourceName.SNOWFLAKE,
      {
        sql: "SELECT * FROM users WHERE id = '{{ id }}'",
        bindings: [],
      },
      { id: payload },
      integration,
      { nullDefaultSupport: false }
    )

    await integration.read(query)

    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({
        sqlText: "SELECT * FROM users WHERE id = concat('', ?, '')",
        binds: [payload],
      })
    )
  })

  it("does not pass unknown config keys to the snowflake driver", async () => {
    const integration = new snowflake.integration({
      ...config(),
      ...{
        accessUrl: "http://169.254.169.254",
        host: "169.254.169.254",
        proxyHost: "169.254.169.254",
        proxyPort: 80,
      },
    })

    await integration.testConnection()

    expect(sentOptions).toEqual([
      {
        account: "account",
        username: "username",
        password: "password",
        role: undefined,
        warehouse: "warehouse",
        database: "database",
        schema: "schema",
        authenticator: "SNOWFLAKE",
      },
    ])
  })

  // The SDK builds its host from the account, so this also fails if an SDK
  // upgrade stops filling in `options.host`.
  it.each([
    ["xy12345", "xy12345.snowflakecomputing.com"],
    ["xy12345.us-east-1", "xy12345.us-east-1.snowflakecomputing.com"],
    ["xy12345.us-west-2", "xy12345.snowflakecomputing.com"],
    ["xy12345.cn-north-1", "xy12345.cn-north-1.snowflakecomputing.cn"],
    ["myorg-myaccount", "myorg-myaccount.snowflakecomputing.com"],
  ])("checks the host the SDK builds for account %s", async (account, host) => {
    const response = await new snowflake.integration(
      config(account)
    ).testConnection()

    expect(response).toEqual({ connected: true })
    expect(resolveSafeHostIp).toHaveBeenCalledWith(host)
  })

  it("does not connect when the host is blocked", async () => {
    resolveSafeHostIp.mockRejectedValueOnce(
      new Error("Host is blocked or could not be resolved safely.")
    )

    const response = await new snowflake.integration(config()).testConnection()

    expect(response).toEqual({
      connected: false,
      error: "Host is blocked or could not be resolved safely.",
    })
    expect(connect).not.toHaveBeenCalled()
  })

  it("does not connect when the SDK does not report a host", async () => {
    runSdkConfig = false

    const response = await new snowflake.integration(config()).testConnection()

    expect(response).toEqual({
      connected: false,
      error: "Snowflake host could not be determined.",
    })
    expect(resolveSafeHostIp).not.toHaveBeenCalled()
    expect(connect).not.toHaveBeenCalled()
  })

  // The SDK builds `https://${account}.snowflakecomputing.com`, so each value
  // below would move the host if the SDK did not reject it.
  it.each(["evil.example.com/", "evil.example.com?", "169.254.169.254#"])(
    "rejects an account that would change the host: %s",
    async account => {
      const response = await new snowflake.integration(
        config(account)
      ).testConnection()

      expect(response).toEqual({
        connected: false,
        error:
          "Invalid account. The specified value must be a valid subdomain string.",
      })
      expect(resolveSafeHostIp).not.toHaveBeenCalled()
      expect(connect).not.toHaveBeenCalled()
    }
  )
})
