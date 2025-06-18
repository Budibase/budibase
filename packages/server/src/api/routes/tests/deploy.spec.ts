import * as setup from "./utilities"
import { structures } from "@budibase/backend-core/tests"
import { features } from "@budibase/backend-core"
import { createAutomationBuilder } from "../../../automations/tests/utilities/AutomationTestBuilder"
import { basicTable } from "../../../tests/utilities/structures"

describe("/api/deploy", () => {
  let config = setup.getConfig(),
    cleanup: () => void

  afterAll(() => {
    cleanup()
    setup.afterAll()
  })

  beforeAll(async () => {
    cleanup = features.testutils.setFeatureFlags("*", {
      WORKSPACE_APPS: true,
    })
    await config.init()
  })

  beforeEach(async () => {
    await config.newTenant()
  })

  describe("GET /api/deploy/status", () => {
    it("returns empty state when unpublished", async () => {
      await config.api.application.unpublish(config.appId!)
      const res = await config.api.deploy.publishStatus()
      for (const automation of Object.values(res.automations)) {
        expect(automation.published).toBe(false)
      }
      // default screens will appear here
      for (const workspaceApp of Object.values(res.workspaceApps)) {
        expect(workspaceApp.published).toBe(false)
      }
    })

    it("returns unpublished state for development-only resources", async () => {
      const table = await config.api.table.save(basicTable())

      // Create automation
      const { automation } = await createAutomationBuilder(config)
        .onRowSaved({ tableId: table._id! })
        .serverLog({ text: "Test automation" })
        .save()

      // Create workspace app
      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Test Workspace App",
          url: "/testapp",
        })
      )

      const res = await config.api.deploy.publishStatus()

      expect(res.automations[automation._id!]).toEqual({
        published: false,
        name: automation.name,
        unpublishedChanges: true,
      })
      expect(res.workspaceApps[workspaceApp._id!]).toEqual({
        published: false,
        name: workspaceApp.name,
        unpublishedChanges: true,
      })
    })

    it("returns published state after full publish", async () => {
      const table = await config.api.table.save(basicTable())

      const { automation } = await createAutomationBuilder(config)
        .onRowSaved({ tableId: table._id! })
        .serverLog({ text: "Test automation" })
        .save()

      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Test Workspace App",
          url: "/testapp",
        })
      )

      await config.api.application.publish(config.app!.appId)

      const res = await config.api.deploy.publishStatus()

      expect(res.automations[automation._id!]).toEqual({
        published: true,
        name: automation.name,
        unpublishedChanges: true,
      })
      expect(res.workspaceApps[workspaceApp._id!]).toEqual({
        published: true,
        name: workspaceApp.name,
        unpublishedChanges: true,
      })
    })

    it("returns mixed state after filtered publish", async () => {
      const table = await config.api.table.save(basicTable())

      // Create two automations
      const { automation: publishedAutomation } = await createAutomationBuilder(
        config
      )
        .onRowSaved({ tableId: table._id! })
        .serverLog({ text: "Published automation" })
        .save()

      const { automation: unpublishedAutomation } =
        await createAutomationBuilder(config)
          .onRowSaved({ tableId: table._id! })
          .serverLog({ text: "Unpublished automation" })
          .save()

      const { workspaceApp: publishedWorkspaceApp } =
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Published Workspace App",
            url: "/publishedapp",
          })
        )

      const { workspaceApp: unpublishedWorkspaceApp } =
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Unpublished Workspace App",
            url: "/unpublishedapp",
          })
        )

      await config.api.application.filteredPublish(config.app!.appId, {
        automationIds: [publishedAutomation._id!],
        workspaceAppIds: [publishedWorkspaceApp._id!],
      })

      const res = await config.api.deploy.publishStatus()

      expect(res.automations[publishedAutomation._id!]).toEqual({
        published: true,
        name: publishedAutomation.name,
        publishedAt: expect.any(String),
        unpublishedChanges: false,
      })
      expect(res.workspaceApps[publishedWorkspaceApp._id!]).toEqual({
        published: true,
        name: publishedWorkspaceApp.name,
        publishedAt: expect.any(String),
        unpublishedChanges: false,
      })

      expect(res.automations[unpublishedAutomation._id!]).toEqual({
        published: false,
        name: unpublishedAutomation.name,
        unpublishedChanges: true,
      })
      expect(res.workspaceApps[unpublishedWorkspaceApp._id!]).toEqual({
        published: false,
        name: unpublishedWorkspaceApp.name,
        unpublishedChanges: true,
      })
    })

    it("handles app with no production database", async () => {
      const table = await config.api.table.save(basicTable())

      const { automation } = await createAutomationBuilder(config)
        .onRowSaved({ tableId: table._id! })
        .serverLog({ text: "Test automation" })
        .save()

      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Test Workspace App",
          url: "/testapp",
        })
      )

      const res = await config.api.deploy.publishStatus()

      expect(res.automations[automation._id!]).toEqual({
        published: false,
        name: automation.name,
        unpublishedChanges: true,
      })
      expect(res.workspaceApps[workspaceApp._id!]).toEqual({
        published: false,
        name: workspaceApp.name,
        unpublishedChanges: true,
      })
    })

    it("returns only development resources that exist", async () => {
      const table = await config.api.table.save(basicTable())

      const { automation } = await createAutomationBuilder(config)
        .onRowSaved({ tableId: table._id! })
        .serverLog({ text: "Test automation" })
        .save()

      await config.api.application.publish(config.app!.appId)

      // Delete automation from development
      await config.api.automation.delete(automation)

      const res = await config.api.deploy.publishStatus()

      // Should not include deleted automation
      expect(res.automations[automation._id!]).toBeUndefined()
      expect(Object.keys(res.automations)).toHaveLength(0)
    })
  })
})
