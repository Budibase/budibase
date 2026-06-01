jest.mock("../../utils", () => ({
  ...jest.requireActual("../../utils"),
  getEnvironmentVariables: jest.fn(async () => ({})),
}))

import { enrichContext } from "./queries"

describe("enrichContext JSON injection defence", () => {
  it("escapes string parameters substituted into a json field", async () => {
    // Reproduces the attack from the security report: a parameter that closes
    // its own quote and lifts sibling keys/operators into the parsed object.
    const enriched = await enrichContext(
      { json: '{"name": "{{ name }}"}' },
      { name: 'x","name":{"$exists":true},"$comment":"audit' }
    )

    expect(enriched.json).toEqual({
      name: 'x","name":{"$exists":true},"$comment":"audit',
    })
  })

  it("escapes string parameters substituted into requestBody", async () => {
    const enriched = await enrichContext(
      { requestBody: '{"q": "{{ q }}"}' },
      { q: 'safe","admin":true' }
    )

    expect(enriched.json).toEqual({ q: 'safe","admin":true' })
  })

  it("escapes string parameters substituted into customData", async () => {
    const enriched = await enrichContext(
      { customData: '{"selector": {"name": "{{ name }}"}}' },
      { name: 'x"},"$or":[{"name":{"$exists":true' }
    )

    expect(enriched.json).toEqual({
      selector: { name: 'x"},"$or":[{"name":{"$exists":true' },
    })
  })

  it("does not escape parameters substituted into non-JSON fields", async () => {
    const enriched = await enrichContext(
      { sql: 'SELECT * FROM t WHERE name = "{{ name }}"' },
      { name: 'O"Brien' }
    )

    expect(enriched.sql).toBe('SELECT * FROM t WHERE name = "O"Brien"')
  })

  it("preserves benign string substitution into JSON bodies", async () => {
    const enriched = await enrichContext(
      { json: '{"name": "{{ name }}"}' },
      { name: "alice" }
    )

    expect(enriched.json).toEqual({ name: "alice" })
  })

  it("preserves nested object bindings (recursive branch unaffected)", async () => {
    const enriched = await enrichContext(
      { json: { filter: { name: { $eq: "{{ name }}" } } } },
      { name: "alice" }
    )

    expect(enriched.json).toEqual({
      filter: { name: { $eq: "alice" } },
    })
  })

  it("escapes embedded quotes and backslashes safely", async () => {
    const enriched = await enrichContext(
      { json: '{"path": "{{ path }}"}' },
      { path: 'C:\\Users\\"alice"' }
    )

    expect(enriched.json).toEqual({ path: 'C:\\Users\\"alice"' })
  })
})
