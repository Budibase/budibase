import type { ContextUser } from "@budibase/types"
import {
  chunkText,
  formatToolParameters,
  hasSharedReviewParameters,
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

  it("displays selected undefined values as empty", () => {
    expect(
      formatToolParameters({
        input: { optional: undefined },
        paths: ["/optional"],
      })
    ).toEqual([{ path: "/optional", value: "" }])
  })

  it("treats missing or empty parameters as not shared", () => {
    expect(hasSharedReviewParameters(undefined)).toBe(false)
    expect(hasSharedReviewParameters([])).toBe(false)
    expect(hasSharedReviewParameters([{ path: "/name", value: "Ada" }])).toBe(
      true
    )
  })

  it("projects nested paths and preserves selected secret-like values", () => {
    const formatted = formatToolParameters({
      input: {
        owner: "Budibase",
        inputs: {
          release_notes: "## Features\n- Useful change",
          api_token: "explicitly-shared",
        },
      },
      paths: ["/owner", "/inputs/release_notes", "/inputs/api_token"],
    })

    expect(formatted).toEqual([
      { path: "/owner", value: "Budibase" },
      {
        path: "/inputs/release_notes",
        value: "## Features\n- Useful change",
      },
      { path: "/inputs/api_token", value: "explicitly-shared" },
    ])
  })

  it("supports escaped pointer segments, arrays, missing paths, and deduping", () => {
    const formatted = formatToolParameters({
      input: {
        "a/b": { "~key": [{ value: "found" }] },
      },
      paths: [
        "/a~1b/~0key/0/value",
        "/missing",
        "invalid",
        "/a~1b/~0key/0/value",
      ],
    })

    expect(formatted).toEqual([
      { path: "/a~1b/~0key/0/value", value: "found" },
      { path: "/missing", value: "[UNAVAILABLE]" },
      { path: "invalid", value: "[UNAVAILABLE]" },
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
      paths: ["/notes", "/circular"],
    })
    expect(formatted?.[0]).toEqual({
      path: "/notes",
      value: "## Features\n- Useful change",
    })
    expect(formatted?.[1].value).toContain("[TRUNCATED:")
    expect(formatted?.[1].value).toContain("[CIRCULAR]")
    expect(stringifyToolParameters(formatted ?? []).length).toBeLessThanOrEqual(
      24_000
    )
  })

  it("keeps every selected path within the total budget", () => {
    const parameters = Object.fromEntries(
      Array.from({ length: 40 }, (_, index) => [
        `parameter_${index}`,
        "x".repeat(1_000),
      ])
    )

    const paths = Object.keys(parameters).map(key => `/${key}`)
    const formatted = formatToolParameters({ input: parameters, paths })
    expect(stringifyToolParameters(formatted ?? []).length).toBeLessThanOrEqual(
      24_000
    )
    Object.keys(parameters).forEach(key =>
      expect(formatted).toContainEqual(
        expect.objectContaining({ path: `/${key}` })
      )
    )
  })

  it("splits notification text into bounded chunks", () => {
    expect(chunkText("abcdef", 2)).toEqual(["ab", "cd", "ef"])
  })
})
