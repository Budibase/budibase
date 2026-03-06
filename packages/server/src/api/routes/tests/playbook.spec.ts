import { features } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import { FeatureFlag } from "@budibase/types"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"

describe("/playbooks", () => {
  const config = new TestConfiguration()

  afterAll(() => {
    config.end()
  })

  const withPlaybooksEnabled = async <T>(f: () => Promise<T>) => {
    return await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.PLAYBOOKS]: true },
      f
    )
  }

  beforeEach(async () => {
    await config.newTenant()
  })

  it("returns 404 when the feature flag is disabled", async () => {
    await config.api.playbook.fetch({ status: 404 })
  })

  it("creates and fetches playbooks when the feature is enabled", async () => {
    await withPlaybooksEnabled(async () => {
      const { playbook } = await config.api.playbook.create({
        name: "Operations",
        description: "Operational workflows",
        color: "#8CA171",
      })

      expect(playbook._id).toBeDefined()
      expect(playbook.name).toBe("Operations")

      const { playbooks } = await config.api.playbook.fetch()
      expect(playbooks.map(existing => existing._id)).toContain(playbook._id)
    })
  })

  it("rejects assigning an unknown playbook id", async () => {
    await withPlaybooksEnabled(async () => {
      await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          playbookId: "playbook_missing",
        }),
        {
          status: 404,
          body: {
            message: "Playbook 'playbook_missing' not found.",
          },
        }
      )

      const automation = await config.createAutomation()
      await config.api.automation.update(
        {
          ...automation,
          playbookId: "playbook_missing",
        },
        {
          status: 404,
          body: {
            message: "Playbook 'playbook_missing' not found.",
          },
        }
      )

      await config.api.agent.create(
        {
          name: "Ops agent",
          aiconfig: "default",
          playbookId: "playbook_missing",
        },
        {
          status: 404,
          body: {
            message: "Playbook 'playbook_missing' not found.",
          },
        }
      )
    })
  })

  it("rejects assigning a playbook while the feature is disabled", async () => {
    await config.api.workspaceApp.create(
      structures.workspaceApps.createRequest({
        name: "Ops app",
        url: "/ops-app",
        playbookId: "playbook_1",
      }),
      {
        status: 404,
        body: {
          message: "Playbooks feature is not enabled.",
        },
      }
    )
  })

  it("clears assignments when deleting a playbook", async () => {
    await withPlaybooksEnabled(async () => {
      const { playbook } = await config.api.playbook.create({
        name: "Operations",
      })

      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          playbookId: playbook._id,
        })
      )

      const automation = await config.createAutomation()
      const { automation: updatedAutomation } =
        await config.api.automation.update({
          ...automation,
          playbookId: playbook._id,
        })

      const agent = await config.api.agent.create({
        name: "Ops agent",
        aiconfig: "default",
        playbookId: playbook._id,
      })

      await config.api.playbook.delete(playbook._id, playbook._rev)

      const fetchedWorkspaceApp = await config.api.workspaceApp.find(
        workspaceApp._id!
      )
      expect(fetchedWorkspaceApp.playbookId).toBeUndefined()

      const fetchedAutomation = await config.api.automation.get(
        updatedAutomation._id!
      )
      expect(fetchedAutomation.playbookId).toBeUndefined()

      const { agents } = await config.api.agent.fetch()
      const fetchedAgent = agents.find(existing => existing._id === agent._id)
      expect(fetchedAgent?.playbookId).toBeUndefined()
    })
  })
})
