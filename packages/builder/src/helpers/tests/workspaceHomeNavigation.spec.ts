import { afterEach, describe, expect, it } from "vitest"
import {
  getWorkspaceHomeUrl,
  withWorkspaceHomeReturn,
} from "../workspaceHomeNavigation"

describe("workspace home navigation", () => {
  afterEach(() => {
    window.history.replaceState({}, "", "/")
  })

  it("passes the complete home URL through the resource query", () => {
    const result = withWorkspaceHomeReturn(
      "/builder/workspace/app_1/automation/automation_1",
      "/builder/workspace/app_1/home?q=invoices&type=app&project=project_1&sort=name&order=asc"
    )

    expect(
      getWorkspaceHomeUrl("app_1", new URL(result, location.origin).search)
    ).toBe(
      "/builder/workspace/app_1/home?q=invoices&type=app&project=project_1&sort=name&order=asc"
    )
  })

  it("keeps return URLs isolated to the current workspace", () => {
    const search = new URLSearchParams({
      returnTo: "/builder/workspace/app_2/home?type=automation",
    }).toString()

    expect(getWorkspaceHomeUrl("app_1", `?${search}`)).toBe(
      "/builder/workspace/app_1/home"
    )
  })

  it("falls back when the return URL is missing or malformed", () => {
    expect(getWorkspaceHomeUrl("app_1", "")).toBe(
      "/builder/workspace/app_1/home"
    )
    expect(getWorkspaceHomeUrl("app_1", "?returnTo=http://[invalid")).toBe(
      "/builder/workspace/app_1/home"
    )
  })

  it("rejects external return URLs", () => {
    const search = new URLSearchParams({
      returnTo: "https://example.com/builder/workspace/app_1/home",
    }).toString()

    expect(getWorkspaceHomeUrl("app_1", `?${search}`)).toBe(
      "/builder/workspace/app_1/home"
    )
  })

  it("preserves the return query during nested navigation", () => {
    window.history.replaceState(
      {},
      "",
      "/builder/workspace/app_1/agent/agent_1?returnTo=%2Fbuilder%2Fworkspace%2Fapp_1%2Fhome%3Ftype%3Dagent%26q%3Dsupport"
    )

    expect(withWorkspaceHomeReturn("./operation/operation_1")).toBe(
      "./operation/operation_1?returnTo=%2Fbuilder%2Fworkspace%2Fapp_1%2Fhome%3Ftype%3Dagent%26q%3Dsupport"
    )
  })

  it("ignores a malformed return query during nested navigation", () => {
    window.history.replaceState({}, "", "/?returnTo=http://[invalid")

    expect(withWorkspaceHomeReturn("./screen_1")).toBe("./screen_1")
  })

  it("retains the home URL when returning from an operation to its agent", () => {
    window.history.replaceState(
      {},
      "",
      "/builder/workspace/app_1/agent/agent_1/operation/operation_1?returnTo=%2Fbuilder%2Fworkspace%2Fapp_1%2Fhome%3Ftype%3Dagent%26q%3Dsupport"
    )

    const agentUrl = withWorkspaceHomeReturn("../../config")
    const agentSearch = new URL(agentUrl, window.location.href).search

    expect(getWorkspaceHomeUrl("app_1", agentSearch)).toBe(
      "/builder/workspace/app_1/home?type=agent&q=support"
    )
  })
})
