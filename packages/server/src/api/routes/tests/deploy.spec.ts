import * as setup from "./utilities"
import { structures } from "@budibase/backend-core/tests"
import { createAutomationBuilder } from "../../../automations/tests/utilities/AutomationTestBuilder"
import { basicTable } from "../../../tests/utilities/structures"

describe("/api/deploy", () => {
  let config = setup.getConfig()

  afterAll(setup.afterAll)

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await config.newTenant()
  })

  describe("GET /api/deploy/status", () => {
    it("returns empty state when no resources exist", async () => {
      const res = await config.api.deploy.publishStatus()
      expect(res.automations).toEqual({})
      expect(res.workspaceApps).toEqual({})
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
          urlPrefix: "/testapp",
        })
      )

      const res = await config.api.deploy.publishStatus()

      expect(res.automations[automation._id!]).toEqual({
        published: false,
        name: automation.name,
      })
      expect(res.workspaceApps[workspaceApp._id!]).toEqual({
        published: false,
        name: workspaceApp.name,
      })
    })

    it("returns published state after full publish", async () => {
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
          urlPrefix: "/testapp",
        })
      )

      // Publish all
      await config.api.application.publish(config.app!.appId)

      const res = await config.api.deploy.publishStatus()

      expect(res.automations[automation._id!]).toEqual({
        published: true,
        name: automation.name,
      })
      expect(res.workspaceApps[workspaceApp._id!]).toEqual({
        published: true,
        name: workspaceApp.name,
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

      // Create two workspace apps
      const { workspaceApp: publishedWorkspaceApp } =
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Published Workspace App",
            urlPrefix: "/publishedapp",
          })
        )

      const { workspaceApp: unpublishedWorkspaceApp } =
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Unpublished Workspace App",
            urlPrefix: "/unpublishedapp",
          })
        )

      // Filtered publish - only publish specific resources
      await config.api.application.filteredPublish(config.app!.appId, {
        automationIds: [publishedAutomation._id!],
        workspaceAppIds: [publishedWorkspaceApp._id!],
      })

      const res = await config.api.deploy.publishStatus()

      // Check published resources
      expect(res.automations[publishedAutomation._id!]).toEqual({
        published: true,
        name: publishedAutomation.name,
      })
      expect(res.workspaceApps[publishedWorkspaceApp._id!]).toEqual({
        published: true,
        name: publishedWorkspaceApp.name,
      })

      // Check unpublished resources
      expect(res.automations[unpublishedAutomation._id!]).toEqual({
        published: false,
        name: unpublishedAutomation.name,
      })
      expect(res.workspaceApps[unpublishedWorkspaceApp._id!]).toEqual({
        published: false,
        name: unpublishedWorkspaceApp.name,
      })
    })

    it("handles app with no production database", async () => {
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
          urlPrefix: "/testapp",
        })
      )

      // Don't publish - no production database should exist
      const res = await config.api.deploy.publishStatus()

      expect(res.automations[automation._id!]).toEqual({
        published: false,
        name: automation.name,
      })
      expect(res.workspaceApps[workspaceApp._id!]).toEqual({
        published: false,
        name: workspaceApp.name,
      })
    })

    it("returns only development resources that exist", async () => {
      const table = await config.api.table.save(basicTable())

      // Create automation
      const { automation } = await createAutomationBuilder(config)
        .onRowSaved({ tableId: table._id! })
        .serverLog({ text: "Test automation" })
        .save()

      // Publish all
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
