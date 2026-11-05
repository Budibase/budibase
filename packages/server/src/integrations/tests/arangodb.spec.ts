import arangodb from "../arangodb"
import { interpolateAQL } from "../queries/aql"

jest.mock("../../sdk", () => ({
  __esModule: true,
  default: {
    queries: {
      enrichArrayContext: jest.fn(
        async (bindings: string[], parameters: Record<string, string>) =>
          bindings.map(binding => parameters[binding.replace(/[{} ]/g, "")])
      ),
    },
  },
}))

const query = jest.fn()
const close = jest.fn()

jest.mock("arangojs", () => ({
  Database: jest.fn().mockImplementation(() => ({
    query,
    close,
  })),
  aql: jest.fn(),
}))

describe("arangodb integration", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    query.mockResolvedValue({ all: async () => [{ name: "alice" }] })
  })

  it("passes a user value as an AQL bind variable", async () => {
    const integration = new arangodb.integration({
      url: "http://example.com:8529",
      username: "root",
      password: "password",
      databaseName: "_system",
      collection: "items",
    })
    const payload = '" || true || "'
    const sql = "FOR d IN items FILTER d.name == @value0 RETURN d"

    await integration.read({ sql, bindVars: { value0: payload } })

    expect(query).toHaveBeenCalledWith(sql, { value0: payload })
  })

  it("keeps existing queries without parameters working", async () => {
    const integration = new arangodb.integration({
      url: "http://example.com:8529",
      username: "root",
      password: "password",
      databaseName: "_system",
      collection: "items",
    })
    const sql = "FOR d IN items RETURN d"

    await integration.read({ sql })

    expect(query).toHaveBeenCalledWith(sql)
  })

  it("binds a value inside a quoted AQL filter", async () => {
    const payload = '" || true || "'
    const result = await interpolateAQL(
      { sql: 'FOR d IN items FILTER d.name == "{{name}}" RETURN d' },
      { name: payload }
    )

    expect(result).toEqual({
      sql: "FOR d IN items FILTER d.name == @value0 RETURN d",
      bindVars: { value0: payload },
    })
  })

  it("preserves string expressions and binds embedded values", async () => {
    const result = await interpolateAQL(
      {
        sql: 'FOR d IN items FILTER d.name == "prefix-{{name}}" AND d.id == {{id}} RETURN d',
      },
      { name: '" || true || "', id: "42" }
    )

    expect(result).toEqual({
      sql: 'FOR d IN items FILTER d.name == CONCAT("prefix-", @value0) AND d.id == @value1 RETURN d',
      bindVars: { value0: '" || true || "', value1: "42" },
    })
  })

  it.each([
    "// user's records {{ignored}}\n",
    "// user's records {{ignored}}\r\n",
    "/* user's records {{ignored}} */",
    '/* "quoted" records\n{{ignored}} */',
  ])("preserves comments and binds values after %s", async comment => {
    const payload = '" || true || " /* injected */'
    const result = await interpolateAQL(
      { sql: `${comment} FOR d IN items FILTER d.name == "{{name}}" RETURN d` },
      { name: payload, ignored: "*/ RETURN true //" }
    )

    expect(result).toEqual({
      sql: `${comment} FOR d IN items FILTER d.name == @value0 RETURN d`,
      bindVars: { value0: payload },
    })
  })

  it("does not treat comment markers in strings as comments", async () => {
    const result = await interpolateAQL(
      { sql: 'RETURN "https://example.com/*{{name}}*/"' },
      { name: '" RETURN true //' }
    )

    expect(result).toEqual({
      sql: 'RETURN CONCAT("https://example.com/*", @value0, "*/")',
      bindVars: { value0: '" RETURN true //' },
    })
  })

  it.each(["// {{ignored}}", "/* {{ignored}} */", "/* {{ignored}}"])(
    "does not interpolate a trailing comment: %s",
    async comment => {
      const result = await interpolateAQL(
        { sql: `RETURN {{name}} ${comment}` },
        { name: "alice", ignored: "*/ RETURN true //" }
      )

      expect(result).toEqual({
        sql: `RETURN @value0 ${comment}`,
        bindVars: { value0: "alice" },
      })
    }
  )
})
