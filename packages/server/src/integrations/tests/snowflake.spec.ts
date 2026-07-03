import snowflake from "../snowflake"

const execute = jest.fn()
const connect = jest.fn()
const isUp = jest.fn()

jest.mock("snowflake-sdk", () => ({
  __esModule: true,
  default: {
    createConnection: jest.fn(() => ({
      connect,
      execute,
      isUp,
    })),
  },
}))

describe("snowflake integration", () => {
  beforeEach(() => {
    jest.clearAllMocks()
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
})
