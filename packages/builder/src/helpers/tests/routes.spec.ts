import {
  buildBuilderWorkspaceRoute,
  buildBuilderWorkspaceDesignRoute,
} from "../routes"

describe("buildBuilderWorkspaceRoute", () => {
  it("returns the base workspace route", () => {
    const route = buildBuilderWorkspaceRoute({ applicationId: "app_123" })
    expect(route).toBe("/builder/workspace/app_123")
  })

  it("appends additional path segments", () => {
    const route = buildBuilderWorkspaceRoute({
      applicationId: "app_123",
      segments: ["design", "workspaceApp_456"],
    })
    expect(route).toBe("/builder/workspace/app_123/design/workspaceApp_456")
  })

  it("ignores empty segments and trims slashes", () => {
    const route = buildBuilderWorkspaceRoute({
      applicationId: "app_123",
      segments: [
        "/design/",
        null,
        undefined,
        "workspaceApp_456/",
        "screen_789",
      ],
    })
    expect(route).toBe(
      "/builder/workspace/app_123/design/workspaceApp_456/screen_789"
    )
  })
})

describe("buildBuilderWorkspaceDesignRoute", () => {
  it("builds a design route without a component id", () => {
    const route = buildBuilderWorkspaceDesignRoute({
      applicationId: "app_123",
      workspaceAppId: "workspaceApp_456",
      screenId: "screen_789",
    })
    expect(route).toBe(
      "/builder/workspace/app_123/design/workspaceApp_456/screen_789"
    )
  })

  it("builds a design route with a component id", () => {
    const route = buildBuilderWorkspaceDesignRoute({
      applicationId: "app_123",
      workspaceAppId: "workspaceApp_456",
      screenId: "screen_789",
      componentId: "component_101",
    })
    expect(route).toBe(
      "/builder/workspace/app_123/design/workspaceApp_456/screen_789/component_101"
    )
  })
})
