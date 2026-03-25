import { describe, expect, it } from "vitest"

import { getPublishButtonText, getPublishChangeCount } from "./publishChanges"

describe("publishChanges", () => {
  it("counts unpublished changes across deployment status maps", () => {
    const changeCount = getPublishChangeCount({
      automations: {
        auto_1: { unpublishedChanges: true },
        auto_2: { unpublishedChanges: false },
      },
      workspaceApps: {
        app_1: { unpublishedChanges: true },
      },
      tables: {
        table_1: { unpublishedChanges: true },
        table_2: { unpublishedChanges: false },
      },
      agents: {
        agent_1: { unpublishedChanges: true },
      },
      agentsEnabled: true,
    })

    expect(changeCount).toBe(4)
  })

  it("ignores agent changes when agents are disabled", () => {
    const changeCount = getPublishChangeCount({
      automations: {
        auto_1: { unpublishedChanges: true },
      },
      workspaceApps: {
        app_1: { unpublishedChanges: true },
      },
      tables: {
        table_1: { unpublishedChanges: true },
      },
      agents: {
        agent_1: { unpublishedChanges: true },
      },
      agentsEnabled: false,
    })

    expect(changeCount).toBe(3)
  })

  it("counts unpublished changes for deleted resources represented in status maps", () => {
    const changeCount = getPublishChangeCount({
      automations: {
        deleted_automation: { unpublishedChanges: true },
      },
      workspaceApps: {},
      tables: {},
      agents: {},
      agentsEnabled: true,
    })

    expect(changeCount).toBe(1)
  })

  it("builds publish button text from the change count", () => {
    expect(getPublishButtonText(0)).toBe("Publish")
    expect(getPublishButtonText(2)).toBe("Publish changes (2)")
  })
})
