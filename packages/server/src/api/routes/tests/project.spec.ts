import { context, features } from "@budibase/backend-core"
import { structures } from "@budibase/backend-core/tests"
import { FeatureFlag, type Project } from "@budibase/types"
import { toProjectResponse } from "../../controllers/project"
import sdk from "../../../sdk"
import { buildExternalTableId } from "../../../integrations/utils"
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

  it("returns valid timestamps for projects with invalid persisted timestamps", async () => {
    await withProjectsEnabled(async () => {
      await config.doInContext(config.getDevWorkspaceId(), async () => {
        await context.getWorkspaceDB().put({
          _id: "project_legacy",
          name: "Legacy project",
          createdAt: "invalid",
        })
      })

      const { projects } = await config.api.project.fetch()
      const project = projects.find(
        existing => existing._id === "project_legacy"
      )

      expect(project!.createdAt).toBe(project!.updatedAt)
    })
  })

  it("uses the created timestamp when the updated timestamp is invalid", () => {
    const createdAt = "2026-06-08T10:00:00.000Z"
    const project = toProjectResponse({
      _id: "project_legacy",
      _rev: "1-test",
      name: "Legacy project",
      createdAt,
      updatedAt: "invalid",
    } as Project)

    expect(project.createdAt).toBe(createdAt)
    expect(project.updatedAt).toBe(createdAt)
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

  it.each([
    "red; background-image: url(https://example.com/tracker)",
    "url(https://example.com/tracker)",
  ])("rejects unsafe project color '%s'", async color => {
    await withProjectsEnabled(async () => {
      await config.api.project.create(
        {
          name: "Unsafe color",
          color,
        },
        {
          status: 400,
          body: {
            message: "Project color is invalid.",
          },
        }
      )
    })
  })

  it.each([
    "#8CA171",
    "rgb(140, 161, 113)",
    "hsl(93deg 22% 54%)",
    "var(--spectrum-global-color-green-500)",
  ])("accepts safe project color '%s'", async color => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Safe color",
        color,
      })

      expect(project.color).toBe(color)
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
      }

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
          projectIds: ["project_missing"],
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
          projectIds: ["project_missing"],
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
          projectIds: ["project_missing"],
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
          projectIds: ["project_missing"],
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
          projectIds: ["project_missing"],
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
          projectIds: ["project_missing"],
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
        projectIds: ["project_1"],
      }),
      {
        status: 404,
        body: {
          message: "Projects feature is not enabled.",
        },
      }
    )
  })

  it("validates external table project assignments on datasource updates", async () => {
    await withProjectsEnabled(async () => {
      const datasource = await config.api.datasource.create(
        basicDatasource().datasource
      )
      const externalTable = basicTable(datasource, {
        _id: buildExternalTableId(datasource._id!, "TestTable"),
        projectIds: ["project_missing"],
      })

      await config.api.datasource.update(
        {
          ...datasource,
          entities: {
            [externalTable.name]: externalTable,
          },
        },
        {
          status: 404,
          body: {
            message: "Project 'project_missing' not found.",
          },
        }
      )

      const fetchedDatasource = await config.api.datasource.get(datasource._id!)
      expect(fetchedDatasource.entities).toBeUndefined()
    })
  })

  it.each([null, "invalid", []])(
    "rejects malformed datasource entities",
    async value => {
      const datasource = await config.api.datasource.create(
        basicDatasource().datasource
      )

      await config.api.datasource.updateWithInvalidEntities(
        {
          ...datasource,
          entities: {
            TestTable: value,
          },
        },
        {
          status: 400,
          body: {
            message: "Datasource entity 'TestTable' must be an object.",
          },
        }
      )
    }
  )

  it("rejects external table project assignments while disabled", async () => {
    const datasource = await config.api.datasource.create(
      basicDatasource().datasource
    )
    const externalTable = basicTable(datasource, {
      _id: buildExternalTableId(datasource._id!, "TestTable"),
      projectIds: ["project_1"],
    })

    await config.api.datasource.update(
      {
        ...datasource,
        entities: {
          [externalTable.name]: externalTable,
        },
      },
      {
        status: 404,
        body: {
          message: "Projects feature is not enabled.",
        },
      }
    )
  })

  it("preserves omitted external table project assignments", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const datasource = await config.api.datasource.create(
        basicDatasource().datasource
      )
      const externalTable = basicTable(datasource, {
        _id: buildExternalTableId(datasource._id!, "TestTable"),
        projectIds: [project._id],
      })
      const assignedDatasource = await config.api.datasource.update({
        ...datasource,
        entities: {
          [externalTable.name]: externalTable,
        },
      })
      const { projectIds: _projectIds, ...tableUpdate } =
        assignedDatasource.entities![externalTable.name]

      const updatedDatasource = await config.api.datasource.update({
        ...assignedDatasource,
        entities: {
          [externalTable.name]: {
            ...tableUpdate,
            name: "Updated table",
          },
        },
      })

      expect(
        updatedDatasource.entities![externalTable.name].projectIds
      ).toEqual([project._id])
    })
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
          projectIds: [project._id],
        })
      )

      const automation = await config.createAutomation()
      const { automation: updatedAutomation } =
        await config.api.automation.update({
          ...automation,
          projectIds: [project._id],
        })

      const agent = await config.api.agent.create({
        name: "Ops agent",
        aiconfig: "default",
        projectIds: [project._id],
      })

      const table = await config.api.table.save({
        ...basicTable(),
        projectIds: [project._id],
      })

      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        projectIds: [project._id],
      })

      const queryRequest = basicQuery(datasource._id!)
      delete (queryRequest as Partial<typeof queryRequest>).readable
      const query = await config.api.query.save({
        ...queryRequest,
        projectIds: [project._id],
      })

      await config.api.project.delete(project._id, project._rev)

      const fetchedWorkspaceApp = await config.api.workspaceApp.find(
        workspaceApp._id!
      )
      expect(fetchedWorkspaceApp.projectIds).toBeUndefined()

      const fetchedAutomation = await config.api.automation.get(
        updatedAutomation._id!
      )
      expect(fetchedAutomation.projectIds).toBeUndefined()

      const { agents } = await config.api.agent.fetch()
      const fetchedAgent = agents.find(existing => existing._id === agent._id)
      expect(fetchedAgent?.projectIds).toBeUndefined()

      const fetchedTable = await config.api.table.get(table._id!)
      expect(fetchedTable.projectIds).toBeUndefined()

      const fetchedDatasource = await config.api.datasource.get(datasource._id!)
      expect(fetchedDatasource.projectIds).toBeUndefined()

      const fetchedQuery = await config.api.query.get(query._id!)
      expect(fetchedQuery.projectIds).toBeUndefined()

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const rawQuery = await context.getWorkspaceDB().get(query._id!)
        expect(rawQuery).not.toHaveProperty("readable")
      })
    })
  })

  it("clears datasource and external table assignments together", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        projectIds: [project._id],
      })
      const entityKey = "TestTable"
      const externalTable = basicTable(datasource, {
        _id: buildExternalTableId(datasource._id!, entityKey),
        name: "Updated table",
        projectIds: [project._id],
      })
      await config.api.datasource.update({
        ...datasource,
        entities: {
          [entityKey]: externalTable,
        },
      })

      await config.api.project.delete(project._id, project._rev)

      const fetchedDatasource = await config.api.datasource.get(datasource._id!)
      expect(fetchedDatasource.projectIds).toBeUndefined()
      expect(fetchedDatasource.entities![entityKey].projectIds).toBeUndefined()
      expect(fetchedDatasource.entities![externalTable.name]).toBeUndefined()
      expect(Object.keys(fetchedDatasource.entities!)).toEqual([entityKey])
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
          projectIds: [project._id],
        })
      )

      await config.api.project.delete(project._id, "1-stale", {
        status: 409,
      })

      const fetchedWorkspaceApp = await config.api.workspaceApp.find(
        workspaceApp._id!
      )
      expect(fetchedWorkspaceApp.projectIds).toEqual([project._id])
    })
  })

  it("does not clear assignments when project deletion fails", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          projectIds: [project._id],
        })
      )

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const db = context.getWorkspaceDB()
        const remove = jest
          .spyOn(Object.getPrototypeOf(db), "remove")
          .mockRejectedValueOnce(new Error("Project deletion failed"))

        try {
          await expect(
            sdk.projects.remove(project._id, project._rev)
          ).rejects.toThrow("Project deletion failed")
        } finally {
          remove.mockRestore()
        }
      })

      const fetchedWorkspaceApp = await config.api.workspaceApp.find(
        workspaceApp._id!
      )
      expect(fetchedWorkspaceApp.projectIds).toEqual([project._id])
    })
  })

  it("continues restoring assignments when a rollback fails", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          projectIds: [project._id],
        })
      )
      const automation = await config.createAutomation()
      const { automation: assignedAutomation } =
        await config.api.automation.update({
          ...automation,
          projectIds: [project._id],
        })

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const db = context.getWorkspaceDB()
        const remove = jest
          .spyOn(Object.getPrototypeOf(db), "remove")
          .mockRejectedValueOnce(new Error("Project deletion failed"))
        const originalUpdateAutomation = sdk.automations.update
        const updateAutomation = jest
          .spyOn(sdk.automations, "update")
          .mockImplementation(async update => {
            if (update.projectIds?.includes(project._id)) {
              throw new Error("Automation rollback failed")
            }
            return await originalUpdateAutomation(update)
          })

        try {
          await expect(
            sdk.projects.remove(project._id, project._rev)
          ).rejects.toThrow("Project deletion failed")
        } finally {
          remove.mockRestore()
          updateAutomation.mockRestore()
        }
      })

      const fetchedWorkspaceApp = await config.api.workspaceApp.find(
        workspaceApp._id!
      )
      expect(fetchedWorkspaceApp.projectIds).toEqual([project._id])
      const fetchedAutomation = await config.api.automation.get(
        assignedAutomation._id!
      )
      expect(fetchedAutomation.projectIds).toBeUndefined()
    })
  })

  it("does not delete a project when assignment cleanup fails", async () => {
    await withProjectsEnabled(async () => {
      const { project } = await config.api.project.create({
        name: "Operations",
      })
      const { workspaceApp } = await config.api.workspaceApp.create(
        structures.workspaceApps.createRequest({
          name: "Ops app",
          url: "/ops-app",
          projectIds: [project._id],
        })
      )

      await config.doInContext(config.getDevWorkspaceId(), async () => {
        const db = context.getWorkspaceDB()
        const put = jest
          .spyOn(Object.getPrototypeOf(db), "put")
          .mockRejectedValueOnce(new Error("Assignment cleanup failed"))

        try {
          await expect(
            sdk.projects.remove(project._id, project._rev)
          ).rejects.toThrow("Assignment cleanup failed")
        } finally {
          put.mockRestore()
        }
      })

      const fetchedProject = await config.api.project.fetch()
      expect(fetchedProject.projects.map(existing => existing._id)).toContain(
        project._id
      )
      const fetchedWorkspaceApp = await config.api.workspaceApp.find(
        workspaceApp._id!
      )
      expect(fetchedWorkspaceApp.projectIds).toEqual([project._id])
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
          projectIds: [project._id],
        })
      )
      const automation = await config.createAutomation()
      const { automation: assignedAutomation } =
        await config.api.automation.update({
          ...automation,
          projectIds: [project._id],
        })
      const agent = await config.api.agent.create({
        name: "Ops agent",
        aiconfig: "default",
        projectIds: [project._id],
      })
      const table = await config.api.table.save({
        ...basicTable(),
        projectIds: [project._id],
      })
      const datasource = await config.api.datasource.create({
        ...basicDatasource().datasource,
        projectIds: [project._id],
      })
      const query = await config.api.query.save({
        ...basicQuery(datasource._id!),
        projectIds: [project._id],
      })

      const updatedWorkspaceApp = await config.doInContext(
        config.getDevWorkspaceId(),
        async () =>
          await sdk.workspaceApps.update({
            _id: workspaceApp._id,
            _rev: workspaceApp._rev,
            name: "Ops app updated",
            url: workspaceApp.url,
            navigation: workspaceApp.navigation,
            theme: workspaceApp.theme,
            customTheme: workspaceApp.customTheme,
            disabled: workspaceApp.disabled,
          })
      )

      const { projectIds: _automationProjectIds, ...automationUpdate } =
        assignedAutomation
      const { automation: updatedAutomation } =
        await config.api.automation.update({
          ...automationUpdate,
          name: "Ops automation updated",
        })

      const { projectIds: _agentProjectIds, ...agentUpdate } = agent
      const updatedAgent = await config.api.agent.update({
        ...agentUpdate,
        name: "Ops agent updated",
      })

      const { projectIds: _tableProjectIds, ...tableUpdate } = table
      const updatedTable = await config.api.table.save({
        ...tableUpdate,
        name: "Ops table updated",
      })

      const { projectIds: _datasourceProjectIds, ...datasourceUpdate } =
        datasource
      const updatedDatasource = await config.api.datasource.update({
        ...datasourceUpdate,
        name: "Ops datasource updated",
      })

      const { projectIds: _queryProjectIds, ...queryUpdate } = query
      const updatedQuery = await config.api.query.save({
        ...queryUpdate,
        name: "Ops query updated",
      })

      expect(updatedWorkspaceApp.projectIds).toEqual([project._id])
      expect(updatedAutomation.projectIds).toEqual([project._id])
      expect(updatedAgent.projectIds).toEqual([project._id])
      expect(updatedTable.projectIds).toEqual([project._id])
      expect(updatedDatasource.projectIds).toEqual([project._id])
      expect(updatedQuery.projectIds).toEqual([project._id])
    })
  })
})
