import { features } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import { FeatureFlag } from "@budibase/types"
import sdk from "../../../sdk"
import TestConfiguration from "../../../tests/utilities/TestConfiguration"
import { setupDefaultCompletionsAIConfig } from "../../../tests/utilities/aiConfig"
import {
  basicDatasource,
  basicQuery,
  basicTable,
} from "../../../tests/utilities/structures"

describe("/projects", () => {
  const config = new TestConfiguration()
  let cleanupAIConfig: undefined | (() => Promise<void>)

  afterAll(() => {
    config.end()
  })

  const withProjectsEnabled = async <T>(f: () => Promise<T>) => {
    return await features.testutils.withFeatureFlags(
      config.getTenantId(),
      { [FeatureFlag.PROJECTS]: true },
      f
    )
  }

  beforeEach(async () => {
    await config.newTenant()
    cleanupAIConfig = await setupDefaultCompletionsAIConfig(config, "default")
  })

  afterEach(async () => {
    await cleanupAIConfig?.()
    cleanupAIConfig = undefined
  })

  it("returns 404 when the feature flag is disabled", async () => {
    await config.api.project.fetch({ status: 404 })
  })

  it("creates and fetches projects when the feature is enabled", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
        description: "Operational workflows",
        color: "#8CA171",
      })

      expect(project._id).toBeDefined()
      expect(project.name).toBe("Operations")

      const { projects } = await config.api.project.fetch()
      expect(projects.map(existing => existing._id)).toContain(project._id)
    })
  })

  it("updates projects without client timestamps", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
        description: "Initial",
      })

      const updated = await config.api.project.update({
        _id: project._id,
        _rev: project._rev,
        name: "Operations revised",
        description: "Updated",
        color: "#8CA171",
      })

      expect(updated.project.name).toBe("Operations revised")
      expect(updated.project.description).toBe("Updated")
      expect(updated.project.createdAt).toBe(project.createdAt)
    })
  })

  it("rejects path and body project id mismatches on update", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })

      await config.api.project.update(
        {
          ...project,
          name: "Updated operations",
        },
        {
          status: 400,
          body: {
            message: "Path and body ids do not match",
          },
        },
        "project_mismatch"
      )
    })
  })

  it("rejects updates without a revision", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const updateWithoutRev = {
        _id: project._id,
        name: "Updated operations",
      } as unknown as Parameters<typeof config.api.project.update>[0]

      await config.api.project.update(updateWithoutRev, {
        status: 400,
      })
    })
  })

  it("rejects stale revisions on update", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })

      await config.api.project.update({
        ...project,
        name: "Updated operations",
      })

      await config.api.project.update(
        {
          ...project,
          name: "Stale operations",
        },
        {
          status: 409,
        }
      )
    })
  })

  it("rejects sdk updates without a revision", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })

      await expect(
        config.doInContext(config.getDevWorkspaceId(), async () =>
          sdk.projects.update({
            _id: project._id,
            name: "Updated operations",
          } as Parameters<typeof sdk.projects.update>[0])
        )
      ).rejects.toThrow("Project revision is required.")

      const { projects } = await config.api.project.fetch()
      expect(
        projects.find(existing => existing._id === project._id)?.name
      ).toBe("Operations")
    })
  })

  it("rejects assigning an unknown project id", async () => {
    await withProjectsEnabled(async () => {
      const datasource = await config.api.datasource.create(
        basicDatasource().datasource
      )

      await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          projectId: "project_missing",
        }),
        {
          status: 404,
          body: {
            message: "Project 'project_missing' not found.",
          },
        }
      )

      const automation = await config.createAutomation()
      await config.api.automation.update(
        {
          ...automation,
          projectId: "project_missing",
        },
        {
          status: 404,
          body: {
            message: "Project 'project_missing' not found.",
          },
        }
      )

      await config.api.agent.create(
        {
          name: "Ops agent",
          aiconfig: "default",
          projectId: "project_missing",
        },
        {
          status: 404,
          body: {
            message: "Project 'project_missing' not found.",
          },
        }
      )

      await config.api.table.save(
        {
          ...basicTable(),
          projectId: "project_missing",
        },
        {
          status: 404,
          body: {
            message: "Project 'project_missing' not found.",
          },
        }
      )

      await config.api.query.save(
        {
          ...basicQuery(datasource._id!),
          projectId: "project_missing",
        },
        {
          status: 404,
          body: {
            message: "Project 'project_missing' not found.",
          },
        }
      )

      await config.api.datasource.create(
        {
          ...basicDatasource().datasource,
          projectId: "project_missing",
        },
        {
          status: 404,
          body: {
            message: "Project 'project_missing' not found.",
          },
        }
      )
    })
  })

  it("rejects assigning a project while the feature is disabled", async () => {
    await config.api.workspaceApp.create(
      structures.workspaceApps.createRequest({
        name: "Ops app",
        url: "/ops-app",
        projectId: "project_1",
      }),
      {
        status: 404,
        body: {
          message: "Projects feature is not enabled.",
        },
      }
    )
  })

  it("clears assignments when deleting a project", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })

      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          projectId: project._id,
        })
      )

      const automation = await config.createAutomation()
      const { automation: updatedAutomation } =
        await config.api.automation.update({
          ...automation,
          projectId: project._id,
        })

      const agent = await config.api.agent.create({
        name: "Ops agent",
        aiconfig: "default",
        projectId: project._id,
      })

      const table = await config.api.table.save({
        ...basicTable(),
        projectId: project._id,
      })

      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        projectId: project._id,
      })

      const queryRequest = basicQuery(datasource._id!)
      delete (queryRequest as Partial<typeof queryRequest>).readable
      const query = await config.api.query.save({
        ...queryRequest,
        projectId: project._id,
      })

      await config.api.project.delete(project._id, project._rev)

      const fetchedWorkspaceApp = await config.api.workspaceApp.find(
        workspaceApp._id!
      )
      expect(fetchedWorkspaceApp.projectId).toBeUndefined()

      const fetchedAutomation = await config.api.automation.get(
        updatedAutomation._id!
      )
      expect(fetchedAutomation.projectId).toBeUndefined()

      const { agents } = await config.api.agent.fetch()
      const fetchedAgent = agents.find(existing => existing._id === agent._id)
      expect(fetchedAgent?.projectId).toBeUndefined()

      const fetchedTable = await config.api.table.get(table._id!)
      expect(fetchedTable.projectId).toBeUndefined()

      const fetchedDatasource = await config.api.datasource.get(datasource._id!)
      expect(fetchedDatasource.projectId).toBeUndefined()

      const fetchedQuery = await config.api.query.get(query._id!)
      expect(fetchedQuery.projectId).toBeUndefined()

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const rawQuery = await context.getWorkspaceDB().get(query._id!)
        expect(rawQuery).not.toHaveProperty("readable")
      })
    })
  })

  it("does not clear assignments when deleting with a stale rev", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          projectId: project._id,
        })
      )

      await config.api.project.delete(project._id, "1-stale", {
        status: 409,
      })

      const fetchedWorkspaceApp = await config.api.workspaceApp.find(
        workspaceApp._id!
      )
      expect(fetchedWorkspaceApp.projectId).toBe(project._id)
    })
  })

  it("preserves assignments when updates omit project ids", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          projectId: project._id,
        })
      )
      const automation = await config.createAutomation()
      const { automation: assignedAutomation } =
        await config.api.automation.update({
          ...automation,
          projectId: project._id,
        })
      const agent = await config.api.agent.create({
        name: "Ops agent",
        aiconfig: "default",
        projectId: project._id,
      })
      const table = await config.api.table.save({
        ...basicTable(),
        projectId: project._id,
      })
      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        projectId: project._id,
      })
      const query = await config.api.query.save({
        ...basicQuery(datasource._id!),
        projectId: project._id,
      })

      const { workspaceApp: updatedWorkspaceApp } =
        await config.api.workspaceApp.update({
          _id: workspaceApp._id,
          _rev: workspaceApp._rev,
          name: "Ops app updated",
          url: workspaceApp.url,
          navigation: workspaceApp.navigation,
          theme: workspaceApp.theme,
          customTheme: workspaceApp.customTheme,
          disabled: workspaceApp.disabled,
        })

      const { projectId: _automationProjectId, ...automationUpdate } =
        assignedAutomation
      const { automation: updatedAutomation } =
        await config.api.automation.update({
          ...automationUpdate,
          name: "Ops automation updated",
        })

      const { projectId: _agentProjectId, ...agentUpdate } = agent
      const updatedAgent = await config.api.agent.update({
        ...agentUpdate,
        name: "Ops agent updated",
      })

      const { projectId: _tableProjectId, ...tableUpdate } = table
      const updatedTable = await config.api.table.save({
        ...tableUpdate,
        name: "Ops table updated",
      })

      const { projectId: _datasourceProjectId, ...datasourceUpdate } =
        datasource
      const updatedDatasource = await config.api.datasource.update({
        ...datasourceUpdate,
        name: "Ops datasource updated",
      })

      const { projectId: _queryProjectId, ...queryUpdate } = query
      const updatedQuery = await config.api.query.save({
        ...queryUpdate,
        name: "Ops query updated",
      })

      expect(updatedWorkspaceApp.projectId).toBe(project._id)
      expect(updatedAutomation.projectId).toBe(project._id)
      expect(updatedAgent.projectId).toBe(project._id)
      expect(updatedTable.projectId).toBe(project._id)
      expect(updatedDatasource.projectId).toBe(project._id)
      expect(updatedQuery.projectId).toBe(project._id)
    })
  })
})
