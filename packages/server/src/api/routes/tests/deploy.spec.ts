import { db as dbCore } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import { Automation, PublishResourceState, WorkspaceApp } from "@budibase/types"
import { createAutomationBuilder } from "../../../automations/tests/utilities/AutomationTestBuilder"
import { basicTable } from "../../../tests/utilities/structures"
import * as setup from "./utilities"

describe("/api/deploy", () => {
  let config = setup.getConfig()

  afterAll(() => {
    setup.afterAll()
  })

  beforeAll(async () => {
    await config.init()
  })

  beforeEach(async () => {
    await config.newTenant()
  })

  describe("GET /api/deploy/status", () => {
    it("returns empty state when unpublished", async () => {
      await config.api.workspace.unpublish(config.appId!)
      const res = await config.api.deploy.publishStatus()
      for (const automation of Object.values(res.automations)) {
        expect(automation.published).toBe(false)
      }
      // default screens will appear here
      for (const workspaceApp of Object.values(res.workspaceApps)) {
        expect(workspaceApp.published).toBe(false)
      }
    })

    it("returns disabled state for development-only resources", async () => {
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
        state: "disabled",
      })
      expect(res.workspaceApps[workspaceApp._id!]).toEqual({
        published: false,
        name: workspaceApp.name,
        unpublishedChanges: true,
        state: "disabled",
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

      await config.api.workspace.publish(config.app!.appId)

      const res = await config.api.deploy.publishStatus()

      expect(res.automations[automation._id!]).toEqual({
        publishedAt: expect.any(String),
        published: true,
        name: automation.name,
        unpublishedChanges: false,
        state: "published",
      })
      expect(res.workspaceApps[workspaceApp._id!]).toEqual({
        publishedAt: expect.any(String),
        published: true,
        name: workspaceApp.name,
        unpublishedChanges: false,
        state: "published",
      })
      expect(res.tables[table._id!]).toEqual({
        publishedAt: expect.any(String),
        published: true,
        name: table.name,
        unpublishedChanges: false,
        state: "published",
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

      const { workspaceApp: publishedWorkspaceApp } =
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Published Workspace App",
            url: "/publishedapp",
          })
        )

      await config.api.workspace.publish(config.app!.appId)

      const { automation: unpublishedAutomation } =
        await createAutomationBuilder(config)
          .onRowSaved({ tableId: table._id! })
          .serverLog({ text: "Unpublished automation" })
          .save()

      const { workspaceApp: unpublishedWorkspaceApp } =
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Unpublished Workspace App",
            url: "/unpublishedapp",
          })
        )

      const res = await config.api.deploy.publishStatus()

      expect(res.automations[publishedAutomation._id!]).toEqual({
        published: true,
        name: publishedAutomation.name,
        publishedAt: expect.any(String),
        unpublishedChanges: false,
        state: "published",
      })
      expect(res.workspaceApps[publishedWorkspaceApp._id!]).toEqual({
        published: true,
        name: publishedWorkspaceApp.name,
        publishedAt: expect.any(String),
        unpublishedChanges: false,
        state: "published",
      })

      expect(res.automations[unpublishedAutomation._id!]).toEqual({
        published: false,
        name: unpublishedAutomation.name,
        unpublishedChanges: true,
        state: "disabled",
      })
      expect(res.workspaceApps[unpublishedWorkspaceApp._id!]).toEqual({
        published: false,
        name: unpublishedWorkspaceApp.name,
        unpublishedChanges: true,
        state: "disabled",
      })
    })

    it("handles app with disabled automation/workspace app", async () => {
      const table = await config.api.table.save(basicTable())

      const { automation } = await createAutomationBuilder(config)
        .onRowSaved({ tableId: table._id! })
        .serverLog({ text: "Test automation" })
        .save({ disabled: true })

      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Test Workspace App",
          url: "/testapp",
          disabled: true,
        })
      )

      await config.api.workspace.publish(config.app!.appId)
      const res = await config.api.deploy.publishStatus()

      expect(res.automations[automation._id!]).toEqual({
        published: true,
        publishedAt: expect.any(String),
        name: automation.name,
        unpublishedChanges: false,
        state: "disabled",
      })
      expect(res.workspaceApps[workspaceApp._id!]).toEqual({
        published: true,
        publishedAt: expect.any(String),
        name: workspaceApp.name,
        unpublishedChanges: false,
        state: "disabled",
      })
    })

    it("returns only development resources that exist", async () => {
      const table = await config.api.table.save(basicTable())

      const { automation } = await createAutomationBuilder(config)
        .onRowSaved({ tableId: table._id! })
        .serverLog({ text: "Test automation" })
        .save()

      await config.api.workspace.publish(config.app!.appId)

      // Delete automation from development
      await config.api.automation.delete(automation)

      const res = await config.api.deploy.publishStatus()

      // Should not include deleted automation
      expect(res.automations[automation._id!]).toBeUndefined()
      expect(Object.keys(res.automations)).toHaveLength(0)
    })
  })

  describe("POST /api/deploy", () => {
    beforeAll(async () => {
      await config.init()
    })

    beforeEach(async () => {
      await config.unpublish()
    })

    function expectApp(app: WorkspaceApp) {
      return {
        disabled: async (
          disabled: boolean | undefined,
          state: PublishResourceState
        ) => {
          expect((await config.api.workspaceApp.find(app._id!)).disabled).toBe(
            disabled
          )

          const status = await config.api.deploy.publishStatus()
          expect(status.workspaceApps[app._id!]).toEqual(
            expect.objectContaining({
              state,
            })
          )
        },
      }
    }
    function expectAutomation(automation: Automation) {
      return {
        disabled: async (
          disabled: boolean | undefined,
          state: PublishResourceState
        ) => {
          expect(
            (await config.api.automation.get(automation._id!)).disabled
          ).toBe(disabled)

          const status = await config.api.deploy.publishStatus()
          expect(status.automations[automation._id!]).toEqual(
            expect.objectContaining({
              state,
            })
          )
        },
      }
    }

    async function publishProdApp() {
      await config.api.workspace.publish(config.getAppId())
      await config.api.workspace.sync(config.getAppId())
    }

    it("should define the disable value for all workspace apps when publishing for the first time", async () => {
      const { workspaceApp: publishedApp } =
        await config.api.workspaceApp.create({
          name: "Test App 1",
          url: "/app1",
          disabled: false,
        })
      const { workspaceApp: appWithoutInfo } =
        await config.api.workspaceApp.create({
          name: "Test App 2",
          url: "/app2",
        })
      const { workspaceApp: disabledApp } =
        await config.api.workspaceApp.create(
          structures.workspaceApps.createRequest({
            name: "Disabled App",
            url: "/disabled",
            disabled: true,
          })
        )

      expect(publishedApp.disabled).toBe(false)
      expect(appWithoutInfo.disabled).toBeUndefined()
      expect(disabledApp.disabled).toBe(true)

      // Publish the app for the first time
      await publishProdApp()

      await expectApp(publishedApp).disabled(
        false,
        PublishResourceState.PUBLISHED
      )
      await expectApp(appWithoutInfo).disabled(
        true,
        PublishResourceState.DISABLED
      )
      await expectApp(disabledApp).disabled(true, PublishResourceState.DISABLED)
    })

    it("should define the disable value for all automations when publishing for the first time", async () => {
      const table = await config.api.table.save(basicTable())

      const { automation: disabledAutomation } = await createAutomationBuilder(
        config
      )
        .onRowSaved({ tableId: table._id! })
        .save({ disabled: true })
      const { automation: enabledAutomation } = await createAutomationBuilder(
        config
      )
        .onRowSaved({ tableId: table._id! })
        .save({ disabled: false })
      const { automation: automationWithoutInfo } =
        await createAutomationBuilder(config)
          .onRowSaved({ tableId: table._id! })
          .save({ disabled: undefined })

      // Verify apps are not disabled before publishing
      expect(disabledAutomation.disabled).toBe(true)
      expect(enabledAutomation.disabled).toBe(false)
      expect(automationWithoutInfo.disabled).toBe(undefined)

      // Publish the app for the first time
      await publishProdApp()

      await expectAutomation(disabledAutomation).disabled(
        true,
        PublishResourceState.DISABLED
      )
      await expectAutomation(enabledAutomation).disabled(
        false,
        PublishResourceState.PUBLISHED
      )
      await expectAutomation(automationWithoutInfo).disabled(
        true,
        PublishResourceState.DISABLED
      )
    })

    it("should not disable workspace apps on subsequent publishes", async () => {
      const { workspaceApp: initialApp } = await config.api.workspaceApp.create(
        {
          name: "Test App 1",
          url: "/app1",
          disabled: undefined,
        }
      )
      await publishProdApp()

      // Remove disabled flag, simulating old apps
      const db = dbCore.getDB(config.getAppId())
      await db.put({
        ...(await config.api.workspaceApp.find(initialApp._id)),
        disabled: undefined,
      })

      const { workspaceApp: secondApp } = await config.api.workspaceApp.create({
        name: "Test App 2",
        url: "/app2",
        disabled: true,
      })
      await publishProdApp()

      await expectApp(initialApp).disabled(
        undefined,
        PublishResourceState.PUBLISHED
      )
      await expectApp(secondApp).disabled(true, PublishResourceState.DISABLED)
    })

    it("should not disable automations on subsequent publishes", async () => {
      const table = await config.api.table.save(basicTable())

      const { automation: initialAutomation } = await createAutomationBuilder(
        config
      )
        .onRowSaved({ tableId: table._id! })
        .save({ disabled: undefined })

      await publishProdApp()

      // Remove disabled flag, simulating old automations
      const db = dbCore.getDB(config.getAppId())
      await db.put({
        ...(await config.api.automation.get(initialAutomation._id!)),
        disabled: undefined,
      })

      const { automation: secondAutomation } = await createAutomationBuilder(
        config
      )
        .onRowSaved({ tableId: table._id! })
        .save({ disabled: true })
      await publishProdApp()

      await expectAutomation(initialAutomation).disabled(
        undefined,
        PublishResourceState.PUBLISHED
      )
      await expectAutomation(secondAutomation).disabled(
        true,
        PublishResourceState.DISABLED
      )
    })
  })
})
