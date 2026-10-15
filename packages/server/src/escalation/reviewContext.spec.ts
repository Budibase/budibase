import type { ContextUser } from "@budibase/types"
import {
  chunkText,
  formatToolParameters,
  requesterLabel,
  stringifyToolParameters,
} from "./reviewContext"

describe("escalation review context", () => {
  const user = (overrides: Partial<ContextUser>): ContextUser =>
    ({ _id: "us_1", tenantId: "tenant_1", ...overrides }) as ContextUser

  it("formats requester names with email and falls back to an id", () => {
    expect(
      requesterLabel({
        user: user({
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
        }),
      })
    ).toBe("Test User (test@example.com)")
    expect(requesterLabel({ user: user({}) })).toBe("us_1")
  })

  it("names the agent instead of the synthetic user for automation runs", () => {
    const label = requesterLabel({
      user: user({
        _id: "automation:session_1",
        email: "automation%3Asession_1@automation.budibase.local",
      }),
      automation: { agentName: "Release bot" },
    })

    expect(label).toBe("Automation (Release bot)")
  })

  it("shares no parameters without an allowlist", () => {
    expect(
      formatToolParameters({ input: { secret: "do-not-show" } })
    ).toBeUndefined()
  })

  it("preserves explicit empty and null values", () => {
    expect(
      formatToolParameters({
        input: { empty: "", nil: null },
        names: ["empty", "nil"],
      })
    ).toEqual([
      { name: "empty", value: "" },
      { name: "nil", value: "null" },
    ])
  })

  it("projects direct arguments and preserves selected secret-like values", () => {
    const formatted = formatToolParameters({
      input: {
        owner: "Budibase",
        inputs: {
          release_notes: "## Features\n- Useful change",
          api_token: "explicitly-shared",
        },
        api_token: "explicitly-shared",
      },
      names: ["owner", "inputs", "api_token"],
    })

    expect(formatted).toEqual([
      { name: "owner", value: "Budibase" },
      {
        name: "inputs",
        value:
          '{\n  "release_notes": "## Features\\n- Useful change",\n  "api_token": "explicitly-shared"\n}',
      },
      { name: "api_token", value: "explicitly-shared" },
    ])
  })

  it("supports unusual direct names, missing arguments, and deduping", () => {
    const formatted = formatToolParameters({
      input: {
        "a/b": "found",
      },
      names: ["a/b", "missing", "a/b"],
    })

    expect(formatted).toEqual([
      { name: "a/b", value: "found" },
      { name: "missing", value: "Not provided" },
    ])
  })

  it("renders multi-line values and bounds long circular values", () => {
    const circular: Record<string, unknown> = { large: "x".repeat(20_000) }
    circular.self = circular

    const formatted = formatToolParameters({
      input: {
        notes: "## Features\n- Useful change",
        circular,
      },
      names: ["notes", "circular"],
    })
    expect(formatted?.[0]).toEqual({
      name: "notes",
      value: "## Features\n- Useful change",
    })
    expect(formatted?.[1].value).toContain("[TRUNCATED:")
    expect(formatted?.[1].value).toContain("[CIRCULAR]")
    expect(stringifyToolParameters(formatted ?? []).length).toBeLessThanOrEqual(
      24_000
    )
  })

  it("keeps every selected parameter within the total budget", () => {
    const parameters = Object.fromEntries(
      Array.from({ length: 40 }, (_, index) => [
        `parameter_${index}`,
        "x".repeat(1_000),
      ])
    )

    const names = Object.keys(parameters)
    const formatted = formatToolParameters({ input: parameters, names })
    expect(stringifyToolParameters(formatted ?? []).length).toBeLessThanOrEqual(
      24_000
    )
    Object.keys(parameters).forEach(key =>
      expect(formatted).toContainEqual(expect.objectContaining({ name: key }))
    )
  })

  it("splits notification text into bounded chunks", () => {
    expect(chunkText("abcdef", 2)).toEqual(["ab", "cd", "ef"])
  })
})
