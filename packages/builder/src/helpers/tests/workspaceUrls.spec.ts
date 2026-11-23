import { describe, expect, it, vi } from "vitest"
import {
  getCanonicalBuilderWorkspaceUrl,
  getWorkspaceIdFromUrl,
  getWorkspaceUrlId,
  redirectLegacyWorkspaceUrl,
} from "../workspaceUrls"

describe("workspace URL IDs", () => {
  it.each([
    ["app_dev_28bf", "dev_28bf"],
    ["app_28bf", "28bf"],
    ["app_dev_tenant_28bf", "dev_tenant_28bf"],
    ["dev_28bf", "dev_28bf"],
    ["28bf", "28bf"],
    ["app_workspace_app_section", "workspace_app_section"],
    ["", ""],
  ])("maps %s to the URL ID %s", (workspaceId, expected) => {
    expect(getWorkspaceUrlId(workspaceId)).toBe(expected)
  })

  it.each([
    ["dev_28bf", "app_dev_28bf"],
    ["28bf", "app_28bf"],
    ["dev_tenant_28bf", "app_dev_tenant_28bf"],
    ["app_dev_28bf", "app_dev_28bf"],
    ["app_28bf", "app_28bf"],
    ["workspace_app_section", "app_workspace_app_section"],
    ["", ""],
  ])("maps URL ID %s to the internal ID %s", (workspaceUrlId, expected) => {
    expect(getWorkspaceIdFromUrl(workspaceUrlId)).toBe(expected)
  })

  it("canonicalises a legacy workspace URL", () => {
    expect(
      getCanonicalBuilderWorkspaceUrl({
        pathname: "/builder/workspace/app_dev_28bf/design/app_1",
        search: "?tab=all",
        hash: "#details",
      })
    ).toBe("/builder/workspace/dev_28bf/design/app_1?tab=all#details")
  })

  it("canonicalises a legacy updating URL", () => {
    expect(
      getCanonicalBuilderWorkspaceUrl({
        pathname: "/builder/workspace/updating/app_dev_28bf",
        search: "?returnUrl=%2Fbuilder%2Fworkspace%2Fapp_dev_28bf%2Fhome",
        hash: "",
      })
    ).toBe(
      "/builder/workspace/updating/dev_28bf?returnUrl=%2Fbuilder%2Fworkspace%2Fapp_dev_28bf%2Fhome"
    )
  })

  it("replaces a legacy URL with its canonical form", () => {
    const replace = vi.fn()

    expect(
      redirectLegacyWorkspaceUrl("app_dev_28bf", {
        pathname: "/builder/workspace/app_dev_28bf/home",
        search: "?type=app",
        hash: "#recent",
        replace,
      })
    ).toBe(true)
    expect(replace).toHaveBeenCalledWith(
      "/builder/workspace/dev_28bf/home?type=app#recent"
    )
  })

  it("does not replace a canonical URL", () => {
    const replace = vi.fn()

    expect(
      redirectLegacyWorkspaceUrl("dev_28bf", {
        pathname: "/builder/workspace/dev_28bf/home",
        search: "",
        hash: "",
        replace,
      })
    ).toBe(false)
    expect(replace).not.toHaveBeenCalled()
  })
})
