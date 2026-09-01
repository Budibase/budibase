import type { ContextUser } from "@budibase/types"
import {
  chunkText,
  formatToolParameters,
  requesterLabel,
} from "./reviewContext"

describe("escalation review context", () => {
  const user = (overrides: Partial<ContextUser>): ContextUser =>
    ({ _id: "us_1", tenantId: "tenant_1", ...overrides }) as ContextUser

  it("formats requester names with email and falls back to an id", () => {
    expect(
      requesterLabel({
        user: user({
          firstName: "Adria",
          lastName: "Navarro",
          email: "adria@example.com",
        }),
      })
    ).toBe("Adria Navarro (adria@example.com)")
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

  it("keeps parameter names while redacting nested secrets", () => {
    const formatted = formatToolParameters({
      owner: "Budibase",
      inputs: {
        release_notes: "## Features\n- Useful change",
        api_token: "do-not-show",
      },
    })

    expect(formatted).toContain("owner")
    expect(formatted).toContain("release_notes")
    expect(formatted).toContain("Useful change")
    expect(formatted).toContain("api_token")
    expect(formatted).toContain("[REDACTED]")
    expect(formatted).not.toContain("do-not-show")
  })

  it("renders multi-line values as text rather than escaped JSON", () => {
    const formatted = formatToolParameters({
      workflow_id: "test-release.yml",
      inputs: {
        release_notes: "## Features\n- Useful change",
      },
    })

    expect(formatted).toBe(
      [
        "workflow_id: test-release.yml",
        "",
        "inputs:",
        "  release_notes:",
        "    ## Features",
        "    - Useful change",
      ].join("\n")
    )
  })

  it("bounds long and circular values without failing", () => {
    const circular: Record<string, unknown> = { large: "x".repeat(20_000) }
    circular.self = circular

    const formatted = formatToolParameters(circular)
    expect(formatted).toContain("[TRUNCATED:")
    expect(formatted).toContain("[CIRCULAR]")
    expect(formatted.length).toBeLessThanOrEqual(24_000)
  })

  it("keeps every top-level parameter name within the total budget", () => {
    const parameters = Object.fromEntries(
      Array.from({ length: 300 }, (_, index) => [
        `parameter_${index}`,
        "x".repeat(1_000),
      ])
    )

    const formatted = formatToolParameters(parameters)
    expect(formatted.length).toBeLessThanOrEqual(24_000)
    Object.keys(parameters).forEach(key =>
      expect(formatted).toContain(`${key}:`)
    )
  })

  it("splits notification text into bounded chunks", () => {
    expect(chunkText("abcdef", 2)).toEqual(["ab", "cd", "ef"])
  })
})
